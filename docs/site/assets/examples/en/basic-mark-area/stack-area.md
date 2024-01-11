---
category: examples
group: basic-mark-area
title: Stacked Area Chart
order: 2-1
cover: /vgrammar/preview/basic-mark-area-stack-area_0.7.6.png
---

# Stacked Area Chart

## Code Demo

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
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
          month: 'Apr.',
          product: 'C',
          value: 300
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
          value: 235
        },
        {
          month: 'Jul.',
          product: 'B',
          value: 153
        },
        {
          month: 'Jul.',
          product: 'C',
          value: 159
        },
        {
          month: 'Aug.',
          product: 'A',
          value: 220
        },
        {
          month: 'Aug.',
          product: 'B',
          value: 220
        },
        {
          month: 'Aug.',
          product: 'C',
          value: 209
        },
        {
          month: 'Sep.',
          product: 'A',
          value: 129
        },
        {
          month: 'Sep.',
          product: 'B',
          value: 131
        },
        {
          month: 'Sep.',
          product: 'C',
          value: 219
        },
        {
          month: 'Oct.',
          product: 'A',
          value: 415
        },
        {
          month: 'Oct.',
          product: 'B',
          value: 215
        },
        {
          month: 'Oct.',
          product: 'C',
          value: 315
        },
        {
          month: 'Nov.',
          product: 'A',
          value: 219
        },
        {
          month: 'Nov.',
          product: 'B',
          value: 319
        },
        {
          month: 'Nov.',
          product: 'C',
          value: 149
        },
        {
          month: 'Dec.',
          product: 'A',
          value: 155
        },
        {
          month: 'Dec.',
          product: 'B',
          value: 115
        },
        {
          month: 'Dec.',
          product: 'C',
          value: 125
        }
      ]
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

  scales: [
    {
      id: 'xscale',
      type: 'point',
      domain: { data: 'stack', field: 'month' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
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
        return [params.viewBox.y2, params.viewBox.y1];
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
  interactions: [
    {
      type: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'line',
      crosshairType: 'x',
      dependency: ['viewBox'],
      attributes: (scale, elment, params) => {
        return {
          start: { y: params.viewBox.y1 },
          end: { y: params.viewBox.y2 }
        };
      }
    }
  ],

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
            x: params.viewBox.x1,
            y: params.viewBox.y2,
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
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: params.viewBox.height() },
            end: { x: 0, y: 0 },
            verticalFactor: -1
          };
        }
      }
    },

    {
      type: 'area',
      from: { data: 'stack' },
      groupBy: 'product',
      key: 'month',
      encode: {
        update: {
          x: { scale: 'xscale', field: 'month' },
          y: { scale: 'yscale', field: 'value' },
          y1: { scale: 'yscale', field: 'lastValue' },
          fill: { scale: 'color', field: 'product' }
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## Related Tutorials
