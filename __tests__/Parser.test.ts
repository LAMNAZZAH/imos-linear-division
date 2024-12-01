import { Parser } from '../src/Parser';
import { input01 } from './data/parserTestInputTokens/input01';
import { output01 } from './data/parserTestInputTokens/output01';
import { input02 } from './data/parserTestInputTokens/input02';
import { output02 } from './data/parserTestInputTokens/output02';
import { Token } from '../src/types';
import { TokenType } from '../src/types';

const parser = new Parser();

describe('Parser', () => {
  // 1:2:3mm
  it('parses input correctly', () => {
    const ast = parser.parse(input01 as Token[]);

    expect(ast).toBeInstanceOf(Object);
    expect(ast).toEqual(output01);
  });

  // (round(10)+tan(2+1))mm:5{15}:(n*2mm)
  it('parses input with functions / groups / mm correctly', () => {
    const ast = parser.parse(input02 as Token[]);

    expect(ast).toBeInstanceOf(Object);
    expect(ast).toEqual(output02);
  });

  it('throws error for empty input', () => {
    expect(() => parser.parse([])).toThrow();
  });

  it('throw error for empty ()', () => {
    expect(() => parser.parse([
      {
        type: TokenType.ANGLE_BRACKET_CLOSE,
        lexeme: '<',
        position: 0,
      },
      {
        type: TokenType.PAREN_OPEN,
        lexeme: '(',
        position: 0,
      },
      {
        type: TokenType.PAREN_CLOSE,
        lexeme: ')',
        position: 1,
      },
      {
        type: TokenType.ANGLE_BRACKET_OPEN,
        lexeme: '>',
        position: 1,
      },
      {
        type: TokenType.EOF,
        lexeme: ')',
        position: 1,
      },
    ])).toThrow();
  });
});
