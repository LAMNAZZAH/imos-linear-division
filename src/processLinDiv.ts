import { Scanner } from "./Scanner";
import { Parser } from "./Parser";
import { Evaluator } from "./Evaluator";
import { Calculator } from "./Calculator";
import { EvaluationErrors, Token } from "./types";
import { Sections } from "./types";

const scanner = new Scanner();
const parser = new Parser();
const evaluator = new Evaluator();


export const processLindiv = (input: string, totalLength: number, dividerThickness?: number, variables?: {[key: string]: number}): number[] | EvaluationErrors => {
    try {


        const tokens: Token[] = scanner.scan(input);

        const ast = parser.parse(tokens);
        
        const evaluationResult = evaluator.evaluate(ast, {}, variables);

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