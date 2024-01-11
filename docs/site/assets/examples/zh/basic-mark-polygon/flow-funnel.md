---
category: examples
group: basic-mark-polygon
title: 转化漏斗图
order: 5-1
cover: /vgrammar/preview/basic-mark-polygon-flow-funnel_0.7.6.png
---

# 转化漏斗图

使用`polygon`图元实现转化漏斗图

## 代码演示

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          value: 5676,
          name: 'Sent'
        },
        {
          value: 3872,
          name: 'Viewed'
        },
        {
          value: 1668,
          name: 'Clicked'
        },
        {
          value: 610,
          name: 'Add to Cart'
        },
        {
          value: 565,
          name: 'Purchased'
        }
      ]
    },
    {
      id: 'funnel',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: data => {
            return data.map((entry, index, arr) => {
              return {
                ...entry,
                nextValue: arr[index + 1]?.value
              };
            });
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'funnel', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'funnel', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      padding: 0,
      round: true
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'funnel', field: 'name' },
      range: [
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
      ]
    }
  ],

  marks: [
    {
      type: 'polygon',
      from: { data: 'funnel' },
      dependency: ['xscale', 'yscale', 'viewBox'],
      encode: {
        update: {
          points: (datum, element, params) => {
            const xScale = params.xscale;
            const yScale = params.yscale;
            const width = xScale.bandwidth() / 2;
            const baseY = yScale.scale(0);
            const y0 = yScale.scale(datum.value);
            const y1 = datum.nextValue == null ? y0 : yScale.scale(datum.nextValue);
            const x0 = xScale.scale(datum.name);

            return [
              {
                x: x0,
                y: y0
              },
              {
                x: x0,
                y: baseY
              },
              {
                x: x0 + width,
                y: baseY
              },
              {
                x: x0 + width,
                y: y1
              }
            ];
          },
          fill: { scale: 'color', field: 'name' }
        },
        hover: {
          fill: 'red'
        }
      }
    },
    {
      type: 'rect',
      from: { data: 'funnel' },
      dependency: ['xscale', 'yscale', 'viewBox'],
      encode: {
        update: {
          x: { scale: 'xscale', field: 'name', band: 0.5 },
          x1: { scale: 'xscale', field: 'name', band: 1 },
          y: { scale: 'yscale', field: 'nextValue' },
          y1: { scale: 'yscale', value: 0 },
          fill: '#e6e6e6'
        }
      }
    },
    {
      type: 'text',
      from: { data: 'funnel' },
      dependency: ['xscale', 'yscale', 'viewBox'],
      encode: {
        update: {
          x: { scale: 'xscale', field: 'name', band: 0.75 },
          y: { scale: 'yscale', field: 'nextValue', offset: -10 },
          text: (datum, element, params) => {
            return datum.nextValue == null ? '' : `${((100 * datum.nextValue) / datum.value).toFixed(2)}%`;
          },
          fill: '#333',
          textAlign: 'center',
          textBaseline: 'middle'
        }
      }
    },
    {
      type: 'text',
      from: { data: 'funnel' },
      dependency: ['xscale', 'yscale', 'viewBox'],
      encode: {
        update: {
          x: { scale: 'xscale', field: 'name', band: 0.25 },
          y: { scale: 'yscale', value: 0, offset: -30 },
          text: { field: 'name' },
          fill: '#fff',
          textAlign: 'center',
          textBaseline: 'middle'
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

## 相关教程
