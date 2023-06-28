---
category: examples
group: hierarchy-sunburst
title: sunburst图
cover:
---

# sunburst 图

## 关键配置

## 代码演示

```javascript livedemo
VGrammarHierarchy.registerSunburstTransforms();

const flattenNodes = VGrammarHierarchy.flattenNodes;

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
          type: 'sunburst',
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
          innerRadius: ['15%', '37%', '67', '74%'],
          outerRadius: ['35%', '65%', '72%', '80%'],
          label: [
            {
              align: 'center',
              rotate: 'tangential'
            },
            { rotate: 'radial', align: 'end' },
            { rotate: 'radial', align: 'start', offset: 10 }
          ]
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
            flattenNodes(datum, res, { maxDepth: 2 });

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
            return !!datum.label;
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'colorScale',
      type: 'ordinal',
      dependency: ['flattenData'],
      domain: (scale, params) => {
        const data = params.flattenData;

        return (data || []).filter(d => d.depth <= 0).map(d => d.datum[0].name);
      },
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
          type: 'arc',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          dependency: ['colorScale'],
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y' },
              innerRadius: { field: 'innerRadius' },
              outerRadius: { field: 'outerRadius' },
              startAngle: { field: 'startAngle' },
              endAngle: { field: 'endAngle' },
              stroke: '#fff',
              fill: (datum, el, params) => {
                const scale = params.colorScale;

                return scale.scale(datum.datum[0].name);
              },
              fillOpacity: (datum, el, params) => {
                return 1 - 0.2 * datum.depth;
              }
            }
          }
        },

        {
          type: 'text',
          from: { data: 'textData' },
          key: 'flattenIndex',
          encode: {
            update: {
              x: { field: 'label.x' },
              y: { field: 'label.y' },
              textAlign: { field: 'label.textAlign' },
              textBaseline: { field: 'label.textBaseline' },
              text: datum => {
                return datum.datum[datum.datum.length - 1].name;
              },
              angle: { field: 'label.angle' },
              maxLineWidth: { field: 'label.maxLineWidth' },
              fill: '#666'
            }
          }
        }
      ]
    }
  ]
};

const vGrammarView = new VGrammarView({
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
