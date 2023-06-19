---
category: examples
group: basic-mark-arc
title: 饼图
cover:
---

# 基础柱图

## 关键配置

- `direction` 属性配置为 'horizontal'
- `xField` 属性声明为数值字段
- `yField` 属性声明为分类字段

## 代码演示

```ts
const spec = {
  width: 1600,
  height: 400,
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
    }
  ],

  scales: [
    {
      id: 'radiusScale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
      range: (scale, params) => {
        const maxRadius = Math.min(params.viewBox.width(), params.viewBox.height()) / 2;
        return [maxRadius * 0.2, maxRadius * 0.8];
      },
      dependency: ['viewBox'],
      padding: 0.05,
      round: true
    },
    {
      id: 'angleScale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      range: [-Math.PI / 2, Math.PI],
      zero: true
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
      from: { data: 'table' },
      dependency: ['viewBox', 'angleScale', 'radiusScale', 'colorScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const angleScale = params.angleScale;
          const radiusScale = params.radiusScale;
          const ir = radiusScale.scale(datum.name);

          return {
            x: viewBox.x1 + viewBox.width() / 2,
            y: viewBox.y1 + viewBox.height() / 2,
            startAngle: angleScale.scale(0),
            endAngle: angleScale.scale(datum.value),
            innerRadius: ir,
            outerRadius: ir + radiusScale.bandwidth(),
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

const vGrammarView = new VGrammarView({
  width: spec.width,
  height: spec.height,
  container: CHART_CONTAINER_DOM_ID,
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 相关教程

[柱状图](link)
