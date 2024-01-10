---
category: examples
group: animate
title: Basic Animation
order: 60-0
cover: /vgrammar/preview/animate-basic-animate_0.7.6.gif
---

# Basic Animation

Basic animation example, all graphic elements can be configured for entering/exiting/updating animations.

## Code Demonstration

```javascript livedemo template=vgrammar
const originData = [
  {
    month: 'Jan.',
    product: 'A',
    value: 203
  },
  {
    month: 'Jan.',
    product: 'B',
    value: 120
  },
  {
    month: 'Jan.',
    product: 'C',
    value: 230
  },
  {
    month: 'Feb.',
    product: 'A',
    value: 129
  },
  {
    month: 'Feb.',
    product: 'B',
    value: 430
  },
  {
    month: 'Feb.',
    product: 'C',
    value: 233
  },
  {
    month: 'Mar.',
    product: 'A',
    value: 100
  },
  {
    month: 'Mar.',
    product: 'B',
    value: 100
  },
  {
    month: 'Mar.',
    product: 'C',
    value: 100
  },
  {
    month: 'Apr.',
    product: 'A',
    value: 100
  },
  {
    month: 'Apr.',
    product: 'B',
    value: 100
  },
  {
    month: 'May',
    product: 'A',
    value: 221
  },
  {
    month: 'May',
    product: 'B',
    value: 410
  },
  {
    month: 'May',
    product: 'C',
    value: 309
  },
  {
    month: 'Jun.',
    product: 'A',
    value: 221
  },
  {
    month: 'Jun.',
    product: 'B',
    value: 221
  },
  {
    month: 'Jun.',
    product: 'C',
    value: 221
  },
  {
    month: 'Jul.',
    product: 'A',
    value: 15
  },
  {
    month: 'Jul.',
    product: 'B',
    value: 15
  },
  {
    month: 'Jul.',
    product: 'C',
    value: 15
  },
  {
    month: 'Aug.',
    product: 'A',
    value: 20
  },
  {
    month: 'Aug.',
    product: 'B',
    value: 20
  },
  {
    month: 'Aug.',
    product: 'C',
    value: 20
  },
  {
    month: 'Sep.',
    product: 'A',
    value: 19
  },
  {
    month: 'Sep.',
    product: 'B',
    value: 19
  },
  {
    month: 'Sep.',
    product: 'C',
    value: 19
  },
  {
    month: 'Oct.',
    product: 'A',
    value: 15
  },
  {
    month: 'Oct.',
    product: 'B',
    value: 15
  },
  {
    month: 'Oct.',
    product: 'C',
    value: 15
  },
  {
    month: 'Nov.',
    product: 'A',
    value: 19
  },
  {
    month: 'Nov.',
    product: 'B',
    value: 19
  },
  {
    month: 'Nov.',
    product: 'C',
    value: 19
  },
  {
    month: 'Dec.',
    product: 'A',
    value: 15
  },
  {
    month: 'Dec.',
    product: 'B',
    value: 15
  },
  {
    month: 'Dec.',
    product: 'C',
    value: 15
  }
];

const nextData = [
  {
    month: 'Jan.',
    product: 'A',
    value: 103
  },
  {
    month: 'Jan.',
    product: 'B',
    value: 130
  },
  {
    month: 'Jan.',
    product: 'C',
    value: 250
  },
  {
    month: 'Feb.',
    product: 'A',
    value: 169
  },
  {
    month: 'Feb.',
    product: 'B',
    value: 230
  },
  {
    month: 'Feb.',
    product: 'C',
    value: 223
  },
  {
    month: 'Mar.',
    product: 'A',
    value: 130
  },
  {
    month: 'Mar.',
    product: 'B',
    value: 80
  },
  {
    month: 'Mar.',
    product: 'C',
    value: 70
  },
  {
    month: 'Apr.',
    product: 'A',
    value: 50
  },
  {
    month: 'Apr.',
    product: 'B',
    value: 130
  },
  {
    month: 'May',
    product: 'A',
    value: 231
  },
  {
    month: 'May',
    product: 'B',
    value: 260
  },
  {
    month: 'May',
    product: 'C',
    value: 439
  },
  {
    month: 'Jun.',
    product: 'A',
    value: 241
  },
  {
    month: 'Jun.',
    product: 'B',
    value: 261
  },
  {
    month: 'Jun.',
    product: 'C',
    value: 251
  },
  {
    month: 'Jul.',
    product: 'A',
    value: 185
  },
  {
    month: 'Jul.',
    product: 'B',
    value: 105
  },
  {
    month: 'Jul.',
    product: 'C',
    value: 115
  },
  {
    month: 'Aug.',
    product: 'A',
    value: 90
  },
  {
    month: 'Aug.',
    product: 'B',
    value: 120
  },
  {
    month: 'Aug.',
    product: 'C',
    value: 120
  },
  {
    month: 'Sep.',
    product: 'A',
    value: 89
  },
  {
    month: 'Sep.',
    product: 'B',
    value: 169
  },
  {
    month: 'Sep.',
    product: 'C',
    value: 119
  },
  {
    month: 'Oct.',
    product: 'A',
    value: 75
  },
  {
    month: 'Oct.',
    product: 'B',
    value: 75
  },
  {
    month: 'Oct.',
    product: 'C',
    value: 65
  },
  {
    month: 'Nov.',
    product: 'A',
    value: 149
  },
  {
    month: 'Nov.',
    product: 'B',
    value: 129
  },
  {
    month: 'Nov.',
    product: 'C',
    value: 79
  },
  {
    month: 'Dec.',
    product: 'A',
    value: 115
  },
  {
    month: 'Dec.',
    product: 'B',
    value: 65
  },
  {
    month: 'Dec.',
    product: 'C',
    value: 65
  }
];

const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: originData
    },
    {
      id: 'stack',
      source: 'table',
      transform: [
        {
          type: 'stack',
          dimensionField: 'month',
          stackField: 'value',
          asStack: 'value',
          asPrevStack: 'lastValue'
        }
      ]
    }
  ],
  interactions: [
    {
      type: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'rect',
      crosshairType: 'x',
      container: '#container'
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'stack', field: 'month' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },

      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'stack', field: ['value', 'lastValue'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'stack', field: 'month' },
      range: [
        '#6690F2',
        '#70D6A3',
        '#B4E6E2'
        // '#63B5FC',
        // '#FF8F62',
        // '#FFDC83',
        // '#BCC5FD',
        // '#A29BFE',
        // '#63C4C7',
        // '#F68484'
      ]
    }
  ],
  marks: [
    {
      type: 'group',
      id: 'container',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            width: params.viewBox.width(),
            height: params.viewBox.height()
          };
        }
      },
      marks: [
        {
          type: 'component',
          componentType: 'axis',
          scale: 'xscale',
          tickCount: -1,
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: params.viewBox.height(),
                start: { x: 0, y: 0 },
                end: { x: params.viewBox.width(), y: 0 }
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'axis',
          scale: 'yscale',
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: 0,
                start: { x: 0, y: params.viewBox.height() },
                end: { x: 0, y: 0 },
                verticalFactor: -1
              };
            }
          }
        },

        {
          type: 'rect',
          from: { data: 'stack' },
          groupBy: 'product',
          key: 'month',
          encode: {
            update: {
              x: { scale: 'xscale', field: 'month', band: 0.25 },
              width: { scale: 'xscale', band: 0.5 },
              y: { scale: 'yscale', field: 'value' },
              y1: { scale: 'yscale', field: 'lastValue' },
              fill: { scale: 'color', field: 'product' }
            },
            hover: {
              fill: 'red'
            }
          },
          animation: {
            enter: {
              type: 'growHeightIn',
              duration: 2000,
              options: (datum, element, params) => {
                return { overall: params.viewBox.y2, orient: 'negative' };
              }
            },
            update: {
              type: 'update',
              duration: 2000
            },
            exit: {
              type: 'fadeOut',
              duration: 2000
            },
            state: {
              duration: 500
            }
          },
          dependency: ['viewBox']
        }
      ]
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  // autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.run();

setTimeout(() => {
  View.getDataById('table').values(nextData);
  vGrammarView.run();
}, 3000);

setTimeout(() => {
  View.getDataById('table').values([]);
  vGrammarView.run();
}, 6000);

setTimeout(() => {
  View.getDataById('table').values(originData);
  vGrammarView.run();
}, 9000);

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## Related Tutorials
