import { EvaluationErrors } from './types';
import { Node } from './Evaluator';
import { traverseTree } from './traverseTree';

import {
  BinaryExpression,
  NumberLiteral,
  Repeated,
  Section,
  Sections,
  SpecialVariable,
} from './types';

export class Calculator {
  public calculateSections(
    ast: Sections | Section,
    totalLength: number = 500,
    dividerThickness: number = 0
  ): number[] | EvaluationErrors {
    try {
      if (ast instanceof EvaluationErrors) {
        throw ast;
      }
      if (ast.type !== 'Sections' && ast.type !== 'Section') {
        throw new EvaluationErrors(
          `Expected Sections or Section, got ${JSON.stringify(ast)}`
        );
      }

      let sections: Sections = { type: 'Sections', sections: [] };

      // spread Repeated in sections
      if (ast.type === 'Sections') {
        for (const section of ast.sections) {
          if (
            section.nodes.type === 'Repeated' &&
            (section.nodes as Repeated).times
          ) {
            for (
              let i = 0;
              i < ((section.nodes as Repeated)?.times ?? 0);
              i++
            ) {
              if ((section.nodes as Repeated).toRepeat.type === 'Section') {
                sections.sections.push(
                  (section.nodes as Repeated).toRepeat as Section
                );
              } else if (
                (section.nodes as Repeated).toRepeat.type === 'Sections'
              ) {
                for (const subSection of (
                  (section.nodes as Repeated).toRepeat as Sections
                ).sections) {
                  sections.sections.push(subSection);
                }
              }
            }
          } else {
            sections.sections.push(section);
          }
        }
      } else if (ast.type === 'Section') {
        sections.sections.push(ast);
      }

      sections.sections.forEach((node) => {
        let spreadMm = false;
        traverseTree(node, (node: Node) => {
          if (node.type === 'NumberLiteral') {
            if ((node as NumberLiteral)?.spreadMm === true) {
              spreadMm = true;
            }
          } else if (node.type === 'BinaryExpression') {
            if (node.left.type === 'NumberLiteral') {
              if ((node.left as NumberLiteral)?.spreadMm === true) {
                spreadMm = true;
              }
              if ((node.right as NumberLiteral)?.spreadMm === true) {
                spreadMm = true;
              }
            }
          }
        });


        if (spreadMm) {
          traverseTree(node, (node: Node) => {
            if (node.type === 'NumberLiteral') {
              (node as NumberLiteral).hasMillimeterSuffix = true;
            } else if (node.type === 'BinaryExpression') {
              if (node.left.type === 'NumberLiteral') {
                (node.left as NumberLiteral).hasMillimeterSuffix = true;
              }
              if (node.right.type === 'NumberLiteral') {
                (node.right as NumberLiteral).hasMillimeterSuffix = true;
              }
            }
          });
        }
      });


      // for section in sections get mm values
      let accumulatedMmValues = 0;

      const accumulateMmValues = (node: Node) => {
        if (dividerThickness) {
          if (node.type === 'Section') {
            accumulatedMmValues += dividerThickness;
          }
        }
        if (node.type === 'NumberLiteral') {
          if ((node as NumberLiteral).hasMillimeterSuffix === true) {
            accumulatedMmValues += (node as NumberLiteral).value;
          }
        } else if (node.type === 'BinaryExpression') {
          const binaryExpression = node as BinaryExpression;
          if (
            binaryExpression.left.type === 'NumberLiteral' &&
            binaryExpression.right.type === 'NumberLiteral'
          ) {
            if (
              (binaryExpression.left as NumberLiteral).hasMillimeterSuffix ===
              true
            ) {
              accumulatedMmValues += (binaryExpression.left as NumberLiteral)
                .value;
            }
            if (
              (binaryExpression.right as NumberLiteral).hasMillimeterSuffix ===
              true
            ) {
              accumulatedMmValues += (binaryExpression.right as NumberLiteral)
                .value;
            }
          }
        }
      };

      sections.sections.forEach((section) =>
        traverseTree(section, accumulateMmValues)
      );

      if (accumulatedMmValues > totalLength) {
        throw new EvaluationErrors('Total length exceeded');
      }

      let restAfterN = totalLength - accumulatedMmValues + dividerThickness;


      let nTimes = 0;

      const processNSpecialVariables = (node: Node) => {
        if (node.type === 'BinaryExpression') {
          const binaryExpression = node as BinaryExpression;
          if (
            binaryExpression.right.type === 'NumberLiteral' &&
            binaryExpression.left.type === 'SpecialVariable' &&
            (binaryExpression.left as SpecialVariable).name === 'n' &&
            binaryExpression.operator === '*'
          ) {
            nTimes = Math.floor(
              restAfterN /
                ((binaryExpression.right as NumberLiteral).value +
                  dividerThickness)
            );
            const totalNDividersThickness = (nTimes - 1) * dividerThickness;
            const totalNLength =
              nTimes * (binaryExpression.right as NumberLiteral).value;
            restAfterN += -totalNDividersThickness - totalNLength;

          }
        }
      };

      sections.sections.forEach((section) =>
        traverseTree(section, processNSpecialVariables)
      );


      let totalRatios = 0;

      const accumulateRatioValues = (node: Node) => {
        if (node.type === 'BinaryExpression') {
          if (
            node.left.type === 'NumberLiteral' &&
            node.left.hasMillimeterSuffix === false
          ) {
            totalRatios += (node.left as NumberLiteral).value;
          }
          if (
            node.right.type === 'NumberLiteral' &&
            node.right.hasMillimeterSuffix === false
          ) {
            totalRatios += (node.right as NumberLiteral).value;
          }
        }
        if (node.type === 'NumberLiteral') {
          if (node.hasMillimeterSuffix === false) {
            totalRatios += (node as NumberLiteral).value;
          }
        }
      };

      sections.sections.forEach((node) => {
        traverseTree(node, accumulateRatioValues);
      });

      const ratioUnitValue = restAfterN / totalRatios;

      const sectionsResult: number[] = [];

      const calculateSection = (node: Node) => {
        let ratioValue: number = 0;
        let mmValue: number = 0;
        if (node.type === 'NumberLiteral') {
          if (node.hasMillimeterSuffix === false) {
            ratioValue += (node as NumberLiteral).value * ratioUnitValue;
          }
          if (node.hasMillimeterSuffix === true) {
            mmValue += (node as NumberLiteral).value;
          }
          sectionsResult.push(Number((ratioValue + mmValue).toFixed(2)));
        } else if (node.type === 'BinaryExpression') {
          if (
            node.left.type === 'NumberLiteral' &&
            node.right.type === 'NumberLiteral'
          ) {
            if (node.left.hasMillimeterSuffix === false) {
              ratioValue += (node.left as NumberLiteral).value * ratioUnitValue;
            }
            if (node.left.hasMillimeterSuffix === true) {
              mmValue += (node.left as NumberLiteral).value;
            }
            if (node.right.hasMillimeterSuffix === false) {
              ratioValue +=
                (node.right as NumberLiteral).value * ratioUnitValue;
            }
            if (node.right.hasMillimeterSuffix === true) {
              mmValue += (node.right as NumberLiteral).value;
            }
            sectionsResult.push(Number((ratioValue + mmValue).toFixed(2)));
          }
          if (
            node.left.type === 'SpecialVariable' &&
            (node.left as SpecialVariable).name === 'n' &&
            node.right.type === 'NumberLiteral'
          ) {
            mmValue += (node.right as NumberLiteral).value;
            for (let i = 0; i < nTimes; i++) {
              if (node.right.hasMillimeterSuffix === true) {
                sectionsResult.push(Number(mmValue.toFixed(2)));
              }
            }
          }
        } else {
        }
      };

      sections.sections.forEach((node) => {
        traverseTree(node, calculateSection);
      });

      return sectionsResult;
    } catch (error) {
      return new EvaluationErrors('Error calculating sections');
    }
  }
}
