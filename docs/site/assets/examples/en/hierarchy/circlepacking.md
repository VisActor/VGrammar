---
category: examples
group: hierarchy-circlePacking
title: Circle Packing Chart
order: 70-0
cover: /vgrammar/preview/hierarchy-circlepacking_0.7.6.png
---

# Circle Packing Chart

## Code Demonstration

```javascript livedemo template=vgrammar
VGrammarHierarchy.registerCirclePackingTransforms();

const flattenNodes = VGrammarHierarchy.flattenNodes;

const spec = {
  padding: { top: 30, right: 5, bottom: 30, left: 5 },

  data: [
    {
      id: 'table',
      values: [
        {
          name: 'root',
          children: [
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
          ]
        }
      ],
      transform: [
        {
          type: 'circlePacking',
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
          padding: [10, 5, 0],
          includeRoot: false
        }
      ]
    },
    {
      id: 'circleData',
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
    }
  ],

  scales: [
    {
      id: 'colorScale',
      type: 'ordinal',
      dependency: ['circleData'],
      domain: (scale, params) => {
        const data = params.circleData;

        return (data || []).filter(d => d.depth <= 1).map(d => d.key);
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
          type: 'circle',
          from: { data: 'circleData' },
          key: 'flattenIndex',
          dependency: ['colorScale'],
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y' },
              radius: { field: 'radius' },
              stroke: '#fff',
              fill: (datum, el, params) => {
                const scale = params.colorScale;

                return datum.depth <= 1 ? scale.scale(datum.key) : scale.scale(datum.parentKey);
              },
              fillOpacity: (datum, el, params) => {
                return 0.2 + 0.2 * datum.depth;
              }
            }
          }
        },

        {
          type: 'text',
          from: { data: 'circleData' },
          key: 'flattenIndex',
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y' },
              textAlign: 'center',
              textBaseline: 'middle',
              text: datum => {
                if (datum.depth <= 1) {
                  return '';
                } else {
                  return datum.datum[datum.datum.length - 1].name;
                }
              },
              maxLineWidth: datum => {
                return datum.radius * 2;
              },
              fill: '#333'
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

## Related Tutorials
