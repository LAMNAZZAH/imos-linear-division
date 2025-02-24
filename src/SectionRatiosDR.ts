import { BinaryExpression, NumberLiteral, Sections } from "./types";
import { traverseTree } from "./traverseTree";

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

export class SectionRatiosDR {
    public adjustRatiosDR(
        node: NumberLiteral | BinaryExpression,
        index: number,
        totalRatios: number,
        dimRefProps: DimRefProps | undefined,
        dividerThickness: number,
        sections: Sections,
    ) : Sections | undefined {
        if (node.hasMillimeterSuffix === true) return;
        if (totalRatios === 0) return;
        // value to distribute on other ratios
        let dr_var = 0;

        let adjustedNodeTotalRatioValue = 0;
        let toTake = 0;

        // assign value of divider to distribute on other ratios
        if (dimRefProps?.sizerefedg1 === DimRef.M && index === 0) {
          dr_var = dividerThickness / 2;
        } else if (dimRefProps?.sizerefedg1 === DimRef.O && index === 0) {
          dr_var = dividerThickness;
        } else if (
          dimRefProps?.sizerefmid === DimRef.M &&
          index > 0 &&
          index < sections.sections.length - 1
        ) {
          dr_var = dividerThickness;
        } else if (
          dimRefProps?.sizerefmid === DimRef.O &&
          index > 0 &&
          index < sections.sections.length - 1
        ) {
          dr_var = dividerThickness * 2;
        } else if (
          dimRefProps?.sizerefedg2 === DimRef.M &&
          index === sections.sections.length - 1
        ) {
          dr_var = dividerThickness / 2;
        } else if (
          dimRefProps?.sizerefedg2 === DimRef.O &&
          index === sections.sections.length - 1
        ) {
          dr_var = dividerThickness;
        } else {
          logger.log("[index]: ", index);
          return;
        }

        logger.log("\n\n[---index---]: " + index);
        logger.log("[dr_var]: " + dr_var);

        if (node.type === "BinaryExpression") {
          if (
            node.left.type === "NumberLiteral" &&
            node.right.type === "NumberLiteral" &&
            (node.left as NumberLiteral).hasMillimeterSuffix === false &&
            (node.right as NumberLiteral).hasMillimeterSuffix === false
          ) {
            return;
          } else {
            adjustedNodeTotalRatioValue =
              (node.left as NumberLiteral).value +
              (node.right as NumberLiteral).value;
            // value to take from the total value to adjust the Dimension Reference
            toTake =
              (dr_var / totalRatios) *
              (totalRatios - adjustedNodeTotalRatioValue);
            logger.log("[toTake]: " + toTake);

            // TODO: transform this into a numberLitteral to assign final value after DR substraction
            (node.left as NumberLiteral).drAdjustmentValue =
              ((node as BinaryExpression).drAdjustmentValue ?? 0) - toTake;
            //(node.right as NumberLiteral).value = 0;
            logger.log(
              "[drAdjustmentValue - toTake]: " +
                (node.left as NumberLiteral).drAdjustmentValue
            );
          }
        } else if (
          node.type === "NumberLiteral" &&
          (node as NumberLiteral).hasMillimeterSuffix === false
        ) {
          adjustedNodeTotalRatioValue = (node as NumberLiteral).value;
          toTake =
            (dr_var / totalRatios) *
            (totalRatios - adjustedNodeTotalRatioValue);
          logger.log("[toTake]: " + toTake);
          (node as NumberLiteral).drAdjustmentValue =
            ((node as NumberLiteral).drAdjustmentValue ?? 0) - toTake;
          logger.log(
            "[drAdjustmentValue - toTake]: " +
              (node as NumberLiteral).drAdjustmentValue
          );
        }

        if (toTake === 0) return;
        if (adjustedNodeTotalRatioValue === 0) return;

        sections.sections.forEach((node, idx) => {
          traverseTree(node, (node: BinaryExpression | NumberLiteral) => {
            if (index === idx) return;
            // add the Dimention Reference adjustment to Binary expression values
            // to simplify add all the value to the left node only
            if (node.type === "BinaryExpression") {
              if (
                node.left.type === "NumberLiteral" &&
                node.right.type === "NumberLiteral"
              ) {
                if (
                  (node.left as NumberLiteral).hasMillimeterSuffix === false &&
                  (node.right as NumberLiteral).hasMillimeterSuffix === false
                ) {
                  let iteratedNodeTotalRatioValue =
                    (node.left as NumberLiteral).value +
                    (node.right as NumberLiteral).value;
                  logger.log(
                    "[iteratedNodeTotalRatioValue [idx: " +
                      idx +
                      "]]: " +
                      iteratedNodeTotalRatioValue
                  );
                  (node.left as NumberLiteral).drAdjustmentValue =
                    ((node as BinaryExpression).drAdjustmentValue ?? 0) +
                    (toTake / (totalRatios - adjustedNodeTotalRatioValue)) *
                      iteratedNodeTotalRatioValue;
                  logger.log(
                    "[added drAdjustmentValue]: " +
                      (toTake / (totalRatios - adjustedNodeTotalRatioValue)) *
                        iteratedNodeTotalRatioValue
                  );
                }
              }
            } else if (
              node.type === "NumberLiteral" &&
              (node as NumberLiteral).hasMillimeterSuffix === false
            ) {
              logger.log(
                "[iteratedNodeTotalRatioValue [idx: " +
                  idx +
                  "]]: " +
                  (node as NumberLiteral).value
              );
              (node as NumberLiteral).drAdjustmentValue =
                ((node as NumberLiteral).drAdjustmentValue ?? 0) +
                (toTake / (totalRatios - adjustedNodeTotalRatioValue)) *
                  (node as NumberLiteral).value;
              logger.log(
                "[added drAdjustmentValue]: " +
                  (toTake / (totalRatios - adjustedNodeTotalRatioValue)) *
                    (node as NumberLiteral).value
              );
            }
          });
        });

        return sections;
    }
}