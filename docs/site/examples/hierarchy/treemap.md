---
category: examples
group: hierarchy-sunburst
title: sunburst图
order: 70-3

cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vgrammar-hierarchy-treemap.png
---

# sunburst 图

## 代码演示

```javascript livedemo template=vgrammar
VGrammarHierarchy.registerTreemapTransforms();

const flattenNodes = VGrammarHierarchy.flattenNodes;
// const ColorUtil = VisUtil.ColorUtil;

const spec = {
  padding: { top: 30, right: 5, bottom: 30, left: 5 },

  data: [
    {
      id: 'table',
      values: [
        {
          name: '品牌 A',
          children: [
            {
              name: '东北',
              children: [
                {
                  name: '办公用品',
                  value: 824
                },
                {
                  name: '家具',
                  value: 920
                },
                {
                  name: '电子设备',
                  value: 936
                }
              ]
            },
            {
              name: '中南',
              children: [
                {
                  name: '办公用品',
                  value: 1270
                },
                {
                  name: '家具',
                  value: 1399
                },
                {
                  name: '电子设备',
                  value: 1466
                }
              ]
            },
            {
              name: '华东',
              children: [
                {
                  name: '办公用品',
                  value: 1408
                },
                {
                  name: '家具',
                  value: 1676
                },
                {
                  name: '电子设备',
                  value: 1559
                }
              ]
            },
            {
              name: '华北',
              children: [
                {
                  name: '办公用品',
                  value: 745
                },
                {
                  name: '家具',
                  value: 919
                },
                {
                  name: '电子设备',
                  value: 781
                }
              ]
            },
            {
              name: '西北',
              children: [
                {
                  name: '办公用品',
                  value: 267
                },
                {
                  name: '家具',
                  value: 316
                },
                {
                  name: '电子设备',
                  value: 230
                }
              ]
            },
            {
              name: '西南',
              children: [
                {
                  name: '办公用品',
                  value: 347
                },
                {
                  name: '家具',
                  value: 501
                },
                {
                  name: '电子设备',
                  value: 453
                }
              ]
            }
          ]
        },
        {
          name: '品牌 B',
          children: [
            {
              name: '东北',
              children: [
                {
                  name: '办公用品',
                  value: 824
                },
                {
                  name: '家具',
                  value: 920
                },
                {
                  name: '电子设备',
                  value: 936
                }
              ]
            },
            {
              name: '中南',
              children: [
                {
                  name: '办公用品',
                  value: 1270
                },
                {
                  name: '家具',
                  value: 1399
                },
                {
                  name: '电子设备',
                  value: 1466
                }
              ]
            },
            {
              name: '华东',
              children: [
                {
                  name: '办公用品',
                  value: 1408
                },
                {
                  name: '家具',
                  value: 1676
                },
                {
                  name: '电子设备',
                  value: 1559
                }
              ]
            },
            {
              name: '华北',
              children: [
                {
                  name: '办公用品',
                  value: 745
                },
                {
                  name: '家具',
                  value: 919
                },
                {
                  name: '电子设备',
                  value: 781
                }
              ]
            },
            {
              name: '西北',
              children: [
                {
                  name: '办公用品',
                  value: 267
                },
                {
                  name: '家具',
                  value: 316
                },
                {
                  name: '电子设备',
                  value: 230
                }
              ]
            },
            {
              name: '西南',
              children: [
                {
                  name: '办公用品',
                  value: 347
                },
                {
                  name: '家具',
                  value: 501
                },
                {
                  name: '电子设备',
                  value: 453
                }
              ]
            }
          ]
        },
        {
          name: '品牌 C',
          children: [
            {
              name: '东北',
              children: [
                {
                  name: '办公用品',
                  value: 824
                },
                {
                  name: '家具',
                  value: 920
                },
                {
                  name: '电子设备',
                  value: 936
                }
              ]
            },
            {
              name: '中南',
              children: [
                {
                  name: '办公用品',
                  value: 1270
                },
                {
                  name: '家具',
                  value: 1399
                },
                {
                  name: '电子设备',
                  value: 1466
                }
              ]
            },
            {
              name: '华东',
              children: [
                {
                  name: '办公用品',
                  value: 1408
                },
                {
                  name: '家具',
                  value: 1676
                },
                {
                  name: '电子设备',
                  value: 1559
                }
              ]
            },
            {
              name: '华北',
              children: [
                {
                  name: '办公用品',
                  value: 745
                },
                {
                  name: '家具',
                  value: 919
                },
                {
                  name: '电子设备',
                  value: 781
                }
              ]
            },
            {
              name: '西北',
              children: [
                {
                  name: '办公用品',
                  value: 267
                },
                {
                  name: '家具',
                  value: 316
                },
                {
                  name: '电子设备',
                  value: 230
                }
              ]
            },
            {
              name: '西南',
              children: [
                {
                  name: '办公用品',
                  value: 347
                },
                {
                  name: '家具',
                  value: 501
                },
                {
                  name: '电子设备',
                  value: 453
                }
              ]
            }
          ]
        }
      ],
      transform: [
        {
          type: 'treemap',
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
          padding: 4,
          gapWidth: 2,
          labelPadding: 20
        }
      ]
    },
    {
      id: 'flattenData',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: datum => {
            const res = [];
            flattenNodes(datum, res);

            return res;
          }
        }
      ]
    },
    {
      id: 'textData',
      source: 'flattenData',
      transform: [
        {
          type: 'filter',
          callback: datum => {
            return !!datum.labelRect;
          }
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
      type: 'group',
      dependency: ['viewBox'],
      encode: {
        update: (datum, el, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1
          };
        }
      },

      marks: [
        {
          type: 'rect',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          dependency: ['colorScale'],
          encode: {
            update: {
              x: { field: 'x0' },
              x1: { field: 'x1' },
              y: { field: 'y0' },
              y1: { field: 'y1' },
              fill: (datum, el, params) => {
                const color = params.colorScale.scale(datum.datum[0].name);

                // const rgb = new ColorUtil.Color(color).color;
                // const hsl = ColorUtil.rgbToHsl(rgb.r, rgb.g, rgb.b);

                // return new ColorUtil.Color(`hsl(${hsl.h}, ${hsl.s}, ${40 + datum.depth * 10})`).toString();

                return color;
              },
              fillOpacity: (datum, el, params) => {
                return 0.2 + 0.2 * datum.depth;
              }
            }
          }
        },

        {
          type: 'text',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          encode: {
            update: {
              x: datum => {
                if (datum.labelRect) {
                  return (datum.labelRect.x0 + datum.labelRect.x1) / 2;
                }
                return (datum.x0 + datum.x1) / 2;
              },
              y: datum => {
                if (datum.labelRect) {
                  return (datum.labelRect.y0 + datum.labelRect.y1) / 2;
                }
                return (datum.y0 + datum.y1) / 2;
              },
              text: datum => {
                return datum.datum[datum.datum.length - 1].name;
              },
              maxLineWidth: datum => {
                return Math.abs(datum.x1 - datum.x0);
              },
              fill: 'black',
              textAlign: 'center',
              textBaseline: 'middle'
            }
          }
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
