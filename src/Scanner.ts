import { Token } from './types';
import { TokenType } from './types';

// TODO: fix mispositioning of angle brackets

export class Scanner {
  private cache = new Map<string, Token[]>();

  private source: string = '';
  private tokens: Token[] = [];
  private start: number = 0;
  private current: number = 0;
  private errors: string[] = [];

  private reportError(message: string): void {
    this.errors.push(message);
    console.error(`Error at position: ${this.current}: ${message}`);
  }

  private static readonly MATHEMATICAL_FUNCTIONS: { [key: string]: TokenType } =
    {
      abs: TokenType.FUNCTION,
      acos: TokenType.FUNCTION,
      asin: TokenType.FUNCTION,
      atan: TokenType.FUNCTION,
      bog2deg: TokenType.FUNCTION,
      cos: TokenType.FUNCTION,
      deg2bog: TokenType.FUNCTION,
      in2mm: TokenType.FUNCTION,
      ln: TokenType.FUNCTION,
      log: TokenType.FUNCTION,
      log10: TokenType.FUNCTION,
      max: TokenType.FUNCTION,
      maxunder: TokenType.FUNCTION,
      mm2in: TokenType.FUNCTION,
      nextto: TokenType.FUNCTION,
      pi: TokenType.FUNCTION,
      pow: TokenType.FUNCTION,
      round: TokenType.FUNCTION,
      sin: TokenType.FUNCTION,
      sqr: TokenType.FUNCTION,
      tab: TokenType.FUNCTION,
      tan: TokenType.FUNCTION,
    };

  scan(source: string): Token[] {
    if (this.cache.has(source)) {
      const tokens: Token[] = this.cache.get(source)!;
      this.cache.delete(source);
      this.cache.set(source, tokens);

      console.log('I have read it from cache for: ' + source);
      return tokens;
    }

    console.log('here I am scanning: ' + source);

    try {
      this.source = source;
      const tokens = this.preformScan();
      this.cache.set(this.source, tokens);

      if (this.cache.size > 3) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey!);
      }

      return tokens;

    } catch (err) {
      console.error(err);
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  public preformScan() {
    this.resetState();
    try {
      if (this.source.includes('<') || this.source.includes('>')) {
        // angle brackets causes infinite loops
        throw new Error('Angle brackets are not allowed in the input string');
      }

      if (this.source.length === 0) {
        throw new Error('Empty input string');
      }

      this.start = 0;
      this.current = 0;
      this.tokens = [];

      if (this.start === 0) {
        this.addToken(TokenType.ANGLE_BRACKET_OPEN, '<');
      }

      while (!this.isAtEnd()) {
        this.start = this.current;
        const char = this.peek();

        switch (char) {
          case ':':
            this.addToken(TokenType.ANGLE_BRACKET_CLOSE, '>');
            this.addToken(TokenType.ANGLE_BRACKET_OPEN, '<');
            this.advance();
            break;
          case ' ':
          case '\r':
          case '\t':
          case '\n':
            this.advance();
            break;
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
          case '.':
            this.scanNumber();
            break;
          case '$':
            this.scanVariable();
            break;
          case '+':
          case '-':
          case '*':
          case '/':
            this.addToken(TokenType.OPERATOR, char);
            this.advance();
            break;
          case '(':
            this.addToken(TokenType.PAREN_OPEN, '(');
            this.advance();
            break;
          case ')':
            this.addToken(TokenType.PAREN_CLOSE, ')');
            this.advance();
            break;
          case '{':
            if (
              this.current != 0 &&
              this.tokens[this.tokens.length - 1].type != TokenType.OPERATOR
            ) {
              this.addToken(TokenType.OPERATOR, '*');
            }
            this.addToken(TokenType.BRACE_OPEN, '{');
            this.addToken(TokenType.ANGLE_BRACKET_OPEN, '<');
            this.advance();
            break;
          case '}':
            this.addToken(TokenType.ANGLE_BRACKET_CLOSE, '>');
            this.addToken(TokenType.BRACE_CLOSE, '}');
            this.advance();
            break;
          case '[':
            this.addToken(TokenType.OPERATOR, '~');
            this.addToken(TokenType.BRACKET_OPEN, '[');
            this.advance();
            break;
          case ']':
            this.addToken(TokenType.BRACKET_CLOSE, ']');
            this.advance();
            break;
          case 'm':
            if (this.peekNext() === 'm') {
              this.scanMm();
            } else {
              this.scanIdentifierOrFunction();
            }
            break;
          default:
            if (this.isAlpha(char)) {
              this.scanIdentifierOrFunction();
            } else {
              this.reportError(
                `Unexpected character: ${char} at position: ${this.current}`
              );
            }
        }
      }

      this.addToken(TokenType.ANGLE_BRACKET_CLOSE, '>');
      this.addToken(TokenType.EOF, '');

      if (this.errors.length > 0) {
        throw new Error(this.errors.join(',\n'));
      }
      return this.tokens;

    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  private addToken(type: TokenType, lexeme?: string): void {
    console.log(
      'lexeme: ' + lexeme ||
        (type ? this.source.substring(this.start, this.current) : '')
    );
    this.tokens.push({
      type: type,
      lexeme:
        lexeme || (type ? this.source.substring(this.start, this.current) : ''),
      position: this.start,
    });
  }

  private isDigit(char: string): boolean {
    return /^[0-9]$/.test(char);
  }

  private isAlpha(char: string): boolean {
    return /^[a-zA-Z]$/.test(char);
  }

  private scanNumber(): void {
    while (this.isDigit(this.peek())) {
      console.log('peek: ' + this.peek());
      this.advance();
    }

    // Handle decimals
    if (this.peek() === '.') {
      console.log('peek dot: ' + this.peek());
      this.advance(); // Consume the '.'

      if (!this.isDigit(this.peek())) {
        this.reportError(
          'Expected digit after decimal point at position: ' + this.current
        );
      }
      while (this.isDigit(this.peek())) {
        console.log('peek digit: ' + this.peek());
        this.advance();
      }
    }

    this.addToken(TokenType.NUMBER);
  }

  private scanVariable(): void {
    this.advance(); // Consume '$'
    while (/[a-zA-Z0-9_]/.test(this.peek())) {
      this.advance();
    }
    const fullVariable = this.source.substring(this.start + 1, this.current);

    if (fullVariable.endsWith('mm')) {
      const variable = fullVariable.substring(0, fullVariable.length - 2);
      if (variable && variable.length > 0) {
        this.addToken(TokenType.VARIABLE, variable);
        this.addToken(TokenType.UNIT, 'mm');
      } else {
        this.reportError('Variable name cannot be empty or $mm');
      }
    } else {
      this.addToken(TokenType.VARIABLE, fullVariable);
    }
  }

  private scanMm(): void {
    this.advance();
    this.advance();
    this.addToken(TokenType.UNIT, 'mm');
  }

  private scanIdentifierOrFunction(): void {
    const allowedSpecialVariables = ['X', 'Y', 'n'];

    while (this.isAlpha(this.peek())) {
      this.advance();
    }

    const identifier = this.source.substring(this.start, this.current);
    const functionType: TokenType | undefined =
      Scanner.MATHEMATICAL_FUNCTIONS[identifier.toLocaleLowerCase()];

    if (functionType != undefined) {
      this.addToken(functionType, identifier);
    } else if (allowedSpecialVariables.includes(identifier)) {
      this.addToken(TokenType.SPECIAL_VARIABLE, identifier);
    } else {
      this.reportError(
        `Unknown identifier: ${identifier} at position: ${this.current}`
      );
    }
  }

  private resetState(): void {
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.errors = [];
  }
}
