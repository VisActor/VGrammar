# Charts

In addition to the core VGrammar package, VGrammar also provides some optional extension packages to support additional charting capabilities:

- VGrammar-hierarchy: Provides a partial hierarchy of chart transform encapsulation, such as sunburst charts, etc.;
- VGrammar-sankey: Provides the Sankey chart's transform encapsulation;
- VGrammar-wordcloud: Provides the Wordcloud chart's transform encapsulation;
- VGrammar-wordcloud-shape: Provides the Shape Wordcloud chart's transform encapsulation.

Developers can use the transforms provided by these extension packages to quickly create various common charts, such as Sankey charts, Wordclouds, etc.

## Hierarchical Charts

Hierarchical charts are a type of chart that uses hierarchical nodes at its core to organize data into layers according to classification hierarchy relationships. Hierarchical charts help us better understand the relationships and hierarchical structures between data.

Through the vgrammar-hierarchy package, VGrammar currently provides four hierarchical charts: Circle-packing charts, Sunburst charts, Tree charts, and Treemap charts.

### Circle-packing Charts

Circle-packing charts are a type of chart that presents multi-level hierarchical relationships by nesting concentric circles. The size of the data layers is usually represented by the size of each circle, and the hierarchical relationship is represented by the containment relationship between concentric circles. Circle-packing charts are suitable for showing the size comparison and hierarchical relationship distribution of multi-level structured data in the same domain, such as global population distribution of countries and regions, and sales performance of company business departments.

Developers can call the `registerCirclePackingTransforms()` or `registerAllHierarchyTransforms()` methods provided by vgrammar-hierarchy to register the `circlePacking` transform.

The `circlePacking` transform calculates the layout information of the circle-packing chart based on the user's input data and stores the layout results in data fields such as x and y. Developers can then flatten the hierarchical data after calculating the layout using the `flattenNodes` method and apply it to the data mapping declaration of the circle mark.

Here is a simple transform usage example:

```js
{
  type: 'circlePacking',
  width: { signal: 'viewWidth' },
  height: { signal: 'viewHeight' },
  padding: [10, 5, 0],
  includeRoot: false
}
```

<div class="examples-ref-container" id="examples-ref-circlepacking" data-path="hierarchy/circlepacking">
</div>

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

### Sunburst Charts

Sunburst charts are a type of chart that displays multi-level data relationships in a ring-shaped structure. Each sector of a sunburst chart represents a hierarchical node, with the center being the root node and the outer layers representing the leaf nodes. The sector size usually represents node weight or other relative importance values. Sunburst charts are suitable for displaying complex hierarchical data relationships and comparing weights, such as file system storage allocation, and employee proportions within organizational structures.

Developers can call the `registerSunburstTransforms()` or `registerAllHierarchyTransforms()` methods provided by vgrammar-hierarchy to register the `sunburst` transform.

The `sunburst` transform calculates layout information for sunburst charts based on the user's input data and stores the layout results in data fields such as x, y, innerRadius, outerRadius, etc. Developers can then flatten the hierarchical data after calculating the layout using the `flattenNodes` method and apply it to the data mapping declaration of the mark.

Here is a simple transform usage example:

```js
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
```

<div class="examples-ref-container" id="examples-ref-sunburst" data-path="hierarchy/sunburst">
</div>

```javascript livedemo template=vgrammar
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

```javascript livedemo template=vgrammar
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

```javascript livedemo template=vgrammar
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

### Tree Charts

Tree charts are a type of chart that uses connecting lines to link tree-structured hierarchical nodes. Tree charts start from the root node and branch out along the connecting lines until the leaf nodes, forming a complete hierarchical relationship diagram. Tree charts are suitable for displaying hierarchical relationships with clear boundaries and limited depths, such as company organizational structures and regional divisions.

Developers can call the `registerTreeTransforms()` or `registerAllHierarchyTransforms()` methods provided by vgrammar-hierarchy to register the `tree` transform.

The `tree` transform calculates layout information for tree charts based on user input data and stores the layout results in data fields such as x and y, etc. Developers can then flatten the hierarchical data after calculating the layout using the `flattenNodes` method and apply it to the data mapping declaration of the mark.

Here is a simple transform usage example:

```js
{
  type: 'tree',
  width: { signal: 'viewWidth' },
  height: { signal: 'viewHeight' },
  alignType: 'leaf',
  direction: 'vertical'
}
```

<div class="examples-ref-container" id="examples-ref-tree" data-path="hierarchy/tree">
</div>

```javascript livedemo template=vgrammar
VGrammarHierarchy.registerTreeTransforms();
VGrammar.registerTreePathGlyph();

