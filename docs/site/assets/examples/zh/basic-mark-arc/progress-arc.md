---
category: examples
group: basic-mark-arc
title: 进度条
order: 3-1
cover: /vgrammar/preview/basic-mark-arc-progress-arc_0.6.5.png
---

# 进度条

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
          name: 'activity',
          target: 10000
        },
        {
          value: 30,
          name: 'sport',
          target: 60
        },
        {
          value: 50,
          name: 'stand',
          target: 100
        }
      ]
    },
    {
      id: 'percent',
      source: 'table',
      transform: [
        {
          type: 'map',
          callback: entry => {
            return entry.value / entry.target;
          },
          as: 'percent'
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
      range: [-Math.PI / 2, 1.5 * Math.PI],
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
      from: { data: 'percent' },
      dependency: ['viewBox', 'angleScale', 'radiusScale', 'colorScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const angleScale = params.angleScale;
          const range = angleScale.range();
          const radiusScale = params.radiusScale;
          const ir = radiusScale.scale(datum.name);
          const band = radiusScale.bandwidth();

          return {
            x: viewBox.x1 + viewBox.width() / 2,
            y: viewBox.y1 + viewBox.height() / 2,
            startAngle: range[0],
            endAngle: range[1],
            innerRadius: ir + band * 0.25,
            outerRadius: ir + band * 0.75,
            fill: '#f6f6f6'
          };
        }
      }
    },
    {
      type: 'arc',
      from: { data: 'percent' },
      dependency: ['viewBox', 'angleScale', 'radiusScale', 'colorScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const angleScale = params.angleScale;
          const radiusScale = params.radiusScale;
          const ir = radiusScale.scale(datum.name);
          const band = radiusScale.bandwidth();

          return {
            x: viewBox.x1 + viewBox.width() / 2,
            y: viewBox.y1 + viewBox.height() / 2,
            startAngle: angleScale.scale(0),
            endAngle: angleScale.scale(datum.percent),
            innerRadius: ir + band * 0.25,
            outerRadius: ir + band * 0.75,
            fill: params.colorScale.scale(datum.name)
          };
        },
        hover: {
          fill: 'red'
        }
      }
    },
    {
      type: 'text',
      from: { data: 'percent' },
      dependency: ['viewBox', 'angleScale', 'radiusScale', 'colorScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const cx = viewBox.x1 + viewBox.width() / 2;
          const cy = viewBox.y1 + viewBox.height() / 2;
          const angleScale = params.angleScale;
          const radiusScale = params.radiusScale;
          const angle = angleScale.scale(datum.percent);
          const r = radiusScale.scale(datum.name) + 0.5 * radiusScale.bandwidth();

          return {
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle),
            text: `${(datum.percent * 100).toFixed(2)}%`,
            textAlign: 'end',
            textBaseline: 'middle',
            fill: '#666'
          };
        }
      }
    },
    {
      type: 'text',
      from: { data: 'percent' },
      dependency: ['viewBox', 'angleScale', 'radiusScale', 'colorScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const cx = viewBox.x1 + viewBox.width() / 2;
          const cy = viewBox.y1 + viewBox.height() / 2;
          const angleScale = params.angleScale;
          const radiusScale = params.radiusScale;
          const angle = angleScale.scale(0);
          const r = radiusScale.scale(datum.name) + 0.5 * radiusScale.bandwidth();

          return {
            x: cx + r * Math.cos(angle) - 10,
            y: cy + r * Math.sin(angle),
            text: datum.name,
            textAlign: 'end',
            textBaseline: 'middle',
            fontWeight: 700,
            fill: params.colorScale.scale(datum.name)
          };
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
