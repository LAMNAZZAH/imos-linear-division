import { BinaryExpression, NumberLiteral, Section, Sections, SpecialVariable } from "./types";
import { handleNFactor } from "./utils/handleNFactor";

import { logger } from "./utils/logger";

enum DimRef {
    I = "I",
    O = "O",
    M = "M",
};

type DimRefProps = {
    sizerefout1: DimRef;
    sizerefedg1: DimRef;
    sizerefmid: DimRef;
    sizerefedg2: DimRef;
    sizerefout2: DimRef;
};

export class SectionNSpecialVariable {
    public processNSpecialVariable(
        node: NumberLiteral | BinaryExpression,
        index: number,
        dividerThickness: number,
        rest: number,
        dimRefProps: DimRefProps | undefined,
        sections: Sections) {
        if (node.type === "BinaryExpression") {
            const binaryExpression = node as BinaryExpression;
            if (
              binaryExpression.right.type === "NumberLiteral" &&
              binaryExpression.left.type === "SpecialVariable" &&
              (binaryExpression.left as SpecialVariable).name === "n" &&
              binaryExpression.operator === "*"
            ) {
              let rawNFactor = (binaryExpression.right as NumberLiteral).value;
  
              logger.log("[rawNFactor]: ", rawNFactor);
  
              let { nStartFactor, nMiddleFactor, nEndFactor } = handleNFactor(
                rawNFactor,
                index,
                dividerThickness,
                dimRefProps,
                sections
              );
  
              logger.log("[nStartFactor]: ", nStartFactor);
              logger.log("[nMiddleFactor]: ", nMiddleFactor);
              logger.log("[nEndFactor]: " +  nEndFactor + "\n\n");
  
              const addSection = (factor: number) => {
                //accumulatedDRFromMmValues += (rawNFactor - factor);
  
                logger.log("[NSectionDrValue]: ", (rawNFactor - factor));
                logger.log("added factor: ", factor + "\n");
  
                const newSection: Section = {
                  type: "Section",
                  nodes: {
                    type: "NumberLiteral",
                    value: factor,
                    hasMillimeterSuffix: true,
                  } as NumberLiteral,
                };
                newSections.push(newSection);
              };
  
              const newSections: Section[] = [];
              let nTimes = 0;
              nTimes = Math.floor(
                (rest + dividerThickness) / Math.min(nStartFactor, nMiddleFactor, nEndFactor)
              );
              let totalNLength = rest;
              // further process nTimes
              let n = 0;
              let r = totalNLength;
              while (
                n <= nTimes &&
                r >= Math.min(nStartFactor, nMiddleFactor, nEndFactor)
              ) {
                if (n === nTimes) {
                  r -= nEndFactor;
                  addSection(nEndFactor);
                  logger.log("[n]: " +  n + " [r]: " + r + " [nEndFactor]: " + nEndFactor);
                  n++;
                  break;
                } else if (r >= dividerThickness + nMiddleFactor + nEndFactor) {
                  r -= dividerThickness + nMiddleFactor;
                  if (n === 0) {
                    addSection(nStartFactor);
                    logger.log("[n]: " +  n + " [r]: " + r + " [nStartFactor]: " + nStartFactor);
                  } else {
                    addSection(nMiddleFactor);
                    logger.log("[n]: " +  n + " [r]: " + r + " [nMiddleFactor]: " + nMiddleFactor);
                  }
                  n++;
                } else if (r >= nEndFactor) {
                  r -= nEndFactor;
                  addSection(nEndFactor);
                  logger.log("[n]: " +  n + " [r]: " + r + " [nEndFactor]: " + nEndFactor);
                  n++;
                  break;
                } else { 
                  break;
                }
              }
              rest = r;
              totalNLength -= r;
              nTimes = n;
  
              logger.log("\n\n[nTimes]: " + nTimes + " [rest]: " + rest + " [totalNLength]: " + totalNLength);
  
              sections.sections.splice(index, 1, ...newSections);
            }
          }

          return { rest, sections };
    }
}