---
category: examples
group: basic-mark-rect
title: 百分比堆积柱图
order: 0-4
cover: /vgrammar/preview/basic-mark-rect-percent-rect_0.7.6.png
---

# 百分比堆积柱图

## 关键配置

- `transform` 通过`stack`类型的`transform`，实现百分比堆积图

## 代码演示

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
          asPrevStack: 'lastValue',
          asPercent: 'percent',
          asPercentStack: 'percent1',
          asPrevPercentStack: 'percent0',
          asSum: 'sum'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
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
      domain: { data: 'stack', field: ['percent1', 'percent0'] },
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
      crosshairShape: 'rect',
      crosshairType: 'x',
      dependencies: ['viewBox'],
      attributes: (scale, elment, params) => {
        return {
          start: { y: params.viewBox.y1 },
          end: { y: params.viewBox.y2 }
        };
      }
    },
    {
      type: 'tooltip',
      selector: '#stack',
      title: { value: { field: 'month' } },
      dependencies: ['color'],
      content: [
        {
          key: '数量',
          value: { field: 'value' },
          symbol: (datum, params) => {
            return {
              symbolType: 'square',
              fill: params.color.scale(datum.product)
            };
          }
        },
        {
          key: '占比',
          value: (datum, params) => {
            return (datum.percent * 100).toFixed(2) + '%';
          },
          symbol: (datum, params) => {
            return {
              symbolType: 'square',
              fill: params.color.scale(datum.product)
            };
          }
        }
      ]
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
      type: 'rect',
      id: 'stack',
      from: { data: 'stack' },
      groupBy: 'product',
      key: 'month',
      encode: {
        update: {
          x: { scale: 'xscale', field: 'month', band: 0.25 },
          width: { scale: 'xscale', band: 0.5 },
          y: { scale: 'yscale', field: 'percent1' },
          y1: { scale: 'yscale', field: 'percent0' },
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
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 相关教程
