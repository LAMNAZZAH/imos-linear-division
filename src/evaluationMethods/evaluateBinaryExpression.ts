import {
  BinaryExpression,
  NumberLiteral,
  Repeated,
  SpecialVariable,
} from '../types';
import { EvaluationErrors } from '../types';
import { EvaluationContext, Node } from '../Evaluator';

const isN = (node: Node) => {
  return node.type === 'SpecialVariable' && node.name === 'n';
};

export function evaluateBinaryExpression(
  this: any,
  expression: BinaryExpression,
  context?: Partial<EvaluationContext>
): NumberLiteral | BinaryExpression | Repeated | EvaluationErrors {
  if (
    expression.right.type === 'SpecialVariable' &&
    (expression.right as SpecialVariable).name === 'n'
  ) {
    return new EvaluationErrors(
      'Cannot have n in the right side of an expression'
    );
  }

  const leftValue = !isN(expression.left as Node)
    ? (this.evaluate(expression.left as Node) as Node | EvaluationErrors)
    : expression.left;
  const rightValue = !isN(expression.right as Node)
    ? (this.evaluate(expression.right as Node) as Node | EvaluationErrors)
    : expression.right;


  if (leftValue instanceof EvaluationErrors) return leftValue;
  if (rightValue instanceof EvaluationErrors) return rightValue;

  const bothAreNumbers =
    (leftValue as Node).type === 'NumberLiteral' &&
    (rightValue as Node).type === 'NumberLiteral';
  const sameUnit = bothAreNumbers
    ? (leftValue as NumberLiteral).hasMillimeterSuffix ===
      (rightValue as NumberLiteral).hasMillimeterSuffix
    : false;

  const hasRepeated = (value: Node): boolean => {
    return value.type === 'Repeated';
  };


  switch (expression.operator) {
    case '+': {
      if (bothAreNumbers && sameUnit && context?.isInsideGroup == false) {
        return {
          type: 'NumberLiteral',
          value:
            (leftValue as NumberLiteral).value +
            (rightValue as NumberLiteral).value,
          hasMillimeterSuffix:
            (leftValue as NumberLiteral).hasMillimeterSuffix === true ||
            (rightValue as NumberLiteral).hasMillimeterSuffix === true,
          spreadMm:
            (leftValue as NumberLiteral).spreadMm ||
            (rightValue as NumberLiteral).spreadMm,
        };
      } else if (bothAreNumbers && context?.isInsideGroup == true) {
        return {
          type: 'NumberLiteral',
          value:
            (leftValue as NumberLiteral).value +
            (rightValue as NumberLiteral).value,
          spreadMm:
            (leftValue as NumberLiteral).hasMillimeterSuffix ||
            (rightValue as NumberLiteral).hasMillimeterSuffix,
        };
      } else {
        return {
          type: 'BinaryExpression',
          operator: '+',
          left: leftValue as Node,
          right: rightValue as Node,
        };
      }
    }

    case '*':
      if (bothAreNumbers && context?.isInsideGroup == true) {
        return {
          type: 'NumberLiteral',
          value:
            (leftValue as NumberLiteral).value *
            (rightValue as NumberLiteral).value,
          hasMillimeterSuffix:
            leftValue.hasMillimeterSuffix === true ||
            rightValue.hasMillimeterSuffix === true,
          spreadMm:
            (leftValue as NumberLiteral).spreadMm ||
            (rightValue as NumberLiteral).spreadMm,
        };
      } else if (
        hasRepeated(rightValue as Node) &&
        leftValue.type === 'NumberLiteral'
      ) {
        return {
          type: 'Repeated',
          toRepeat: (rightValue as Repeated).toRepeat,
          times: Math.round((leftValue as NumberLiteral).value),
          hasMillimeterSuffix:
            (rightValue.type === 'NumberLiteral' &&
              rightValue.hasMillimeterSuffix) ||
            false,
        };
      } else if (
        context?.isInsideGroup == false &&
        leftValue.type !== 'SpecialVariable' &&
        (leftValue as SpecialVariable).name !== 'n'
      ) {
        return new EvaluationErrors(`cannot have * outside of group`);
      } else if (leftValue.type === 'SpecialVariable') {
        return {
          type: 'BinaryExpression',
          operator: '*',
          left: leftValue as SpecialVariable,
          right: {
            type: 'NumberLiteral',
            value: (rightValue as NumberLiteral).value,
            hasMillimeterSuffix: true,
          } as NumberLiteral,
        };
      } else {
        return {
          type: 'BinaryExpression',
          operator: '*',
          left: leftValue as Node,
          right: rightValue as Node,
          hasMillimeterSuffix:
            leftValue.hasMillimeterSuffix || rightValue.hasMillimeterSuffix,
        };
      }
    case '/':
      if (bothAreNumbers && context?.isInsideGroup == true) {
        return {
          type: 'NumberLiteral',
          value:
            (leftValue as NumberLiteral).value /
            (rightValue as NumberLiteral).value,
          hasMillimeterSuffix:
            leftValue.hasMillimeterSuffix === true ||
            rightValue.hasMillimeterSuffix === true,
        };
      } else if (context?.isInsideGroup == false) {
        return new EvaluationErrors(`cannot have  / outside of group`);
      }
    case '-': {
      if (bothAreNumbers && sameUnit && context?.isInsideGroup == false) {
        return {
          type: 'NumberLiteral',
          value:
            (leftValue as NumberLiteral).value -
            (rightValue as NumberLiteral).value,
          hasMillimeterSuffix:
            (leftValue as NumberLiteral).hasMillimeterSuffix === true ||
            (rightValue as NumberLiteral).hasMillimeterSuffix === true,
          spreadMm:
            (leftValue as NumberLiteral).spreadMm ||
            (rightValue as NumberLiteral).spreadMm,
        };
      } else if (bothAreNumbers && context?.isInsideGroup == true) {
        return {
          type: 'NumberLiteral',
          value:
            (leftValue as NumberLiteral).value -
            (rightValue as NumberLiteral).value,
          spreadMm:
            (leftValue as NumberLiteral).hasMillimeterSuffix ||
            (rightValue as NumberLiteral).hasMillimeterSuffix,
        };
      } else {
        return {
          type: 'BinaryExpression',
          operator: '-',
          left: leftValue as Node,
          right: rightValue as Node,
        };
      }
    }
    default:
      throw new EvaluationErrors('Invalid Operator');
  }
}
