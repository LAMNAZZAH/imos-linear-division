import { BinaryExpression, NumberLiteral } from "./types";
import { logger } from "./utils/logger";

export class SectionCalculation {
    public sectionsResult : number[] = [];
    public calculateSection(
        node: NumberLiteral | BinaryExpression,
        index: number,
        accumulatedDRFromMmValues: number,
        totalRatios: number,
        ratioUnitValue: number,
    ) : number[] {
        const accumulatedDRFromMmUnit = accumulatedDRFromMmValues / totalRatios;
        let ratioValue: number = 0;  
        let mmValue: number = 0;
        if (node.type === "NumberLiteral") {
          if (node.hasMillimeterSuffix === false) {
            logger.log("[");
            logger.log(
              "ratioValue = val*unit + adj: " +
                (node as NumberLiteral).value +
                " * " +
                ratioUnitValue +
                " + " +
                ((node as NumberLiteral)?.drAdjustmentValue ?? 0)
            );
            ratioValue +=
              (node as NumberLiteral).value * ratioUnitValue +
              ((node as NumberLiteral)?.drAdjustmentValue ?? 0);
            logger.log(
              "ratioValue +  val*acc: " +
                ratioValue +
                " + " +
                (node as NumberLiteral).value +
                " * " +
                accumulatedDRFromMmUnit
            );
            ratioValue +=
              (node as NumberLiteral).value * accumulatedDRFromMmUnit;
            logger.log("\n[ratioValue]: " + ratioValue);
            logger.log("]\n");
          }
          if (node.hasMillimeterSuffix === true) {
            logger.log("[");
            mmValue += (node as NumberLiteral).value;
            logger.log("[mmValue]: " + mmValue);
            logger.log("]\n");
          }
          this.sectionsResult.push(Number((ratioValue + mmValue).toFixed(2)));
        } else if (node.type === "BinaryExpression") {
          if (
            node.left.type === "NumberLiteral" &&
            node.right.type === "NumberLiteral"
          ) {
            logger.log("[");
            if (node.left.hasMillimeterSuffix === false) {
              logger.log(
                "leftRatioUnitValue = val*unit + adj: " +
                  (node.left as NumberLiteral).value +
                  " * " +
                  ratioUnitValue +
                  " + " +
                  ((node.left as NumberLiteral)?.drAdjustmentValue ?? 0)
              );
              ratioValue +=
                (node.left as NumberLiteral).value * ratioUnitValue +
                ((node.left as NumberLiteral)?.drAdjustmentValue ?? 0);
              logger.log(
                "leftRatioValue + unit*acc: " +
                  ratioValue +
                  " + " +
                  (node.left as NumberLiteral).value +
                  " * " +
                  accumulatedDRFromMmUnit
              );
              ratioValue +=
                (node.left as NumberLiteral).value * accumulatedDRFromMmUnit;
              logger.log("[leftRatioValue]: " + ratioValue);
            }
            if (node.left.hasMillimeterSuffix === true) {
              logger.log("[LeftMmValue]: " + mmValue);
              mmValue += (node.left as NumberLiteral).value;
            }
            if (node.right.hasMillimeterSuffix === false) {
              logger.log(
                "rightRatioUnitValue  = val*unit + adj: " +
                  (node.right as NumberLiteral).value +
                  " * " +
                  ratioUnitValue +
                  " + " +
                  ((node.right as NumberLiteral)?.drAdjustmentValue ?? 0)
              );
              ratioValue +=
                (node.right as NumberLiteral).value * ratioUnitValue +
                ((node.right as NumberLiteral)?.drAdjustmentValue ?? 0);
              logger.log(
                "rightRatioValue + val*acc: " +
                  ratioValue +
                  " + " +
                  (node.right as NumberLiteral).value +
                  " * " +
                  accumulatedDRFromMmUnit
              );
              ratioValue +=
                (node.right as NumberLiteral).value * accumulatedDRFromMmUnit;
            }
            if (node.right.hasMillimeterSuffix === true) {
              logger.log("[rightMmValue]: " + mmValue);
              mmValue += (node.right as NumberLiteral).value;
            }
            logger.log("]\n");
            this.sectionsResult.push(Number((ratioValue + mmValue).toFixed(2)));
          }
        } else {
        }

        return this.sectionsResult;
    }
}