const flattenNodes = VGrammarHierarchy.flattenNodes;
const flattenTreeLinks = VGrammarHierarchy.flattenTreeLinks;

const spec = {
  padding: { top: 30, right: 10, bottom: 80, left: 10 },

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
          type: 'tree',
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
          alignType: 'leaf',
          direction: 'vertical'
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
      id: 'pathData',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: datum => {
            const res = [];
            flattenTreeLinks(datum, res);
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
      dependency: ['flattenData'],
      domain: (scale, params) => {
        const data = params.flattenData;

        return (data || []).map(d => d.datum[d.datum.length - 1].name);
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
          type: 'glyph',
          glyphType: 'treePath',
          from: { data: 'pathData' },
          key: 'key',
          encode: {
            update: {
              direction: 'vertical',
              // pathType: 'line',
              x0: { field: 'x0' },
              x1: { field: 'x1' },
              y0: { field: 'y0' },
              y1: { field: 'y1' },
              thickness: 1,
              lineWidth: 1,
              // round: true,
              stroke: '#333'
            }
          }
        },

        {
          type: 'circle',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          dependency: ['colorScale'],
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y' },
              radius: 10,
              lineWidth: datum => {
                return datum.depth % 2 ? 1 : 2;
              },
              stroke: '#fff',
              fill: (datum, el, params) => {
                const scale = params.colorScale;

                return scale.scale(datum.datum[datum.datum.length - 1].name);
              }
            }
          }
        },

        {
          type: 'text',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          dependency: ['colorScale'],
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y', offset: 10 },
              textAlign: datum => {
                return datum.depth === 0 || datum.isLeaf ? 'start' : 'center';
              },
              textBaseline: 'middle',
              text: datum => {
                return datum.datum[datum.datum.length - 1].name;
              },
              angle: datum => {
                return datum.isLeaf ? Math.PI / 2 : 0;
              },
              maxLineWidth: datum => {
                return 200;
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

```javascript livedemo template=vgrammar
VGrammarHierarchy.registerTreeTransforms();
VGrammar.registerTreePathGlyph();

const flattenNodes = VGrammarHierarchy.flattenNodes;
const flattenTreeLinks = VGrammarHierarchy.flattenTreeLinks;

const spec = {
  padding: { top: 30, right: 10, bottom: 80, left: 10 },

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
          type: 'tree',
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
          alignType: 'leaf',
          direction: 'vertical'
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
      id: 'pathData',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: datum => {
            const res = [];
            flattenTreeLinks(datum, res);
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
      dependency: ['flattenData'],
      domain: (scale, params) => {
        const data = params.flattenData;

        return (data || []).map(d => d.datum[d.datum.length - 1].name);
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
          type: 'glyph',
          glyphType: 'treePath',
          from: { data: 'pathData' },
          key: 'key',
          encode: {
            update: {
              direction: 'vertical',
              // pathType: 'line',
              x0: { field: 'x0' },
              x1: { field: 'x1' },
              y0: { field: 'y0' },
              y1: { field: 'y1' },
              thickness: 1,
              lineWidth: 1,
              // round: true,
              stroke: '#333'
            }
          }
        },

        {
          type: 'circle',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          dependency: ['colorScale'],
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y' },
              radius: 10,
              lineWidth: datum => {
                return datum.depth % 2 ? 1 : 2;
              },
              stroke: '#fff',
              fill: (datum, el, params) => {
                const scale = params.colorScale;

                return scale.scale(datum.datum[datum.datum.length - 1].name);
              }
            }
          }
        },

        {
          type: 'text',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          dependency: ['colorScale'],
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y', offset: 10 },
              textAlign: datum => {
                return datum.depth === 0 || datum.isLeaf ? 'start' : 'center';
              },
              textBaseline: 'middle',
              text: datum => {
                return datum.datum[datum.datum.length - 1].name;
              },
              angle: datum => {
                return datum.isLeaf ? Math.PI / 2 : 0;
              },
              maxLineWidth: datum => {
                return 200;
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

```javascript livedemo template=vgrammar
VGrammarHierarchy.registerTreeTransforms();
VGrammar.registerTreePathGlyph();

const flattenNodes = VGrammarHierarchy.flattenNodes;
const flattenTreeLinks = VGrammarHierarchy.flattenTreeLinks;

const spec = {
  padding: { top: 30, right: 10, bottom: 80, left: 10 },

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
          type: 'tree',
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
          alignType: 'leaf',
          direction: 'vertical'
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
      id: 'pathData',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: datum => {
            const res = [];
            flattenTreeLinks(datum, res);
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
      dependency: ['flattenData'],
      domain: (scale, params) => {
        const data = params.flattenData;

        return (data || []).map(d => d.datum[d.datum.length - 1].name);
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
          type: 'glyph',
          glyphType: 'treePath',
          from: { data: 'pathData' },
          key: 'key',
          encode: {
            update: {
              direction: 'vertical',
              // pathType: 'line',
              x0: { field: 'x0' },
              x1: { field: 'x1' },
              y0: { field: 'y0' },
              y1: { field: 'y1' },
              thickness: 1,
              lineWidth: 1,
              // round: true,
              stroke: '#333'
            }
          }
        },

        {
          type: 'circle',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          dependency: ['colorScale'],
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y' },
              radius: 10,
              lineWidth: datum => {
                return datum.depth % 2 ? 1 : 2;
              },
              stroke: '#fff',
              fill: (datum, el, params) => {
                const scale = params.colorScale;

                return scale.scale(datum.datum[datum.datum.length - 1].name);
              }
            }
          }
        },

        {
          type: 'text',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          dependency: ['colorScale'],
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y', offset: 10 },
              textAlign: datum => {
                return datum.depth === 0 || datum.isLeaf ? 'start' : 'center';
              },
              textBaseline: 'middle',
              text: datum => {
                return datum.datum[datum.datum.length - 1].name;
              },
              angle: datum => {
                return datum.isLeaf ? Math.PI / 2 : 0;
              },
              maxLineWidth: datum => {
                return 200;
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

### Treemap Charts

Treemap charts are a type of chart that segments hierarchical data into nested rectangles. The area of the rectangles represents node weight or other relative importance values, and the nesting relationship represents hierarchical structure. Treemap charts are suitable for displaying hierarchical relationships with relative weight differences, such as disk space usage and sales data.

Developers can call the `registerSunburstTransforms()` or `registerAllHierarchyTransforms()` methods provided by vgrammar-hierarchy to register the `sunburst` transform.

The `sunburst` transform calculates layout information for sunburst charts based on user input data and stores the layout results in data fields such as x, y, innerRadius, outerRadius, etc. Developers can then flatten the hierarchical data after calculating the layout using the `flattenNodes` method and apply it to the data mapping declaration of the mark.

Here is a simple transform usage example:

<div class="examples-ref-container" id="examples-ref-treemap" data-path="hierarchy/treemap">
</div>

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

## Sankey Charts

Sankey charts are a type of chart used to represent the flow transfer relationship between nodes. The nodes in a Sankey chart represent data entities, and the flow size is usually represented by the width of the connecting lines. Sankey charts are suitable for displaying flow transfer situations between multiple independent nodes, such as energy flow analysis and website visit paths.

### Installation

To implement a Sankey chart, you need to install the npm package `@visactor/vgrammar-sankey`:

```sh
npm add --save @visactor/vgrammar-sankey
```

### Registering Transform

When using it, you need to first call `registerSankeyTransforms` to register the corresponding transform for the Sankey layout algorithm; Meanwhile, VGrammar's main package provides the `linkPath` composite glyph for displaying links in the Sankey chart;

```js
import { registerSankeyTransforms } from '@visactor/vgrammar-sankey';
import { registerLinkPathGlyph } from '@visactor/vgrammar';

registerSankeyTransforms();
registerLinkPathGlyph();
```

### Usage of sankey transform

The `sankey` transform calculates the layout for the input data and returns the result as: `[{ nodes, links }]`;
You can use the `map` transform to get the data you want or do some formatting logic;

```js
{
  data: [
    {
      id: 'source'
    },
    {
      id: 'sankey',
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
  ];
}
```

### Displaying Sankey Nodes and Links

After obtaining the formatted data, we use two sets of glyphs to display the corresponding data:

Example:

```js
{
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
      }
    },

    {
      type: 'glyph',
      id: 'sankeyLink',
      glyphType: 'linkPath',
      from: { data: 'links' },
      key: 'index',
      dependency
```
