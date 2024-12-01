import {
    NumberLiteral,
    BinaryExpression,
    FunctionCall,
    Grouping,
    Repeated,
    Sections,
    Section,
    Variable,
    UnaryExpression,
    Reduction,
    SpecialVariable,
    LinearDivision,
  } from './types';
  import { EvaluationErrors } from './types';
  import { INodeEvaluator } from './types';
  import { evaluateBinaryExpression } from './evaluationMethods/evaluateBinaryExpression';
  import { evaluateFunction } from './evaluationMethods/evaluateFunction';
  import { evaluateVariable } from './evaluationMethods/evaluateVariable';
  
  export type Node =
    | NumberLiteral
    | Variable
    | UnaryExpression
    | FunctionCall
    | Grouping
    | BinaryExpression
    | Section
    | Sections
    | Repeated
    | Reduction
    | SpecialVariable
    | LinearDivision;
  
  export interface EvaluationContext {
    isInsideGroup?: boolean;
    parentNode?: Node;
  }
  
  export class Evaluator implements INodeEvaluator {
    private nestingLevel: number = 0;
    private variables: {[key: string]: number} = {};
  
    constructor() {
      this.evaluateBinaryExpression = evaluateBinaryExpression.bind(this);
      this.evaluateFunction = evaluateFunction.bind(this);
      this.evaluateVariable = evaluateVariable.bind(this);
    }
  
    public evaluate(
      node: Node,
      context: Partial<EvaluationContext> = { isInsideGroup: false },
      variables?: { [key: string]: number }
    ): Node | EvaluationErrors {
      this.nestingLevel++;
      try {


        // set variables
        if (variables) {
          this.variables = variables;
        } 


        // sections
        if (this.isSections(node)) {
          return this.evaluateSections(node, context);
        }
  
        // section
        if (this.isSection(node)) {
          const evaluatedValue = this.evaluate(node.nodes as Section, context);
          if (evaluatedValue instanceof EvaluationErrors) {
            console.log(`Error in section ${JSON.stringify(node)}`);
            return new EvaluationErrors(
              `Error in section ${JSON.stringify(node)}`
            );
          }
          return { ...node, nodes: evaluatedValue };
        }
  
        // number
        if (this.isNumberLiteral(node)) {
          if (context.isInsideGroup) {
            if (node.hasMillimeterSuffix) {
              return { ...node, spreadMm: true };
            }
          } else {
            return node;
          }
        }
  
        // grouping
        if (this.isGrouping(node)) {
          context = { ...context, isInsideGroup: true };
          const evaluatedValue = this.evaluate(node.expression as Node, context);
          if (evaluatedValue instanceof EvaluationErrors) {
            return evaluatedValue;
          }
          return {
            ...evaluatedValue,
            hasMillimeterSuffix: node.hasMillimeterSuffix,
          };
        }
  
        // repeated
        if (this.isRepeated(node)) {
          const evaluatedValue = this.evaluate(node.toRepeat as Node);
          if (evaluatedValue instanceof EvaluationErrors) {
            return evaluatedValue;
          }
          return { ...node, toRepeat: evaluatedValue };
        }
  
        // binaryExpression
        if (this.isBinaryExpression(node)) {
          return this.evaluateBinaryExpression(node, context);
        }
  
        // unaryExpression
        if (this.isUnaryExpression(node)) {
          return {
            type: 'NumberLiteral',
            value:
              node.operator === '-'
                ? -1 * (node.right as NumberLiteral).value
                : (node.right as NumberLiteral).value,
            hasMillimeterSuffix: node.right.hasMillimeterSuffix,
          };
        }
  
        // functionCall
        if (this.isFunctionCall(node)) {
          return this.evaluateFunction(node, context);
        }
  
        // variable
        if (this.isVariable(node)) {
          if (!this.variables) {
            throw new EvaluationErrors('No variables defined.');
          } else {
            return this.evaluateVariable(node);
          }
        }
  
        throw new EvaluationErrors(`unsupported node type: ${node.type}`);
      } catch (err) {
        throw new EvaluationErrors((err as Error).message);
      } finally {
        this.nestingLevel--;
      }
    }
  
    private isUnaryExpression(node: Node): node is UnaryExpression {
      return node.type === 'UnaryExpression';
    }
  
    private isNumberLiteral(node: Node): node is NumberLiteral {
      return node.type === 'NumberLiteral';
    }
  
    private isVariable(node: Node): node is Variable {
      return node.type === 'Variable' || node.type === 'SpecialVariable';
    }
  
    private isBinaryExpression(node: Node): node is BinaryExpression {
      return node.type === 'BinaryExpression';
    }
  
    private isFunctionCall(node: Node): node is FunctionCall {
      return node.type === 'FunctionCall';
    }
  
    private isGrouping(node: Node): node is Grouping {
      return node.type === 'Grouping';
    }
  
    private isRepeated(node: Node): node is Repeated {
      return node.type === 'Repeated';
    }
  
    private isSections(node: Node): node is Sections {
      return node.type === 'Sections';
    }
  
    private isSection(node: Node): node is Section {
      return node.type === 'Section';
    }
  
    private evaluateSections(
      sections: Sections,
      context: Partial<EvaluationContext> = { isInsideGroup: false }
    ): Section | Sections | EvaluationErrors {
      let result = sections.sections.map((section) => {
        const result = this.evaluate(section.nodes as Node);
        if (result instanceof EvaluationErrors) throw result;
        return { type: 'Section', nodes: result } as Section;
      });
      return { type: 'Sections', sections: result };
    }
  
    // evaluate binary expression
    evaluateBinaryExpression: (
      this: any,
      expression: BinaryExpression,
      context?: Partial<EvaluationContext>
    ) => NumberLiteral | BinaryExpression | Repeated | EvaluationErrors;
  
    evaluateFunction: (
      this: any,
      fn: FunctionCall,
      context?: Partial<EvaluationContext>
    ) => NumberLiteral | EvaluationErrors;
  
    evaluateVariable: (
      this: any,
      variable: Variable,
      variables?: { [key: string]: number }
    ) => NumberLiteral | EvaluationErrors;
  }
  