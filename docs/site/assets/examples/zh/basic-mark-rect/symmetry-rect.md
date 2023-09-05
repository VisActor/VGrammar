---
category: examples
group: symmetry rect
title: 对称矩形
order: 0-7
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vgrammar/basic-mark-rect-basic-rect.png
---

# 对称矩形

## 代码演示

```javascript livedemo template=vgrammar
const spec = {
  data: [
    {
      id: 'table',
      values: [
        {
          name: 'Apple',
          value: 214480
        },
        {
          name: 'Google',
          value: 155506
        },
        {
          name: 'Amazon',
          value: 100764
        },
        {
          name: 'Microsoft',
          value: 92715
        },
        {
          name: 'Coca-Cola',
          value: 66341
        },
        {
          name: 'Samsung',
          value: 59890
        },
        {
          name: 'Toyota',
          value: 53404
        },
        {
          name: 'Mercedes-Benz',
          value: 48601
        },
        {
          name: 'Facebook',
          value: 45168
        },
        {
          name: "McDonald's",
          value: 43417
        },
        {
          name: 'Intel',
          value: 43293
        },
        {
          name: 'IBM',
          value: 42972
        },
        {
          name: 'BMW',
          value: 41006
        },
        {
          name: 'Disney',
          value: 39874
        },
        {
          name: 'Cisco',
          value: 34575
        },
        {
          name: 'GE',
          value: 32757
        },
        {
          name: 'Nike',
          value: 30120
        },
        {
          name: 'Louis Vuitton',
          value: 28152
        },
        {
          name: 'Oracle',
          value: 26133
        },
        {
          name: 'Honda',
          value: 23682
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      nice: true
    },
    {
      id: 'yscale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      padding: 0.05,
      round: true
    }
  ],

  marks: [
    {
      type: 'group',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            width: params.viewBox.width(),
            height: params.viewBox.height()
          };
        }
      },

      marks: [
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'xscale',
          crosshairShape: 'rect',
          crosshairType: 'y'
        },
        {
          type: 'rect',
          id: 'rect',
          from: { data: 'table' },
          dependency: ['xscale'],
          encode: {
            update: {
              x1: { scale: 'xscale', field: 'value' },
              x: (datum, element, params) => {
                return params.xscale.scale(params.xscale.domain()[0]);
              },
              y: { scale: 'yscale', field: 'name', band: 0.2 },
              height: { scale: 'yscale', band: 0.6 },
              fill: '#6690F2'
            },
            hover: {
              fill: 'red'
            }
          },
          transform: [{ type: 'symmetry', channel: 'x' }]
        },
        {
          type: 'component',
          componentType: 'label',
          target: 'rect',
          labelStyle: {
            position: 'inside',
            smartInvert: true
          },

          encode: {
            update: {
              text: datum => `${datum.name}: ${datum.value}`
            }
          }
        },
        {
          type: 'component',
          componentType: 'tooltip',
          target: 'rect',
          title: { visible: false, value: 'value' },
          content: [
            {
              key: { field: 'name' },
              value: { field: 'value' },
              symbol: {
                symbolType: 'circle',
                fill: '#6690F2'
              }
            }
          ]
        }
      ]
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
