// (2*3){2:3}:1:2.2{1:2}
export const output03 = [
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 0,
  },
  {
    type: 'PAREN_OPEN',
    lexeme: '(',
    position: 0,
  },
  {
    type: 'NUMBER',
    lexeme: '2',
    position: 1,
  },
  {
    type: 'OPERATOR',
    lexeme: '*',
    position: 2,
  },
  {
    type: 'NUMBER',
    lexeme: '3',
    position: 3,
  },
  {
    type: 'PAREN_CLOSE',
    lexeme: ')',
    position: 4,
  },
  {
    type: 'OPERATOR',
    lexeme: '*',
    position: 5,
  },
  {
    type: 'BRACE_OPEN',
    lexeme: '{',
    position: 5,
  },
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 5,
  },
  {
    type: 'NUMBER',
    lexeme: '2',
    position: 6,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 7,
  },
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 7,
  },
  {
    type: 'NUMBER',
    lexeme: '3',
    position: 8,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 9,
  },
  {
    type: 'BRACE_CLOSE',
    lexeme: '}',
    position: 9,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 10,
  },
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 10,
  },
  {
    type: 'NUMBER',
    lexeme: '1',
    position: 11,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 12,
  },
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 12,
  },
  {
    type: 'NUMBER',
    lexeme: '2.2',
    position: 13,
  },
  {
    type: 'OPERATOR',
    lexeme: '*',
    position: 16,
  },
  {
    type: 'BRACE_OPEN',
    lexeme: '{',
    position: 16,
  },
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 16,
  },
  {
    type: 'NUMBER',
    lexeme: '1',
    position: 17,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 18,
  },
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 18,
  },
  {
    type: 'NUMBER',
    lexeme: '2',
    position: 19,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 20,
  },
  {
    type: 'BRACE_CLOSE',
    lexeme: '}',
    position: 20,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 20,
  },
  {
    type: 'EOF',
    lexeme: '}',
    position: 20,
  },
];
