import { EvaluationErrors } from "./types";
import { traverseTree } from "./traverseTree";

import { SectionExpender } from "./SectionExpander";

import { logger } from "./utils/logger";

import {
  BinaryExpression,
  NumberLiteral,
  Section,
  Sections,
} from "./types";

import { SectionSpreadMm } from "./SectionSpreadMm";
import { SectionMmValues } from "./SectionMmValues";
import { SectionNSpecialVariable } from "./SectionNSpecialVariable";
import { SectionRatioValues } from "./SectionRatioValues";
import { SectionRatiosDR } from "./SectionRatiosDR";
import { SectionCalculation } from "./SectionCalculation";


enum DimRef {
  I = "I",
  O = "O",
  M = "M",
}

type DimRefProps = {
  sizerefout1: DimRef;
  sizerefedg1: DimRef;
  sizerefmid: DimRef;
  sizerefedg2: DimRef;
  sizerefout2: DimRef;
};

export class Calculator {
  public calculateSections(
    ast: Sections | Section,
    totalLength: number = 500,
    dividerThickness: number = 0,
    dimRefProps?: DimRefProps
  ): number[] | EvaluationErrors {
    const sectionExpender = new SectionExpender();
    const sectionSpreadMm = new SectionSpreadMm();
    const sectionMmValues = new SectionMmValues();
    const sectionNSpecialVariable = new SectionNSpecialVariable();
    const sectionRatioValues = new SectionRatioValues();
    const sectionRatiosDR = new SectionRatiosDR();
    const sectionCalculation = new SectionCalculation();

    try {
      logger.log("\n\n Start Sections Calculation \n ------------------- [] ----------------------")
      logger.log("[Sections] ", ast);
      logger.log("------------------- [] ----------------------")
      logger.log("[TotalLength] ", totalLength)
      logger.log("[DividerThickness] ", dividerThickness)
      logger.log("[DimRefProps] ", dimRefProps)

      if (ast instanceof EvaluationErrors) {
        throw ast;
      }

      if (ast.type !== "Sections" && ast.type !== "Section") {
        throw new EvaluationErrors(
          `Expected Sections or Section, got ${JSON.stringify(ast)}`
        );
      }

      let sections: Sections = sectionExpender.expandRepeated(ast);
      sectionSpreadMm.spreadMm(sections);

      let accumulatedDRFromMmValues = 0;

      // for section in sections get mm values
      let accumulatedMmValues = 0;

      logger.log("------------------- [] ----------------------")
      logger.log("Step 01: Accumulate Mm Values")
      logger.log("------------------- [] ----------------------")
      sections.sections.forEach((section, index) => {
        traverseTree(
          section,
          (node: NumberLiteral | BinaryExpression | Section) => {
            const result = sectionMmValues.accumulateMmValues(
              node,
              index,
              dividerThickness,
              accumulatedMmValues,
              dimRefProps,
              sections
            );
            accumulatedMmValues = result.accumulatedMmValues;
            sections = result.sections;
          }
        );
      });

      if (accumulatedMmValues > totalLength) {
        throw new EvaluationErrors("Total length exceeded");
      }

      let rest = totalLength - accumulatedMmValues;
      logger.log("[Rest] ", rest);


      logger.log("------------------- [] ----------------------")
      logger.log("Step 02: Process N Special Variable")
      logger.log("------------------- [] ----------------------")
      sections.sections.forEach((section, index) => {
        traverseTree(section, (node: NumberLiteral | BinaryExpression) => {
          const result = sectionNSpecialVariable.processNSpecialVariable(
            node,
            index,
            dividerThickness,
            rest,
            dimRefProps,
            sections
          );
          rest = result.rest;
          sections = result.sections;
        });
      });

      let totalRatios = 0;


      logger.log("------------------- [] ----------------------")
      logger.log("Step 03: Accumulate Ratio Values")
      logger.log("------------------- [] ----------------------")
      sections.sections.forEach((section) => {
        traverseTree(section, (section: NumberLiteral | BinaryExpression) => {
          totalRatios = sectionRatioValues.accumulateRatioValues(section);
        });
      });

      logger.log("------------------- [] ----------------------")
      logger.log("Step 04: adjust Ratio Dimension Reference")
      logger.log("------------------- [] ----------------------")
      sections.sections.forEach((node, index) => {
        traverseTree(node, (node: NumberLiteral | BinaryExpression) => {
          const result = sectionRatiosDR.adjustRatiosDR(node, index, totalRatios, dimRefProps, dividerThickness, sections);
          if (result != undefined) {
            sections = result;
          }
        });
      });

      const ratioUnitValue = totalRatios != 0 ? rest / totalRatios : 0;
      logger.log("[RatioUnitValue] ", ratioUnitValue)

      
      let sectionResult : number[] = [];

      logger.log("------------------- [] ----------------------")
      logger.log("Step 05: calculate Sections")
      logger.log("------------------- [] ----------------------")
      sections.sections.forEach((node, index) => {
        //console.log("-- lets go a section index to calculate: ", index);
        traverseTree(node, (node: NumberLiteral | BinaryExpression) => {
          sectionResult = sectionCalculation.calculateSection(node, index, accumulatedDRFromMmValues, totalRatios, ratioUnitValue)
        });
      });

      logger.log("------------------- [] ----------------------")
      logger.log("[Result] ", sectionResult)
      logger.log("------------------- [] ----------------------")
      
      return sectionResult;
    } catch (error) {
      return new EvaluationErrors("Error calculating sections");
    }
  }
}
