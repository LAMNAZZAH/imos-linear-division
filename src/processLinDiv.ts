import { Scanner } from "./Scanner";
import { Parser } from "./Parser";
import { Evaluator } from "./Evaluator";
import { Calculator } from "./Calculator";
import { EvaluationErrors, Token } from "./types";
import { Sections } from "./types";

enum DimRef {
  I = "I",
  O = "O",
  M = "M",
}

type DimRefProps = {
  sizerefout1: DimRef;
  sizerefedg1: DimRef;
  sizerefmid: DimRef;
  sizerefedg2: DimRef;
  sizerefout2: DimRef;
};

export const processLindiv = (
  input: string,
  totalLength: number,
  dividerThickness?: number,
  variables?: { [key: string]: number },
  dimRef?: DimRefProps
): number[] | EvaluationErrors => {
  try {
    const scanner = new Scanner();
    const parser = new Parser();
    const evaluator = new Evaluator();
    const tokens: Token[] = scanner.scan(input);

    const ast = parser.parse(tokens);

    const evaluationResult = evaluator.evaluate(ast, {}, variables);

    if (evaluationResult && !(evaluationResult instanceof EvaluationErrors)) {
      const calculator = new Calculator();
      const result = calculator.calculateSections(
        evaluationResult as Sections,
        totalLength,
        dividerThickness,
        dimRef
      );

      if (result && result instanceof EvaluationErrors)
        throw new Error(result.message);

      return result;
    }
    return (
      evaluationResult ||
      new EvaluationErrors("Unknown error during evaluation.")
    );
  } catch (err) {
    return new EvaluationErrors((err as Error).message);
  }
};
