import { BinaryExpression, NumberLiteral } from "./types";

import { logger } from "./utils/logger";

export class SectionRatioValues {
    public totalRatios = 0;
    public accumulateRatioValues(node: BinaryExpression | NumberLiteral) {
        if (node.type === "BinaryExpression") {
            if (
              node.left.type === "NumberLiteral" &&
              node.left.hasMillimeterSuffix === false
            ) {
              logger.log("[totalRatios + addedRatio]: " + this.totalRatios + " + " + (node.left as NumberLiteral).value);
              this.totalRatios += (node.left as NumberLiteral).value;
            }
            if (
              node.right.type === "NumberLiteral" &&
              node.right.hasMillimeterSuffix === false
            ) {
              logger.log("[totalRatios + addedRatio]: " + this.totalRatios + " + " + (node.right as NumberLiteral).value);
              this.totalRatios += (node.right as NumberLiteral).value;
            }
          }
          if (node.type === "NumberLiteral") {
            if (node.hasMillimeterSuffix === false) {
              logger.log("[totalRatios + addedRatio]: " + this.totalRatios + " + " + (node as NumberLiteral).value);
              this.totalRatios += (node as NumberLiteral).value;
            }
          }

          return this.totalRatios;
    }
}