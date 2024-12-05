import { Token } from './types';
import { TokenType } from './types';
import {
  NumberLiteral,
  Variable,
  SpecialVariable,
  UnaryExpression,
  FunctionCall,
  Grouping,
  BinaryExpression,
  Section,
  Sections,
  Repeated,
  Reduction,
  LinearDivision,
} from './types';

type Node =
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

//TODO: add handling of [] brackets tokens (CURRENTLY DOESN'T EXIST IN DB)

export class Parser {
  private cache = new Map<Token[], Node>();
  private tokens: Token[] = [];
  private current: number = 0;

  parse(tokens: Token[]): Node {
    if (this.cache.has(tokens)) {
      const ast = this.cache.get(tokens)!;
      this.cache.delete(tokens);
      this.cache.set(tokens, ast);

      return ast;
    }

    try {
      this.tokens = tokens;
      const ast = this.performParse(tokens);
      this.cache.set(tokens, ast);

      if (this.cache.size > 3) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey!);
      }


      return ast;

    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  public performParse(tokens: Token[]): Node {
    this.resetCurrent();
    if (this.tokens.length === 0) {
      throw new Error('No tokens to parse.');
    }
    try {
      return this.expression();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  private resetCurrent = () => {
    this.current = 0;
  };

  private checkMillimeterSuffix(): boolean {
    if (this.isAtEnd()) return false;
    const nextToken = this.peek();
    return nextToken.type === TokenType.UNIT && nextToken.lexeme === 'mm';
  }

  private consumeMillimeterSuffix(): boolean {
    if (this.checkMillimeterSuffix()) {
      this.advance();
      return true;
    }
    return false;
  }

  private sections(): Sections | Section | Node {
    const sections: Section[] = [];

    if (!this.check(TokenType.ANGLE_BRACKET_OPEN)) {
      return this.expression();
    }

    while (this.check(TokenType.ANGLE_BRACKET_OPEN)) {
      this.advance(); // Consume '<'
      let expr = this.expression();
      this.consume(
        TokenType.ANGLE_BRACKET_CLOSE,
        "Expected '>' after section expression."
      );

      sections.push({
        type: 'Section',
        nodes: expr,
        hasMillimeterSuffix: this.consumeMillimeterSuffix(),
      });
    }

    if (sections.length === 1) {
      const singleSection = sections[0];
      if (
        singleSection.type === 'Section' &&
        singleSection.nodes.type === 'Section'
      ) {
        return singleSection.nodes as Section;
      }
      return singleSection;
    }

    return {
      type: 'Sections',
      sections: sections,
    };
  }

  private expression(): Node {
    try {
      let expr = this.term();

      while (
        !this.isAtEnd() &&
        this.check(TokenType.OPERATOR) &&
        ['+', '-'].includes(this.peek().lexeme)
      ) {
        this.advance();
        const operator = this.previous().lexeme;
        const right = this.term();
        expr = {
          type: 'BinaryExpression',
          left: expr,
          operator,
          right,
        };
      }

      return expr;
    } catch (error) {
      throw new Error(
        `Failed to parse expression: ${(error as Error).message}`
      );
    }
  }

  private term(): Node {
    try {
      let expr = this.factor();

      while (
        !this.isAtEnd() &&
        this.check(TokenType.OPERATOR) &&
        ['*', '/', '~'].includes(this.peek().lexeme)
      ) {
        this.advance();
        const operator = this.previous().lexeme;
        const right = this.factor();

        if (right.type === 'SpecialVariable' && right.name === 'n') {
          throw new Error(
            'Invalid usage: "n" cannot appear on the right-hand side of an operator'
          );
        }

        expr = {
          type: 'BinaryExpression',
          left: expr,
          operator,
          right,
        };
      }

      return expr;
    } catch (error) {
      throw new Error(`Failed to parse term: ${(error as Error).message}`);
    }
  }

  private factor(): Node {
    try {
      if (
        this.check(TokenType.OPERATOR) &&
        ['-', '+'].includes(this.peek().lexeme)
      ) {
        this.advance(); // Consume the operator
        const operator = this.previous().lexeme;
        const right = this.factor();
        return {
          type: 'UnaryExpression',
          operator,
          right,
        };
      }

      return this.primary();
    } catch (error) {
      throw new Error(`Failed to parse factor: ${(error as Error).message}`);
    }
  }

  private primary(): Node {
    try {
      if (this.check(TokenType.NUMBER)) {
        this.advance();
        return {
          type: 'NumberLiteral',
          value: parseFloat(this.previous().lexeme),
          hasMillimeterSuffix: this.consumeMillimeterSuffix(),
        };
      }

      if (this.check(TokenType.VARIABLE)) {
        this.advance();
        return {
          type: 'Variable',
          name: this.previous().lexeme,
          hasMillimeterSuffix: this.consumeMillimeterSuffix(),
        };
      }

      if (this.check(TokenType.SPECIAL_VARIABLE)) {
        this.advance();
        return {
          type: 'SpecialVariable',
          name: this.previous().lexeme,
          hasMillimeterSuffix: this.previous().lexeme === 'n',
        };
      }

      if (this.check(TokenType.FUNCTION)) {
        this.advance();
        const functionName = this.previous().lexeme;
        this.consume(
          TokenType.PAREN_OPEN,
          `Expected '(' after function name '${functionName}'.`
        );
        const arg = this.expression();
        this.consume(
          TokenType.PAREN_CLOSE,
          `Expected ')' after function arguments.`
        );
        return {
          type: 'FunctionCall',
          name: functionName,
          arg: arg,
          hasMillimeterSuffix: this.consumeMillimeterSuffix(),
        };
      }

      if (this.check(TokenType.PAREN_OPEN)) {
        this.advance();
        const expr = this.expression();
        if (!expr) {
          throw new Error('Expected expression inside parentheses.');
        }
        this.consume(TokenType.PAREN_CLOSE, "Expected ')' after expression.");
        return {
          type: 'Grouping',
          expression: expr,
          hasMillimeterSuffix: this.consumeMillimeterSuffix(),
        };
      }

      if (this.check(TokenType.PAREN_CLOSE)) {
        throw new Error(`Unexpected ')' without a matching '('.`);
      }

      if (this.check(TokenType.BRACE_OPEN)) {
        this.advance();
        let content = this.sections();
        this.consume(TokenType.BRACE_CLOSE, "Expected '}' after expression.");

        if (content.type === 'Section' && content.nodes.type === 'Section') {
          content = content.nodes as Node;
        }
        return {
          type: 'Repeated',
          toRepeat: content,
          hasMillimeterSuffix: this.consumeMillimeterSuffix(),
        };
      }

      if (this.check(TokenType.ANGLE_BRACKET_OPEN)) {
        return this.sections();
      }
      throw new Error(`Unexpected token: ${this.peek().lexeme}`);
    } catch (err) {
      throw new Error(`Failed to parse primary: ${(err as Error).message}`);
    }
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private consume(type: TokenType, errorMessage: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(errorMessage);
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}
