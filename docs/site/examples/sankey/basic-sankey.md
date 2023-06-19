---
category: examples
group: sankey
title: sankey图
cover:
---

# sankey 图

## 关键配置

## 代码演示

```ts
VGrammarSankey.registerSankeyTransforms();
VGrammar.registerLinkPathGlyph();

const flattenNodes = VGrammarHierarchy.flattenNodes;
const flattenTreeLinks = VGrammarHierarchy.flattenTreeLinks;

const spec = {
  padding: { top: 30, right: 10, bottom: 80, left: 10 },

  data: [
    {
      id: 'table',
      values: {
        nodes: [
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
      },
      transform: [
        {
          type: 'sankey',
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
          nodeKey: datum => datum.name
        }
      ]
    },

    {
      id: 'nodes',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: datum => {
            return datum[0].nodes;
          }
        }
      ]
    },
    {
      id: 'links',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: datum => {
            return datum[0].links;
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'colorScale',
      type: 'ordinal',

      domain: { data: 'nodes', field: 'key' },
      range: colorSchemeForDark
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
          id: 'sankeyNode',
          from: { data: 'nodes' },
          key: 'key',
          encode: {
            update: {
              x: { field: 'x0' },
              x1: { field: 'x1' },
              y: { field: 'y0' },
              y1: { field: 'y1' },
              fill: { scale: 'colorScale', field: 'key' }
            },
            blur: {
              fillOpacity: 0.2
            }
          },
          animationState: 'appear',
          animation: {
            appear: {
              type: 'clipIn',
              options: { clipDimension: 'y' },
              duration: 1000
            },
            enter: {
              type: 'clipIn',
              options: { clipDimension: 'y' },
              duration: 1000
            },
            exit: {
              type: 'fadeOut',
              duration: 1000,
              controlOptions: {
                stopWhenStateChange: true
              }
            }
          }
        },

        {
          type: 'glyph',
          id: 'sankeyLink',
          glyphType: 'linkPath',
          from: { data: 'links' },
          key: 'index',
          dependency: ['colorScale'],

          encode: {
            update: (datum, el, params) => {
              const sourceFill = params.colorScale.scale(datum.source);
              const targetFill = params.colorScale.scale(datum.target);

              return {
                direction: datum.vertical ? 'vertical' : 'horizontal',
                x0: datum.x0,
                x1: datum.x1,
                y0: datum.y0,
                y1: datum.y1,
                thickness: datum.thickness,
                fill: {
                  gradient: 'linear',
                  x0: 0,
                  y0: 0.5,
                  x1: 1,
                  y1: 0.5,
                  stops: [
                    {
                      offset: 0,
                      color: sourceFill
                    },
                    {
                      offset: 1,
                      color: targetFill
                    }
                  ]
                },
                backgroundStyle: { fillColor: '#ccc', fillOpacity: 0.2 },
                fillOpacity: 0.3,
                round: true
              };
            },
            hover: {
              stroke: '#000'
            },
            blur: {
              fill: '#e8e8e8'
            }
          }
        }
      ]
    }
  ]
};

const vGrammarView = new VGrammarView({
  autoFit: true,
  container: CHART_CONTAINER_DOM_ID,
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 相关教程
