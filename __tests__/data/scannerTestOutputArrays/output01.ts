// 1: 2+3 mm
export const output01 = [
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 0,
  },
  {
    type: 'NUMBER',
    lexeme: '1',
    position: 0,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 1,
  },
  {
    type: 'LEFT_ANGLE_BRACKET',
    lexeme: '<',
    position: 1,
  },
  {
    type: 'NUMBER',
    lexeme: '2',
    position: 3,
  },
  {
    type: 'OPERATOR',
    lexeme: '+',
    position: 4,
  },
  {
    type: 'NUMBER',
    lexeme: '3',
    position: 5,
  },
  {
    type: 'UNIT',
    lexeme: 'mm',
    position: 7,
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    lexeme: '>',
    position: 7,
  },
  {
    type: 'EOF',
    lexeme: 'mm',
    position: 7,
  },
];
