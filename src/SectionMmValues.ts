import { NumberLiteral, BinaryExpression, Section, Sections } from "./types";
import { handleNumberLiteralWithDimRef } from "./utils/handleNumberLiteralWithDimRef";

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

export class SectionMmValues {
    public accumulateMmValues(
        node: NumberLiteral | BinaryExpression | Section, 
        index: number, 
        dividerThickness: number,
        accumulatedMmValues: number,
        dimRefProps: DimRefProps | undefined,
        sections: Sections
    ) : { accumulatedMmValues: number, sections: Sections } {
        if (dividerThickness) {
            if (node.type === "Section" && index > 0) { 
              logger.log("[accumulatedMmValues += divider]: " + accumulatedMmValues + " + " + dividerThickness);
              accumulatedMmValues += dividerThickness;
            }
          }
          if (node.type === "NumberLiteral") {
            if ((node as NumberLiteral).hasMillimeterSuffix === true) {
              // dim ref check
              (node as NumberLiteral).value = handleNumberLiteralWithDimRef(
                (node as NumberLiteral).value,
                index,
                dividerThickness,
                dimRefProps,
                sections
              );
              logger.log("MmNumberWithDimRef: ", (node as NumberLiteral).value);
              logger.log("[accumulatedMmValues += MmNumber]: " + accumulatedMmValues + " + " +   (node as NumberLiteral).value);
              accumulatedMmValues += (node as NumberLiteral).value;
              
              return { accumulatedMmValues: accumulatedMmValues, sections: sections };
            }
          } else if (node.type === "BinaryExpression") {
            const binaryExpression = node as BinaryExpression;
            if (
              binaryExpression.left.type === "NumberLiteral" &&
              binaryExpression.right.type === "NumberLiteral"
            ) {
              if (
                (binaryExpression.left as NumberLiteral).hasMillimeterSuffix ===
                true
              ) {
                  (binaryExpression.left as NumberLiteral).value = handleNumberLiteralWithDimRef(
                  (binaryExpression.left as NumberLiteral).value,
                  index,
                  dividerThickness,
                  dimRefProps,
                  sections
                );
                logger.log("MmBinLeftWithDimRef: ", (binaryExpression.left as NumberLiteral).value);
                accumulatedMmValues += (binaryExpression.left as NumberLiteral).value
                logger.log("[accumulatedMmValues += MmBinLeft]: " + accumulatedMmValues + " + " +   (binaryExpression.left as NumberLiteral).value);
                
                return { accumulatedMmValues: accumulatedMmValues, sections: sections };
              }
              if (
                (binaryExpression.right as NumberLiteral).hasMillimeterSuffix ===
                true
              ) {
                (binaryExpression.right as NumberLiteral).value = handleNumberLiteralWithDimRef(
                  (binaryExpression.right as NumberLiteral).value,
                  index,
                  dividerThickness,
                  dimRefProps,
                  sections
                );
                logger.log("MmBinLeftWithDimRef: ", (binaryExpression.right as NumberLiteral).value);
                accumulatedMmValues += (binaryExpression.right as NumberLiteral).value;
                logger.log("[accumulatedMmValues += MmBinRight]: " + accumulatedMmValues + " + " +  (binaryExpression.right as NumberLiteral).value);

                return { accumulatedMmValues: accumulatedMmValues, sections: sections  };
              }
            }
          }

          return { accumulatedMmValues: accumulatedMmValues, sections: sections  };
    }
}