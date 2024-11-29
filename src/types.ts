export interface ASTNode {
    type: string;
    hasMillimeterSuffix?: boolean;
  }
  
  export interface NumberLiteral extends ASTNode {
    type: 'NumberLiteral';
    value: number;
    spreadMm?: boolean;
  }
  
  export interface Variable extends ASTNode {
    type: 'Variable';
    name: string;
  }
  
  export interface SpecialVariable extends ASTNode {
    type: 'SpecialVariable';
    name: string;
  }
  
  export interface BinaryExpression extends ASTNode {
    type: 'BinaryExpression';
    left: ASTNode;
    operator: string;
    right: ASTNode;
    inGroup?: boolean;
  }
  
  export interface UnaryExpression extends ASTNode {
    type: 'UnaryExpression';
    operator: string;
    right: ASTNode;
  }
  
  export interface FunctionCall extends ASTNode {
    type: 'FunctionCall';
    name: string;
    arg: ASTNode;
  }
  
  export interface Grouping extends ASTNode {
    type: 'Grouping';
    expression: ASTNode;
  }
  
  export interface Reduction extends ASTNode {
    type: 'Reduction';
    expression: ASTNode;
  }
  
  export interface Section extends ASTNode {
    type: 'Section';
    nodes: ASTNode;
  }
  
  export interface Repeated extends ASTNode {
    type: 'Repeated';
    toRepeat: ASTNode;
    times?: number;
    inGroup?: boolean;
  }
  
  export interface Sections extends ASTNode {
    type: 'Sections';
    sections: Section[];
  }
  
  export interface LinearDivision extends ASTNode {
    type: 'LinearDivision';
    body: Sections;
  }

  export class EvaluationErrors extends Error {
    constructor(message: string) {
      super(`Evaluation Error: ${message}`);
      this.name = 'EvaluationError';
    }
  }

  
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
  


  export interface INodeEvaluator {
    evaluate(node: Node): Node | EvaluationErrors;
  }


  export enum TokenType {
  NUMBER = 'NUMBER', // A numeric constant (e.g., 1890, 0.001)
  VARIABLE = 'VARIABLE', // A variable prefixed with $ (e.g., $P_MID_WIDTH)
  UNIT = 'UNIT', // A unit of measurement (e.g., mm)
  OPERATOR = 'OPERATOR', // Arithmetic operators (+, -, *, /)
  COLON = 'COLON', // Colon separator (:)
  BRACKET_OPEN = 'BRACKET_OPEN', // Opening bracket ([)
  BRACKET_CLOSE = 'BRACKET_CLOSE', // Closing bracket (])
  BRACE_OPEN = 'BRACE_OPEN', // Opening curly brace ({)
  BRACE_CLOSE = 'BRACE_CLOSE', // Closing curly brace (})
  PAREN_OPEN = 'PAREN_OPEN', // Opening parenthesis (()
  PAREN_CLOSE = 'PAREN_CLOSE', // Closing parenthesis ())
  FUNCTION = 'FUNCTION', // A function name (e.g., round, tan, deg2bog)
  SPECIAL_VARIABLE = 'SPECIAL_VARIABLE', // Special variables (X, Y)
  RELATIVE_RATIO = 'RELATIVE_RATIO', // Numbers like 1, 2 without mm, representing ratios
  ANGLE_BRACKET_OPEN = 'LEFT_ANGLE_BRACKET', // Left angle bracket (<)
  ANGLE_BRACKET_CLOSE = 'RIGHT_ANGLE_BRACKET', // Right angle bracket (>)
  EOF = 'EOF', // End of input
}


export interface Token {
    type: TokenType;
    lexeme: string; 
    position?: number; 
}
  