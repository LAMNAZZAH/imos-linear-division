// round(20) + 2{3}: round(10)mm + 1: 1
export const output02 = [
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 0,
  },
  {
    type: 'FUNCTION',
    lexeme: 'round',
    position: 0,
  },
  {
    type: 'PAREN_OPEN',
    lexeme: '(',
    position: 5,
  },
  {
    type: 'NUMBER',
    lexeme: '20',
    position: 6,
  },
  {
    type: 'PAREN_CLOSE',
    lexeme: ')',
    position: 8,
  },
  {
    type: 'OPERATOR',
    lexeme: '+',
    position: 10,
  },
  {
    type: 'NUMBER',
    lexeme: '2',
    position: 12,
  },
  {
    type: 'OPERATOR',
    lexeme: '*',
    position: 13,
  },
  {
    type: 'BRACE_OPEN',
    lexeme: '{',
    position: 13,
  },
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 13,
  },
  {
    type: 'NUMBER',
    lexeme: '3',
    position: 14,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 15,
  },
  {
    type: 'BRACE_CLOSE',
    lexeme: '}',
    position: 15,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 16,
  },
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 16,
  },
  {
    type: 'FUNCTION',
    lexeme: 'round',
    position: 18,
  },
  {
    type: 'PAREN_OPEN',
    lexeme: '(',
    position: 23,
  },
  {
    type: 'NUMBER',
    lexeme: '10',
    position: 24,
  },
  {
    type: 'PAREN_CLOSE',
    lexeme: ')',
    position: 26,
  },
  {
    type: 'UNIT',
    lexeme: 'mm',
    position: 27,
  },
  {
    type: 'OPERATOR',
    lexeme: '+',
    position: 30,
  },
  {
    type: 'NUMBER',
    lexeme: '1',
    position: 32,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 33,
  },
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 33,
  },
  {
    type: 'NUMBER',
    lexeme: '1',
    position: 35,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 35,
  },
  {
    type: 'EOF',
    lexeme: '1',
    position: 35,
  },
];
