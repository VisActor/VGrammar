---
category: examples
group: 3d-mark
title: 3d arc 图元
order: 40-1
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vgrammar/3d-mark-arc3d.png
---

# 3d arc 图元

3d 模式下的 arc 图元，可以用于展示 3D 饼图，3D 玫瑰图等

## 代码演示

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          value: 335,
          name: '直接访问'
        },
        {
          value: 310,
          name: '邮件营销'
        },
        {
          value: 274,
          name: '联盟广告'
        },
        {
          value: 123,
          name: '搜索引擎'
        },
        {
          value: 215,
          name: '视频广告'
        }
      ],
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
      domain: { data: 'table', field: 'test' },
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
      type: 'arc3d',
      from: { data: 'table' },
      encode: {
        update: {
          x: (datum, element, params) => params.viewBox.x1 + params.viewBox.width() / 2,
          y: (datum, element, params) => params.viewBox.y1 + params.viewBox.height() / 2,
          outerRadius: 150,
          startAngle: { field: 'startAngle' },
          endAngle: { field: 'endAngle' },
          height: 20,
          fill: { scale: 'colorScale', field: 'name' }
        },
        hover: {
          fill: 'red'
        }
      },
      animation: {
        enter: {
          type: 'growAngleIn',
          options: { overall: true },
          duration: 2000
        },
        state: {
          duration: 500
        }
      },
      dependency: ['viewBox']
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  options3d: {
    enable: true,
    alpha: 0,
    beta: -0.85
    // center: { x: 800, y: 400 }
    // enableView3dTranform: true
  },
  disableDirtyBounds: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 相关教程
