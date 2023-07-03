---
category: examples
group: basic-mark-rect
title: 双向条形图
order: 0-2
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vgrammar-basic-mark-rect-bi-direction-rect.png
---

# 双向条形图

## 代码演示

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 30, right: 5, bottom: 30, left: 5 },

  data: [
    {
      id: 'table',
      values: [
        {
          sales: 'Jack',
          2020: 324,
          2021: 420
        },
        {
          sales: 'Marry',
          2020: 240,
          2021: 321
        },
        {
          sales: 'Tom',
          2020: 601,
          2021: 561
        },
        {
          sales: 'Lily',
          2020: 320,
          2021: 287
        },
        {
          sales: 'Lucy',
          2020: 629,
          2021: 400
        },
        {
          sales: 'Nancy',
          2020: 320,
          2021: 312
        },
        {
          sales: 'Ada',
          2020: 420,
          2021: 312
        },
        {
          sales: 'Bill',
          2020: 563,
          2021: 890
        },
        {
          sales: 'Maggie',
          2020: 223,
          2021: 444
        }
      ]
    }
  ],

  scales: [
    {
      id: 'yScale',
      type: 'band',
      domain: { data: 'table', field: 'sales' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'leftScale',
      type: 'linear',
      domain: { data: 'table', field: ['2020', '2021'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.width() / 2, 0];
      },
      zero: true
    },
    {
      id: 'rightScale',
      type: 'linear',
      domain: { data: 'table', field: ['2020', '2021'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width() / 2];
      },
      zero: true
    },
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: ['2020', '2021'],
      range: ['#6690F2', '#70D6A3']
    }
  ],

  marks: [
    {
      type: 'group',
      id: 'left',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            width: params.viewBox.width() / 2,
            height: params.viewBox.height()
          };
        }
      },

      marks: [
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'yScale',
          crosshairShape: 'rect',
          crosshairType: 'y',
          dependency: ['viewBox']
        },
        {
          type: 'component',
          componentType: 'axis',
          scale: 'leftScale',
          tickCount: 5,
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: params.viewBox.height(),
                start: { x: params.viewBox.width() / 2, y: 0 },
                end: { x: 0, y: 0 },
                verticalFactor: -1
              };
            }
          }
        },
        {
          type: 'rect',
          id: 'leftRect',
          from: { data: 'table' },
          encode: {
            update: {
              x: { scale: 'leftScale', field: '2020' },
              x1: { scale: 'leftScale', value: 0 },
              y: { scale: 'yScale', field: 'sales', band: 0.25 },
              height: { scale: 'yScale', band: 0.5 },
              fill: '#6690F2'
            },
            hover: {
              fill: 'red'
            }
          }
        },
        {
          type: 'component',
          componentType: 'tooltip',
          target: 'leftRect',
          title: { value: '2020' },
          content: [
            {
              key: { field: 'sales' },
              value: { field: '2020' },
              symbol: {
                symbolType: 'square',
                fill: '#6690F2'
              }
            }
          ]
        }
      ]
    },

    {
      type: 'group',
      id: 'right',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: (params.viewBox.x1 + params.viewBox.x2) / 2,
            y: params.viewBox.y1,
            width: params.viewBox.width() / 2,
            height: params.viewBox.height()
          };
        }
      },

      marks: [
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'yScale',
          crosshairShape: 'rect',
          crosshairType: 'y',
          dependency: ['viewBox']
        },
        {
          type: 'component',
          componentType: 'axis',
          scale: 'rightScale',
          tickCount: 5,
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: params.viewBox.height(),
                start: { x: 0, y: 0 },
                end: { x: params.viewBox.width() / 2, y: 0 }
              };
            }
          }
        },
        {
          type: 'rect',
          id: 'rightRect',
          from: { data: 'table' },
          encode: {
            update: {
              x: { scale: 'rightScale', field: '2021' },
              x1: { scale: 'rightScale', value: 0 },
              y: { scale: 'yScale', field: 'sales', band: 0.25 },
              height: { scale: 'yScale', band: 0.5 },
              fill: '#70D6A3'
            },
            hover: {
              fill: 'red'
            }
          }
        },
        {
          type: 'component',
          componentType: 'tooltip',
          target: 'rightRect',
          title: { value: '2021' },
          content: [
            {
              key: { field: 'sales' },
              value: { field: '2021' },
              symbol: {
                symbolType: 'square',
                fill: '#70D6A3'
              }
            }
          ]
        }
      ]
    },

    {
      type: 'component',
      componentType: 'axis',
      scale: 'yScale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: (params.viewBox.x1 + params.viewBox.x2) / 2,
            y: params.viewBox.y1,
            start: { x: 0, y: params.viewBox.height() },
            end: { x: 0, y: 0 },
            line: { visible: false },
            tick: { style: { strokeOpacity: 0 } },
            label: {
              space: 0,
              style: {
                textAlign: 'center',
                dy: -params.yScale.bandwidth() / 2
              }
            }
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'legend',
      dependency: ['viewBox'],

      encode: {
        update: (scale, elment, params) => {
          return {
            x: (params.viewBox.x1 + params.viewBox.x2) / 2 - 50,
            layout: 'horizontal',
            select: false,
            items: [
              {
                label: '2020',
                id: '2020',
                shape: { symbolType: 'square', fillColor: '#6690F2', strokeColor: '#6690F2' }
              },
              {
                label: '2021',
                id: '2021',
                shape: { symbolType: 'square', fillColor: '#70D6A3', strokeColor: '#70D6A3' }
              }
            ]
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
