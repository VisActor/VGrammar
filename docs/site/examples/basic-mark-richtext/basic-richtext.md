---
category: examples
group: basic-mark-richtext
title: richtext基础使用
order: 8-0
cover:
---

# richtext 基础使用

## 代码演示

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 40, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          sales: 'Jack',
          2020: 324,
          2021: 420
        },
        {
          sales: 'Marry',
          2020: 240,
          2021: 321
        },
        {
          sales: 'Tom',
          2020: 601,
          2021: 561
        },
        {
          sales: 'Lily',
          2020: 320,
          2021: 287
        },
        {
          sales: 'Lucy',
          2020: 629,
          2021: 400
        },
        {
          sales: 'Nancy',
          2020: 320,
          2021: 312
        },
        {
          sales: 'Ada',
          2020: 420,
          2021: 312
        },
        {
          sales: 'Bill',
          2020: 563,
          2021: 890
        },
        {
          sales: 'Maggie',
          2020: 223,
          2021: 444
        }
      ]
    }
  ],

  scales: [
    {
      id: 'yScale',
      type: 'band',
      domain: { data: 'table', field: 'sales' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'xScale',
      type: 'linear',
      domain: { data: 'table', field: ['2020'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      nice: true,
      zero: true
    },
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: ['2020', '2021'],
      range: ['#6690F2', '#70D6A3']
    }
  ],

  marks: [
    {
      type: 'richtext',
      dependency: ['viewBox'],
      encode: {
        update: (datum, elment, params) => {
          return {
            x: (params.viewBox.x1 + params.viewBox.x2) / 2,
            y: 0,
            textAlign: 'center',
            textBaseline: 'top',

            textConfig: [
              {
                text: '2020',
                fontWeight: 'bold',
                fontSize: 40,
                fillColor: [
                  '#6690F2',
                  '#70D6A3',
                  '#B4E6E2',
                  '#63B5FC',
                  '#FF8F62',
                  '#FFDC83',
                  '#BCC5FD',
                  '#A29BFE',
                  '#63C4C7',
                  '#F68484'
                ][1],
                fill: true
              },
              {
                text: '销售趋势',
                fillColor: '#333',
                fill: true
              }
            ]
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'yScale',
      crosshairShape: 'rect',
      crosshairType: 'y',
      dependency: ['viewBox'],
      encode: {
        update: (datum, elment, params) => {
          return {
            start: { x: params.viewBox.x1 },
            end: { x: params.viewBox.x2 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xScale',
      tickCount: 5,
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
      scale: 'yScale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: 0 },
            end: { x: 0, y: params.viewBox.height() }
          };
        }
      }
    },
    {
      type: 'rect',
      from: { data: 'table' },
      encode: {
        update: {
          x: { scale: 'xScale', field: '2020' },
          x1: { scale: 'xScale', value: 0 },
          y: { scale: 'yScale', field: 'sales', band: 0.25 },
          height: { scale: 'yScale', band: 0.5 },
          fill: '#6690F2'
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

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 相关教程
