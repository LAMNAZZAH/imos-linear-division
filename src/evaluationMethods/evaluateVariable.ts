import { NumberLiteral, Variable } from '../types';
import { EvaluationErrors } from '../types';

export function evaluateVariable(
  this: any,
  variable: Variable
): NumberLiteral | EvaluationErrors {
  console.log(`variable.name: ${variable.name}`);
  let variableValue = 0;
  if (variable.name === 'X') {
    variableValue = 500;
  } else if (variable.name === 'Y') {
    variableValue = 500;
  } else {
    variableValue = 99;
  }
  return {
    type: 'NumberLiteral',
    value: variableValue,
    hasMillimeterSuffix: variable.hasMillimeterSuffix,
  };
}
