---
category: examples
group: basic-mark-arc
title: 饼图
cover:
---

# 饼图

## 代码演示

```javascript livedemo template=vgrammar
const spec = {
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
      id: 'pie',
      source: 'table',
      transform: [
        {
          type: 'pie',
          field: 'value',
          asStartAngle: 'startAngle',
          asEndAngle: 'endAngle'
        }
      ]
    }
  ],

  scales: [
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
      from: { data: 'pie' },
      dependency: ['viewBox', 'angleScale', 'colorScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const maxR = Math.min(viewBox.width() / 2, viewBox.height() / 2);

          return {
            x: viewBox.x1 + viewBox.width() / 2,
            y: viewBox.y1 + viewBox.height() / 2,
            startAngle: datum.startAngle,
            endAngle: datum.endAngle,
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
