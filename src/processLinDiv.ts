import { Scanner } from "./Scanner";
import { Parser } from "./Parser";
import { Evaluator } from "./Evaluator";
import { Calculator } from "./Calculator";
import { EvaluationErrors, Token } from "./types";
import { Sections } from "./types";

export const processLindiv = (input: string, totalLength: number, dividerThickness?: number): number[] | EvaluationErrors => {
    try {
        const scanner = new Scanner(input);
        const tokens: Token[] = scanner.scan();

        const parser = new Parser(tokens);
        const ast = parser.parse();

        const evaluator = new Evaluator();
        const evaluationResult = evaluator.evaluate(ast);  

        if (evaluationResult && !(evaluationResult instanceof EvaluationErrors)) {
            const calculator = new Calculator();
            const result =  calculator.calculateSections(evaluationResult as Sections, totalLength, dividerThickness);

            if (result && result instanceof EvaluationErrors) throw new Error(result.message);

            return result;
        }
        return evaluationResult || new EvaluationErrors('Unknown error during evaluation.');
    } catch (err) {
        return new EvaluationErrors((err as Error).message);
    }
}