---
category: examples
group: basic-mark-arc
title: 饼图
order: 3-0
cover:
---

# 饼图

## 代码演示

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          value: 3676,
          name: ' ~ 29'
        },
        {
          value: 3872,
          name: '30 ~ 39'
        },
        {
          value: 1668,
          name: '40 ~ 49'
        },
        {
          value: 610,
          name: '50 ~'
        }
      ]
    },
    {
      id: 'stack',
      source: 'table',
      transform: [
        {
          type: 'stack',
          dimensionField: 'none',
          stackField: 'value',
          asStack: 'value1',
          asPrevStack: 'value0',
          asPercentStack: 'percent1',
          asPrevPercentStack: 'percent0'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'angleScale',
      type: 'linear',
      range: [-Math.PI, 0]
    },
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'name' },
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
      type: 'arc',
      from: { data: 'stack' },
      dependency: ['viewBox', 'angleScale', 'colorScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const angleScale = params.angleScale;
          const startAngle = angleScale.scale(datum.percent0);
          const maxR = Math.min(viewBox.width() / 2, viewBox.height());

          return {
            x: viewBox.x1 + viewBox.width() / 2,
            y: viewBox.y2,
            startAngle: startAngle,
            endAngle: angleScale.scale(datum.percent1),
            innerRadius: 100,
            outerRadius: maxR,
            fill: params.colorScale.scale(datum.name)
          };
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
