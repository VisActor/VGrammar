---
category: examples
group: basic-mark-polygon
title: 漏斗图
order: 5-0

cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vgrammar-basic-mark-polygon-basic-polygon.png
---

# 漏斗图

使用`polygon`图元实现漏斗图

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
      type: 'linear',
      domain: { data: 'funnel', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true,
      min: 0
    },
    {
      id: 'yscale',
      type: 'band',
      domain: { data: 'funnel', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      },
      padding: 0.05,
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
            const xRange = xScale.range();
            const midX = (xRange[0] + xRange[1]) / 2;
            const height = yScale.bandwidth();
            const baseX = xScale.scale(0);
            const upWidth = xScale.scale(datum.value) - baseX;
            const downWidth = datum.nextValue == null ? 0 : xScale.scale(datum.nextValue) - baseX;
            const y0 = yScale.scale(datum.name);

            return [
              {
                x: midX - upWidth / 2,
                y: y0
              },
              {
                x: midX + upWidth / 2,
                y: y0
              },
              {
                x: midX + downWidth / 2,
                y: y0 + height
              },
              {
                x: midX - downWidth / 2,
                y: y0 + height
              }
            ];
          },
          fill: { scale: 'color', field: 'name' }
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
