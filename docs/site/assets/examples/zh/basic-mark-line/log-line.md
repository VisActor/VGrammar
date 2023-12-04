---
category: examples
group: basic-mark-line
title: log轴线图
order: 1-2
cover: /vgrammar/preview/basic-mark-line-log-line_0.7.6.png
---

# log 轴线图

当数据的数量级差别较大的时候，我们可以通过使用`log` 类型的`scale` 来减缓曲线的变化趋势

## 代码演示

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          time: '0',
          a: 123,
          b: 117,
          c: 145
        },
        {
          time: '30',
          a: 1223,
          b: 1317,
          c: 2345
        },
        {
          time: '60',
          a: 2123,
          b: 2500,
          c: 3100
        },
        {
          time: '90',
          a: 5123,
          b: 7500,
          c: 6100
        },
        {
          time: '120',
          a: 5123,
          b: 7500,
          c: 6100
        },
        {
          time: '150',
          a: 6123,
          b: 8500,
          c: 7100
        },
        {
          time: '180',
          a: 8123,
          b: 9500,
          c: 8100
        },
        {
          time: '210',
          a: 10123,
          b: 12500,
          c: 11100
        },
        {
          time: '240',
          a: 14123,
          b: 15500,
          c: 16100
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'point',
      domain: { data: 'table', field: 'time' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'log',
      domain: { data: 'table', field: ['a', 'b', 'c'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      }
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
    },
    {
      type: 'tooltip',
      selector: '#symbol',
      title: { value: { field: 'time' } },
      content: [{ key: 'a', value: { field: 'a' } }]
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
      type: 'line',
      from: { data: 'table' },
      encode: {
        update: {
          curveType: 'monotoneX',
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'a' },
          stroke: '#6690F2'
        },
        hover: {
          stroke: 'red',
          lineWidth: 2
        }
      }
    },
    {
      type: 'symbol',
      id: 'symbol',
      from: { data: 'table' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'a' },
          fill: '#6690F2'
        },
        hover: {
          fill: 'red',
          lineWidth: 2
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
