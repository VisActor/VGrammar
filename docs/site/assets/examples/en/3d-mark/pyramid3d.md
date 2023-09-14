---
category: examples
group: 3d-mark
title: pyramid3d Primitive
order: 40-2
cover: /vgrammar/preview/3d-mark-pyramid3d_0.6.5.png
---

# pyramid3d Primitive

Trapezoid primitive in 3d mode, mainly used for displaying 3d funnel charts.

## Code Demo

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          value: 100,
          name: 'Step1'
        },
        {
          value: 80,
          name: 'Step2'
        },
        {
          value: 60,
          name: 'Step3'
        },
        {
          value: 40,
          name: 'Step4'
        },
        {
          value: 20,
          name: 'Step5'
        }
      ],
      transform: [
        {
          type: 'funnel',
          field: 'value',
          isCone: false,
          asValueRatio: 'valueRatio',
          asNextValueRatio: 'nextValueRatio'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'lengthScale',
      type: 'linear',
      domain: [0, 1],
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      zero: true,
      nice: true
    },
    {
      id: 'heightScale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      },
      round: true
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
      type: 'pyramid3d',
      from: { data: 'table' },
      encode: {
        update: (datum, element, params) => {
          const currentLength = params.lengthScale.scale(datum.valueRatio);
          const nextLength = params.lengthScale.scale(datum.nextValueRatio);
          const height = params.heightScale.bandwidth();
          const currentX = params.viewBox.x1 + params.viewBox.width() / 2 - currentLength / 2;
          const currentX1 = params.viewBox.x1 + params.viewBox.width() / 2 + currentLength / 2;
          const nextX = params.viewBox.x1 + params.viewBox.width() / 2 - nextLength / 2;
          const nextX1 = params.viewBox.x1 + params.viewBox.width() / 2 + nextLength / 2;
          const y = params.heightScale.scale(datum.name);
          const y1 = y + height;

          const points = [
            { x: currentX, y: y },
            { x: currentX1, y: y },
            { x: nextX1, y: y1 },
            { x: nextX, y: y1 }
          ];

          const maxLength = params.lengthScale.scale(1);
          const deltaZ = (maxLength - currentLength) / 2;

          return {
            fill: params.colorScale.scale(datum.name),
            points: points,
            z: deltaZ
          };
        }
      },
      dependency: ['viewBox', 'lengthScale', 'heightScale', 'colorScale']
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  options3d: {
    enable: true,
    alpha: -0.5,
    beta: 0.2,
    // center: { x: 800, y: 400 },
    enableView3dTranform: true
  },
  disableDirtyBounds: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## Related Tutorials
