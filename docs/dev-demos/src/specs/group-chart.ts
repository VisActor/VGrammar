export const spec = {
  
  width: 500,
  height: 500,
  padding: 5,

  data: [
    {
      id: 'table',
      values: [
        { category: 'A', amount: 28, group: 'group0' },
        { category: 'B', amount: 55, group: 'group0' },
        { category: 'C', amount: 43, group: 'group0' },
        { category: 'D', amount: 91, group: 'group0' },
        { category: 'E', amount: 81, group: 'group0' },
        { category: 'F', amount: 53, group: 'group0' },
        { category: 'G', amount: 19, group: 'group0' },
        { category: 'H', amount: 87, group: 'group0' },

        { category: 'A', amount: 10, group: 'group1' },
        { category: 'B', amount: 77, group: 'group1' },
        { category: 'C', amount: 33, group: 'group1' },
        { category: 'D', amount: 78, group: 'group1' },
        { category: 'E', amount: 29, group: 'group1' },
        { category: 'F', amount: 56, group: 'group1' },
        { category: 'G', amount: 71, group: 'group1' },
        { category: 'H', amount: 11, group: 'group1' }
      ]
    },
    {
      id: 'table1',
      values: [
        // VGrammar scale don't support multiple fields
        { category: 'A', amount: 31, group0: 'group00', group1: 'group10', concatGroup: 'group00|group10' },
        { category: 'B', amount: 61, group0: 'group00', group1: 'group10', concatGroup: 'group00|group10' },
        { category: 'C', amount: 47, group0: 'group00', group1: 'group10', concatGroup: 'group00|group10' },

        { category: 'A', amount: 80, group0: 'group01', group1: 'group10', concatGroup: 'group01|group10' },
        { category: 'B', amount: 77, group0: 'group01', group1: 'group10', concatGroup: 'group01|group10' },
        { category: 'C', amount: 22, group0: 'group01', group1: 'group10', concatGroup: 'group01|group10' },

        { category: 'A', amount: 59, group0: 'group00', group1: 'group11', concatGroup: 'group00|group11' },
        { category: 'B', amount: 88, group0: 'group00', group1: 'group11', concatGroup: 'group00|group11' },
        { category: 'C', amount: 98, group0: 'group00', group1: 'group11', concatGroup: 'group00|group11' },

        { category: 'A', amount: 18, group0: 'group01', group1: 'group11', concatGroup: 'group01|group11' },
        { category: 'B', amount: 30, group0: 'group01', group1: 'group11', concatGroup: 'group01|group11' },
        { category: 'C', amount: 20, group0: 'group01', group1: 'group11', concatGroup: 'group01|group11' }
      ]
    }
  ],

  signals: [
    {
      id: 'topSignal',
      value: 'top'
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'category' },
      range: [0, 300],
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      domain: { data: 'table', field: 'amount' },
      nice: true,
      range: [0, 300]
    },
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'group' },
      range: ['blue', 'red', 'green']
    },
    {
      id: 'colorScale1',
      type: 'ordinal',
      domain: { data: 'table1', field: 'concatGroup' },
      range: ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine']
    }
  ],

  marks: [
    {
      type: 'group',
      id: 'group1',
      from: { data: 'table' }, // group 的数据声明应该在 parser 中被忽略
      signals: [
        {
          id: 'group1Signal',
          value: 'group1'
        }
      ],
      encode: {
        enter: {
          width: { value: 500 },
          height: { value: 500 },
          fill: { value: 'black' }
        }
      },
      marks: [
        {
          type: 'group',
          id: 'group2',
          signals: [
            {
              id: 'group2Signal',
              value: 'group2'
            }
          ],
          encode: {
            enter: {
              width: { value: 400 },
              height: { value: 400 },
              fill: { value: 'grey' }
            }
          },
          marks: [
            {
              type: 'symbol',
              from: { data: 'table' },
              encode: {
                enter: {
                  x: { scale: 'xscale', field: 'category' },
                  // width: { scale: 'xscale', band: 1 },
                  y: { scale: 'yscale', field: 'amount' },
                  // y1: { scale: 'yscale', value: 0 },
                  size: { value: 40 },
                  stroke: { value: 'white' },
                  lineWidth: { value: 2 }
                },
                update: {
                  fill: { scale: 'colorScale', field: 'group' }
                },
                hover: {
                  fill: { value: 'red' }
                }
              }
            },
            {
              type: 'line',
              from: { data: 'table' },
              groupBy: 'group',
              encode: {
                enter: {
                  x: { scale: 'xscale', field: 'category' },
                  // width: { scale: 'xscale', band: 1 },
                  y: { scale: 'yscale', field: 'amount' },
                  // y1: { scale: 'yscale', value: 0 },
                  stroke: { scale: 'colorScale', field: 'group' },
                  lineWidth: { value: 2 }
                }
              }
            },
            {
              type: 'line',
              from: { data: 'table1' },
              groupBy: ['group0', 'group1'],
              encode: {
                enter: {
                  x: { scale: 'xscale', field: 'category' },
                  // width: { scale: 'xscale', band: 1 },
                  y: { scale: 'yscale', field: 'amount' },
                  // y1: { scale: 'yscale', value: 0 },
                  stroke: { scale: 'colorScale1', field: 'concatGroup' },
                  // stroke: { value: 'Aqua' },
                  lineWidth: { value: 2 }
                }
              }
            }
          ]
        }
      ]
    }
  ]
};
