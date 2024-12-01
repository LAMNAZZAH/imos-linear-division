import { NumberLiteral, Variable } from '../types';
import { EvaluationErrors } from '../types';

export function evaluateVariable(
  this: any,
  variable: Variable,
): NumberLiteral | EvaluationErrors {

  
  if (!this.variables || !(variable.name in this.variables)) {
    throw new EvaluationErrors(`Variable ${variable.name} is not defined.`);
  }


  let variableValue = this.variables[variable.name];

  return {
    type: 'NumberLiteral',
    value: variableValue,
    hasMillimeterSuffix: variable.hasMillimeterSuffix,
  };
}
