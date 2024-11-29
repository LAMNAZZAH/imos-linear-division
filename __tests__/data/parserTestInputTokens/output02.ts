export const output02 = {
  type: 'Sections',
  sections: [
    {
      type: 'Section',
      nodes: {
        type: 'Grouping',
        expression: {
          type: 'BinaryExpression',
          left: {
            type: 'FunctionCall',
            name: 'round',
            arg: {
              type: 'NumberLiteral',
              value: 10,
              hasMillimeterSuffix: false,
            },
            hasMillimeterSuffix: false,
          },
          operator: '+',
          right: {
            type: 'FunctionCall',
            name: 'tan',
            arg: {
              type: 'BinaryExpression',
              left: {
                type: 'NumberLiteral',
                value: 2,
                hasMillimeterSuffix: false,
              },
              operator: '+',
              right: {
                type: 'NumberLiteral',
                value: 1,
                hasMillimeterSuffix: false,
              },
            },
            hasMillimeterSuffix: false,
          },
        },
        hasMillimeterSuffix: true,
      },
      hasMillimeterSuffix: false,
    },
    {
      type: 'Section',
      nodes: {
        type: 'BinaryExpression',
        left: {
          type: 'NumberLiteral',
          value: 5,
          hasMillimeterSuffix: false,
        },
        operator: '*',
        right: {
          type: 'Repeated',
          toRepeat: {
            type: 'Section',
            nodes: {
              type: 'NumberLiteral',
              value: 15,
              hasMillimeterSuffix: false,
            },
            hasMillimeterSuffix: false,
          },
          hasMillimeterSuffix: false,
        },
      },
      hasMillimeterSuffix: false,
    },
    {
      type: 'Section',
      nodes: {
        type: 'Grouping',
        expression: {
          type: 'BinaryExpression',
          left: {
            type: 'SpecialVariable',
            name: 'n',
            hasMillimeterSuffix: true,
          },
          operator: '*',
          right: {
            type: 'NumberLiteral',
            value: 2,
            hasMillimeterSuffix: true,
          },
        },
        hasMillimeterSuffix: false,
      },
      hasMillimeterSuffix: false,
    },
  ],
};
