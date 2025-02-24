import { Sections, Section, NumberLiteral, BinaryExpression } from "./types";
import { traverseTree } from "./traverseTree";

export class SectionSpreadMm {
    public spreadMm(sections: Sections) {
        sections.sections.forEach((node) => {
            let spreadMm = false;
            traverseTree(node, (node: NumberLiteral | BinaryExpression) => {
              if (node.type === "NumberLiteral") {
                if ((node as NumberLiteral)?.spreadMm === true) {
                  spreadMm = true;
                }
              } else if (node.type === "BinaryExpression") {
                if (node.left.type === "NumberLiteral") {
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
              traverseTree(node, (node: NumberLiteral | BinaryExpression) => {
                if (node.type === "NumberLiteral") {
                  (node as NumberLiteral).hasMillimeterSuffix = true;
                } else if (node.type === "BinaryExpression") {
                  if (node.left.type === "NumberLiteral") {
                    (node.left as NumberLiteral).hasMillimeterSuffix = true;
                  }
                  if (node.right.type === "NumberLiteral") {
                    (node.right as NumberLiteral).hasMillimeterSuffix = true;
                  }
                }
              });
            }
          });
    }
}