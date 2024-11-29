import { FunctionCall, NumberLiteral } from '../types';
import { EvaluationErrors } from '../types';
import { EvaluationContext } from '../Evaluator';

// TODO: HANDLE FUNCTIONS WITH TWO ARGUMENTS / OTHER FUNCTIONS IF NEEDED EX: ROUND(x, y)

export function evaluateFunction(
  this: any,
  fn: FunctionCall,
  context?: Partial<EvaluationContext>
): NumberLiteral | EvaluationErrors {
  const evaluatedArg = this.evaluate(fn.arg) as
    | NumberLiteral
    | EvaluationErrors;

  if (evaluatedArg instanceof EvaluationErrors) {
    throw new EvaluationErrors('Error in function arguments');
  }

  switch (fn.name.toLowerCase()) {
    case 'abs':
      return {
        type: 'NumberLiteral',
        value: Math.abs(evaluatedArg.value as number),
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'acos':
      return {
        type: 'NumberLiteral',
        value: Math.acos(evaluatedArg.value as number),
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'asin':
      return {
        type: 'NumberLiteral',
        value: Math.asin(evaluatedArg.value as number),
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'atan':
      return {
        type: 'NumberLiteral',
        value: Math.atan(evaluatedArg.value as number),
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'cos':
      return {
        type: 'NumberLiteral',
        value: Math.cos(evaluatedArg.value as number),
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'sin':
      return {
        type: 'NumberLiteral',
        value: Math.sin(evaluatedArg.value as number),
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'tan':
      return {
        type: 'NumberLiteral',
        value: Math.tan(evaluatedArg.value as number),
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'round':
      console.log('tma: ', evaluatedArg.value);
      console.log('ne3ma: ', context?.isInsideGroup);
      return {
        type: 'NumberLiteral',
        value: Math.round(evaluatedArg.value as number),
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'bog2deg':
      return {
        type: 'NumberLiteral',
        value: (evaluatedArg.value as number) * (180 / Math.PI),
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'deg2bog':
      return {
        type: 'NumberLiteral',
        value: (evaluatedArg.value as number) * (Math.PI / 180),
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'in2mm':
      return {
        type: 'NumberLiteral',
        value: (evaluatedArg.value as number) * 25.4,
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'mm2in':
      return {
        type: 'NumberLiteral',
        value: (evaluatedArg.value as number) / 25.4,
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'ln':
      return {
        type: 'NumberLiteral',
        value: Math.log(evaluatedArg.value as number),
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    case 'log10':
      return {
        type: 'NumberLiteral',
        value: Math.log10(evaluatedArg.value as number),
        hasMillimeterSuffix: evaluatedArg.hasMillimeterSuffix,
        spreadMm: context?.isInsideGroup === false,
      };
    default:
      throw new EvaluationErrors('Function not implemented');
  }
}
