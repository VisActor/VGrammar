# 图表

在 VGrammar 的核心包之外，VGrammar 也提供了一些可选的扩展包以支持额外的图表能力：

- VGrammar-hierarchy：提供了部分层级图表的 transform 封装，例如旭日图等；
- VGrammar-sankey：提供了桑基图的 transform 封装；
- VGrammar-wordcloud：提供了词云的 transform 封装；
- VGrammar-wordcloud-shape：提供了形状词云的 transform 封装。

开发者可以使用这些扩展包所提供的 transform 快速创建各种常用的图表，例如桑基图、词云等。

## 层级图表

层级图表是一类以层级节点为核心，将数据按照分类层级关系进行分层组织的图表。层级图表帮助我们更好地理解数据之间的关联性和层次结构。

VGrammar 目前通过 vgrammar-hierarchy 包提供了四种层级图表：Circle-packing 图、旭日图、树图和矩形树图。

### Circle-packing 图

Circle-packing 图是一种通过嵌套放置同心圆的方式呈现多层次层级关系的图表。数据层的大小通常由每个圆的大小来表示，层级关系由同心圆之间的包含关系体现。Circle-packing 图适用于展示多层次结构数据在同一领域的大小比较以及层级关系分布情况。例如，Circle-packing 图可以用于显示全球各国家地区的人口分布情况、公司经营业务部门的销售业绩等。

开发者可以调用 vgrammar-hierarchy 中的 `registerCirclePackingTransforms()` 或者 `registerAllHierarchyTransforms()` 对 `circlePacking` transform 进行注册。

`circlePacking` transform 基于用户传入的层级数据计算 circle-packing 图的布局信息，并将布局结果放入数据字段中，例如 x、y。随后开发者可以将计算布局后的层级数据通过 `flattenNodes` 方法进行展平，并应用于 circle mark 的数据映射声明中。

一个简单的 transform 使用示例为：

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
### 旭日图

旭日图（Sunburst）是一种以环形结构展示多层级数据关系的图表。旭日图的每个扇区代表一个层级节点，从中心向外表示从根节点到叶节点的层级结构。扇区的大小通常表示节点权重或者其他相对重要度数值。旭日图适用于显示复杂数量的层级数据关系和比较权重，例如文件系统的存储分布、组织架构的人员比例等。

开发者可以调用 vgrammar-hierarchy 中的 `registerSunburstTransforms()` 或者 `registerAllHierarchyTransforms()` 对 `sunburst` transform 进行注册。

`sunburst` transform 基于用户传入的层级数据计算旭日图的布局信息，并将布局结果放入数据字段中，例如 x、y、innerRadius、outerRadius 等。随后开发者可以将计算布局后的层级数据通过 `flattenNodes` 方法进行展平，并应用于 mark 的数据映射声明中。

一个简单的 transform 使用示例为：

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
### 树图

树图（Tree）是一种以连接线将树形结构的层级节点串联起来的图表。树图从根节点开始，沿着连接线不断分支，直至叶子节点，形成一个完整的层级关系图。树图适用于显示层级关系明确、深度有限的数据结构，例如公司组织架构、地区政区划分等。

开发者可以调用 vgrammar-hierarchy 中的 `registerTreeTransforms()` 或者 `registerAllHierarchyTransforms()` 对 `tree` transform 进行注册。

`tree` transform 基于用户传入的层级数据计算旭日图的布局信息，并将布局结果放入数据字段中，例如 x、y 等。随后开发者可以将计算布局后的层级数据通过 `flattenNodes` 方法进行展平，并应用于 mark 的数据映射声明中。

一个简单的 transform 使用示例为：

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
### 矩形树图

矩形树图（Treemap）是一种将层级数据分隔成嵌套矩形的图表。矩形的面积表示节点的权重或者其他相对重要度数值，嵌套关系表示层级结构。矩形树图适用于展示节点间相对权重的层级关系，例如磁盘空间占用情况、销售数据等。

开发者可以调用 vgrammar-hierarchy 中的 `registerSunburstTransforms()` 或者 `registerAllHierarchyTransforms()` 对 `sunburst` transform 进行注册。

`sunburst` transform 基于用户传入的层级数据计算旭日图的布局信息，并将布局结果放入数据字段中，例如 x、y、innerRadius、outerRadius 等。随后开发者可以将计算布局后的层级数据通过 `flattenNodes` 方法进行展平，并应用于 mark 的数据映射声明中。

一个简单的 transform 使用示例为：

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
## 桑基图

桑基图（Sankey）是一种用来表示节点之间流量转移关系的图表。桑基图的节点表示数据实体，而流的大小通常由连接线的宽度来表示。桑基图适用于展示多个相互独立的节点之间的流量转移情况，例如能源流向分析、网站访问路径等。

### 安装

如果需要实现桑基图，需要安装 npm 包`@visactor/vgrammar-sankey`:

```sh
npm add --save @visactor/vgrammar-sankey
```

### 注册 transform

使用的时候，需要先调用`registerSankeyTransforms` 注册 sankey 布局算法对应的 transform； 同时 VGrammar 主包提供了组合图元`linkPath`用于展示桑基图中的连边；

```js
import { registerSankeyTransforms } from '@visactor/vgrammar-sankey';
import { registerLinkPathGlyph } from '@visactor/vgrammar';

registerSankeyTransforms();
registerLinkPathGlyph();
```

### sankey transform 的使用

`sankey` transform 对传入的数据计算布局，返回结果为：`[{ nodes, links }]`；
我们可以通过`map` transform 获取自己想要的数据，或者进行格式化等逻辑；

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

### sankey 节点和边的展示

得到格式化的数据后，我们通过两组图元展示对应的数据：

示例：

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
            fill: 'pink',
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
  ];
}
```

### sankey 示例

<div class="examples-ref-container" id="examples-ref-sankey" data-path="sankey/basic-sankey">
</div>

```javascript livedemo template=vgrammar
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
      range: [
        '#5383F4',
        '#7BCF8E',
        '#FF9D2C',
        '#FFDB26',
        '#7568D9',
        '#80D8FB',
        '#1857A3',
        '#CAB0E8',
        '#FF8867',
        '#B9E493',
        '#2CB4A8',
        '#B9E4E3'
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
## 词云

词云（Wordcloud）是一种将文字数据呈现为词汇组成的云形图像的图表。每个词汇的大小表示其权重或其他数值，视觉上呈现出数据中关键词的重要性差异。词云适用于展示关键词的权重差异，例如文本内容关键词分析、搜索热点关键词等。

### 安装

如果需要实现词云图，需要安装 npm 包`@visactor/vgrammar-wordcloud`:

```sh
npm add --save @visactor/vgrammar-wordcloud
```

### 注册 transform

使用的时候，需要先调用`registerWordCloudTransforms` 注册 wordcloud 布局算法对应的 transform；

```js
import { registerWordCloudTransforms } from '@visactor/vgrammar-wordcloud';

registerWordCloudTransforms();
```

### wordcloud transform 的使用

`wordcloud` transform 对传入的数据计算布局；
我们可以通过`map` transform 获取自己想要的数据，或者进行格式化等逻辑；

```js
{
  data: [
    {
      id: 'source',
      values: [{ text: '词', value: 1122 }]
    },
    {
      id: 'wordcloudTexts',
      transform: [
        {
          type: 'wordcloud',
          size: {
            value: params => {
              return [params.viewBox.width(), params.viewBox.height()];
            }
          },
          text: { field: 'text' },
          fontSize: { field: 'value' },
          fontSizeRange: [12, 40]
        }
      ]
    }
  ];
}
```

### 词云的展示

得到格式化的数据后，我们通过`text`图元展示对应的数据：

示例：

```js
{
  marks: [
    {
      type: 'text',
      from: { data: 'wordcloudTexts' },
      dependency: ['viewBox'],
      encode: {
        update: {
          text: { field: 'text' },
          textAlign: 'center',
          baseline: 'alphabetic',
          fill: { scale: 'colorScale', field: 'text' },
          fontFamily: { field: 'fontFamily' },
          fontWeight: { field: 'weight' },
          x: { field: 'x' },
          y: { field: 'y' },
          angle: { field: 'angle' },
          fontSize: { field: 'fontSize' },
          fillOpacity: 1
        },
        hover: {
          fillOpacity: 0.5
        }
      }
    }
  ];
}
```

### 词云图的性能优化

由于词云图计算是一个非常耗时的过程，所以 VGrammar 也支持渐进式的输出结果，即每计算完一批词的布局结果，就返回并渲染；
想要实现渐进渲染的词云图，只需要将 transform 配置到`mark`中，并设置以下两个属性之一：

- progressiveStep number 类型，按照词的个数渐进渲染，也就是每帧处理的词的个数
- progressiveTime number 类型，单位是`ms`，也就是当布局耗时超过这个时长的时候，停止计算，等待下一帧再继续计算

```js
{
  marks: [
    {
      type: 'text',
      from: { data: 'source' },
      dependency: ['viewBox'],
      transform: [
        {
          type: 'wordcloud',
          size: {
            value: params => {
              return [params.viewBox.width(), params.viewBox.height()];
            }
          },
          text: { field: 'text' },
          fontSize: { field: 'value' },
          fontSizeRange: [12, 40],
          progressiveStep: 10
        }
      ],
      encode: {
        update: {
          text: { field: 'text' },
          textAlign: 'center',
          baseline: 'alphabetic',
          fill: { scale: 'colorScale', field: 'text' },
          fontFamily: { field: 'fontFamily' },
          fontWeight: { field: 'weight' },
          x: { field: 'x' },
          y: { field: 'y' },
          angle: { field: 'angle' },
          fontSize: { field: 'fontSize' },
          fillOpacity: 1
        },
        hover: {
          fillOpacity: 0.5
        }
      }
    }
  ];
}
```

### 词云图示例

<div class="examples-ref-container" id="examples-ref-wordcloud" data-path="wordcloud/basic-wordcloud">
</div>

```javascript livedemo template=vgrammar
VGrammarWordcloud.registerWordCloudTransforms();

const spec = {
  padding: { top: 30, right: 10, bottom: 80, left: 10 },

  data: [
    {
      id: 'table',
      values: [
        { text: '方鸿渐', value: 3.436043828951773 },
        { text: '赵辛楣', value: 1.3178167504457066 },
        { text: '小姐', value: 0.6934448556308183 },
        { text: '孙小姐', value: 0.6109538839148378 },
        { text: '孙柔嘉', value: 0.5785536953176272 },
        { text: '唐小姐', value: 0.2764069702950092 },
        { text: '李梅亭', value: 0.27521477867539906 },
        { text: '高松年', value: 0.21093103475121827 },
        { text: '汪太太', value: 0.19086668132085363 },
        { text: '李先生', value: 0.14508601296874474 },
        { text: '老太太', value: 0.09036877536276255 },
        { text: '刘东方', value: 0.08638128089811796 },
        { text: '韩学愈', value: 0.08236354690285666 },
        { text: '李妈', value: 0.07865007748112922 },
        { text: '曹元朗', value: 0.0763369459099647 },
        { text: '陆子潇', value: 0.0763369459099647 },
        { text: '汪处厚', value: 0.07432807891233406 },
        { text: '刘小姐', value: 0.07211047297647454 },
        { text: '汪先生', value: 0.07102016049148042 },
        { text: '阿丑', value: 0.06643563492505461 },
        { text: '顾尔谦', value: 0.060266009928919506 },
        { text: '顾先生', value: 0.05796853584619392 },
        { text: '赵先生', value: 0.05720169712462779 },
        { text: '苏文纨', value: 0.04821280794313561 },
        { text: '明白', value: 0.044722300441098976 },
        { text: '唐晓芙', value: 0.04218620695024365 },
        { text: '梅亭', value: 0.03924274156452697 },
        { text: '褚慎明', value: 0.03816847295498235 },
        { text: '胡子', value: 0.0347468103572576 },
        { text: '孙太太', value: 0.032556325142530665 },
        { text: '胡闹', value: 0.03169125041995463 },
        { text: '封信', value: 0.03140663761517224 },
        { text: '王先生', value: 0.031371347591241806 },
        { text: '老妈子', value: 0.031042790599831956 },
        { text: '伯伯', value: 0.031036399689611832 },
        { text: '阿福', value: 0.030117444981717357 },
        { text: '凤仪', value: 0.02949954564258108 },
        { text: '冷笑', value: 0.026737336057523105 },
        { text: '董斜川', value: 0.026115270969198454 },
        { text: '李顾', value: 0.026115270969198454 },
        { text: '老先生', value: 0.024110165208304488 },
        { text: '慎明', value: 0.024106403971567804 },
        { text: '陆太太', value: 0.023599636514064867 },
        { text: '刘先生', value: 0.02184469835184339 },
        { text: '克莱登', value: 0.0200886699763065 },
        { text: '孙先生', value: 0.018890428147511344 },
        { text: '问辛楣', value: 0.01807980297867585 },
        { text: '美玉', value: 0.017978355604584106 },
        { text: '桂林', value: 0.016348843643602756 },
        { text: '谢谢', value: 0.016105756435313395 },
        { text: '伯母', value: 0.014781026617773483 },
        { text: '牛津', value: 0.014217410827566796 },
        { text: '翁道', value: 0.014062068983414552 },
        { text: '师生', value: 0.01395574514494875 },
        { text: '原谅', value: 0.013453662943555704 },
        { text: '陆先生', value: 0.012311684277012267 },
        { text: '苏家', value: 0.012053201985783902 },
        { text: '子潇', value: 0.012053201985783902 },
        { text: '韩先生', value: 0.011982816181666946 },
        { text: '唐家', value: 0.011799818257032434 },
        { text: '沈先生', value: 0.011693590212401276 },
        { text: '李梅', value: 0.011693590212401276 },
        { text: '韩太太', value: 0.011685771119581584 },
        { text: '罗素', value: 0.01168084358409343 },
        { text: '元朗', value: 0.011597495257133255 },
        { text: '董先生', value: 0.011158592815896488 },
        { text: '苏小', value: 0.011096900076793816 },
        { text: '时髦', value: 0.010563750139984878 },
        { text: '古董', value: 0.010433822569998318 },
        { text: '王尔恺', value: 0.01004433498815325 },
        { text: '范懿', value: 0.01004433498815325 },
        { text: '阿丑道', value: 0.01004433498815325 },
        { text: '李医生', value: 0.00983318188086036 },
        { text: '汪氏', value: 0.00983318188086036 },
        { text: '爸爸妈妈', value: 0.009648742374414383 },
        { text: '大家庭', value: 0.009512454579048901 },
        { text: '别吵', value: 0.009461956244664763 },
        { text: '静默', value: 0.008898172243394387 },
        { text: '殷勤', value: 0.008609698020100823 },
        { text: '子儿', value: 0.008159152167660897 },
        { text: '仁丹', value: 0.008139081285632666 },
        { text: '张开', value: 0.008077768133396068 },
        { text: '白话诗', value: 0.0080354679905226 },
        { text: '阿刘', value: 0.0080354679905226 },
        { text: '苏鸿业', value: 0.0080354679905226 },
        { text: '赵方', value: 0.0080354679905226 },
        { text: '唐小', value: 0.0080354679905226 },
        { text: '陈散原', value: 0.0080354679905226 },
        { text: '子里', value: 0.0080354679905226 },
        { text: '文明', value: 0.007834853877435726 },
        { text: '寒喧', value: 0.007731663504755503 },
        { text: '李瞎子', value: 0.007731663504755503 },
        { text: '祖宗', value: 0.007675502361092252 },
        { text: '老远', value: 0.007486342686271215 },
        { text: '柏格森', value: 0.007439061877264325 },
        { text: '戴帽子', value: 0.00729702921478743 },
        { text: '小弟弟', value: 0.007080075161821543 },
        { text: '满以为', value: 0.007057288032465131 },
        { text: '钮子', value: 0.007007567292219795 },
        { text: '那本书', value: 0.006934739515039489 },
        { text: '满屋子', value: 0.006815310056326667 },
        { text: '小东西', value: 0.006784752251520753 },
        { text: '黑甜', value: 0.00665814004607629 },
        { text: '别以为', value: 0.006637759006042682 },
        { text: '道谢', value: 0.006580274769148043 },
        { text: '孙子', value: 0.006518770161645102 },
        { text: '黄山谷', value: 0.006453738210368005 },
        { text: '饶恕', value: 0.006450420136965215 },
        { text: '西医', value: 0.0063416363860326 },
        { text: '祖母', value: 0.0063263594570593185 },
        { text: '斯文', value: 0.006228162435725089 },
        { text: '老二', value: 0.006108884756578726 },
        { text: '周厚卿', value: 0.006026600992891951 },
        { text: '苏家来', value: 0.006026600992891951 },
        { text: '老世伯', value: 0.006026600992891951 },
        { text: '赵先', value: 0.006026600992891951 },
        { text: '孙小', value: 0.006026600992891951 },
        { text: '维妙维肖', value: 0.005899909128516217 },
        { text: '徐小姐', value: 0.005899909128516217 },
        { text: '夏令', value: 0.005846795106200638 },
        { text: '白衬衫', value: 0.0057987476285666275 },
        { text: '老李', value: 0.005765530279173248 },
        { text: '许先生', value: 0.0057548837181314065 },
        { text: '周密', value: 0.005715015930404974 },
        { text: '张妈', value: 0.005714532832045035 },
        { text: '陈列', value: 0.005682366177321459 },
        { text: '老古董', value: 0.005579296407948244 },
        { text: '钮扣', value: 0.005310056371366157 },
        { text: '雨淋', value: 0.0051479406139640395 },
        { text: '宝贝', value: 0.005146369182530667 },
        { text: '戴眼镜', value: 0.005035450166299782 },
        { text: '沙丁鱼', value: 0.0050254673261216605 },
        { text: '娶媳妇', value: 0.004911003815469669 },
        { text: '乌龟', value: 0.004895491300596538 },
        { text: '老三', value: 0.004831048330586456 },
        { text: '道德', value: 0.004793940138013779 },
        { text: '铁青', value: 0.004711880739563099 },
        { text: '矫正', value: 0.0046962074474760545 },
        { text: '谢仪', value: 0.00467171152814653 },
        { text: '修指甲', value: 0.0044387600307175265 },
        { text: '养条狗', value: 0.004302492140245337 },
        { text: '房东太太', value: 0.004302492140245337 },
        { text: '曹元', value: 0.0042058085333221305 },
        { text: '红墨水', value: 0.0042058085333221305 },
        { text: '纪念周', value: 0.0042058085333221305 },
        { text: '麻木', value: 0.004185307860685598 },
        { text: '朱古力', value: 0.004130814901529155 },
        { text: '小宝贝', value: 0.004069540642816333 },
        { text: '沈氏', value: 0.004069540642816333 },
        { text: '博士文凭', value: 0.0040177339952613 },
        { text: '朱古力糖', value: 0.0040177339952613 },
        { text: '方鸿', value: 0.0040177339952613 },
        { text: '沈子培', value: 0.0040177339952613 },
        { text: '王乐恺', value: 0.0040177339952613 },
        { text: '慎明兄', value: 0.0040177339952613 },
        { text: '向辛楣', value: 0.0040177339952613 },
        { text: '美的', value: 0.0040177339952613 },
        { text: '赵辛', value: 0.0040177339952613 },
        { text: '墨晶', value: 0.0040177339952613 },
        { text: '顾尔廉', value: 0.0040177339952613 },
        { text: '云爱', value: 0.0040177339952613 },
        { text: '钱花', value: 0.0040177339952613 },
        { text: '许大隆', value: 0.0040177339952613 },
        { text: '阿福道', value: 0.0040177339952613 },
        { text: '包仁丹', value: 0.0040177339952613 },
        { text: '早得很', value: 0.0040177339952613 },
        { text: '范小', value: 0.0040177339952613 },
        { text: '汪派', value: 0.0040177339952613 },
        { text: '汪太', value: 0.0040177339952613 },
        { text: '翁笑', value: 0.0040177339952613 },
        { text: '小妞儿', value: 0.003972857035893127 },
        { text: '老处女', value: 0.003972857035893127 },
        { text: '相思病', value: 0.003933272752344144 },
        { text: '墨水瓶', value: 0.003933272752344144 },
        { text: '方氏', value: 0.0038978634041337587 },
        { text: '徐志摩', value: 0.0038658317523777514 },
        { text: '官太太', value: 0.0038658317523777514 },
        { text: '单相思', value: 0.0038658317523777514 },
        { text: '哈巴狗', value: 0.0038365891454209375 },
        { text: '冷冷道', value: 0.003784782497865905 },
        { text: '道贺', value: 0.003784782497865905 },
        { text: '黄毛丫头', value: 0.003784782497865905 },
        { text: '修正', value: 0.0037518094615846074 },
        { text: '苏曼殊', value: 0.003739905538464124 },
        { text: '祖先', value: 0.0037324328659670645 },
        { text: '阳世', value: 0.0037195309386321624 },
        { text: '大贤', value: 0.0037195309386321624 },
        { text: '秋凉', value: 0.003700321254948748 },
        { text: '通顺', value: 0.003700321254948748 },
        { text: '愚忠', value: 0.003700321254948748 },
        { text: '喝咖啡', value: 0.003664911906704756 },
        { text: '续弦', value: 0.003664911906704756 },
        { text: '叶子', value: 0.003663599001193077 },
        { text: '冰淇淋', value: 0.003648514607393715 },
        { text: '包罗万象', value: 0.003632880254948748 },
        { text: '华氏', value: 0.003617940996807259 },
        { text: '东方人', value: 0.003564053364476559 },
        { text: '孙氏', value: 0.003564053364476559 },
        { text: '马屁', value: 0.003564053364476559 },
        { text: '曹禺', value: 0.003564053364476559 }
      ]
    }
  ],

  scales: [
    {
      id: 'colorScale',
      type: 'ordinal',

      domain: { data: 'table', field: 'text' },
      range: [
        '#5383F4',
        '#7BCF8E',
        '#FF9D2C',
        '#FFDB26',
        '#7568D9',
        '#80D8FB',
        '#1857A3',
        '#CAB0E8',
        '#FF8867',
        '#B9E493',
        '#2CB4A8',
        '#B9E4E3'
      ]
    }
  ],

  marks: [
    {
      type: 'text',
      from: { data: 'table' },
      dependency: ['viewBox'],
      transform: [
        {
          type: 'wordcloud',
          size: {
            value: params => {
              return [params.viewBox.width(), params.viewBox.height()];
            }
          },
          text: { field: 'text' },
          fontSize: { field: 'value' },
          fontSizeRange: [12, 40]
        }
      ],
      encode: {
        update: {
          text: { field: 'text' },
          textAlign: 'center',
          baseline: 'alphabetic',
          fill: { scale: 'colorScale', field: 'text' },
          fontFamily: { field: 'fontFamily' },
          fontWeight: { field: 'weight' },
          x: { field: 'x' },
          y: { field: 'y' },
          angle: { field: 'angle' },
          fontSize: { field: 'fontSize' },
          fillOpacity: 1
        },
        hover: {
          fillOpacity: 0.5
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
## 形状词云

形状词云（WordcloudShape）是一种基于词云将文字数据呈现在特定形状的图表。与词云相同，每个词汇的大小表示其权重或其他数值，同时形状词云还具较强的视觉美感。形状词云适用于展示关键词的权重差异，同时具有较高的视觉冲击力，例如品牌宣传、商业推广等。

### 安装

如果需要实现形状词云，需要安装 npm 包`@visactor/vgrammar-wordcloud-shape`:

```sh
npm add --save @visactor/vgrammar-wordcloud-shape
```

### 注册 transform

使用的时候，需要先调用`registerWordCloudShapeTransforms` 注册 wordcloud 布局算法对应的 transform；

```js
import { registerWordCloudShapeTransforms } from '@visactor/vgrammar-wordcloud-shape';

registerWordCloudShapeTransforms();
```

### wordcloud-shape transform 的使用

`wordcloud-shape` transform 对传入的数据计算布局；返回两种类型的词，一种是填充词，另一种是轮廓词；
我们可以通过`map` transform 获取自己想要的数据，或者进行格式化等逻辑；

```js
{
  data: [
    {
      id: 'source',
      values: [{ text: '词', value: 1122 }]
    },
    {
      id: 'wordcloudTexts',
      dependency: ['viewBox'],
      transform: [
        {
          type: 'wordcloudShape',
          size: {
            value: params => {
              return [params.viewBox.width(), params.viewBox.height()];
            }
          },
          fontSize: { field: 'value' },
          text: { field: 'text' },
          colorList: [
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
          ],
          shape: 'https://s1.ax1x.com/2023/06/02/pCSUWct.png',
          colorMode: 'ordinal'
        }
      ]
    },
    {
      id: 'keywords',
      source: 'shapeData',
      transform: [
        {
          type: 'filter',
          callback: datum => {
            return !datum.isFillingWord;
          }
        }
      ]
    },
    {
      id: 'filling',
      source: 'shapeData',
      transform: [
        {
          type: 'filter',
          callback: datum => {
            return datum.isFillingWord;
          }
        }
      ]
    }
  ];
}
```

### 词云的展示

得到格式化的数据后，我们通过`text`图元展示对应的数据：

示例：

```js
{
  marks: [
    {
      type: 'text',
      from: { data: 'keywords' },
      encode: {
        enter: {
          text: { field: 'text' },
          textAlign: 'center',
          textBaseline: 'alphabetic',
          fill: { field: 'color' },
          fontFamily: { field: 'fontFamily' },
          fontWeight: { field: 'fontWeight' },
          fontStyle: { field: 'fontStyle' },
          visible: { field: 'visible' }
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          angle: { field: 'angle' },
          fontSize: { field: 'fontSize' },
          fillOpacity: { field: 'opacity' }
        },
        hover: {
          fillOpacity: 0.5
        }
      }
    }
  ];
}
```

### 形状词云图示例

<div class="examples-ref-container" id="examples-ref-wordcloud-shape" data-path="wordcloud-shape/basic-wordcloud-shape">
</div>

```javascript livedemo template=vgrammar
VGrammarWordcloudShape.registerWordCloudShapeTransforms();

const spec = {
  padding: { top: 30, right: 10, bottom: 80, left: 10 },

  data: [
    {
      id: 'table',
      values: [
        { text: '方鸿渐', value: 3.436043828951773 },
        { text: '赵辛楣', value: 1.3178167504457066 },
        { text: '小姐', value: 0.6934448556308183 },
        { text: '孙小姐', value: 0.6109538839148378 },
        { text: '孙柔嘉', value: 0.5785536953176272 },
        { text: '唐小姐', value: 0.2764069702950092 },
        { text: '李梅亭', value: 0.27521477867539906 },
        { text: '高松年', value: 0.21093103475121827 },
        { text: '汪太太', value: 0.19086668132085363 },
        { text: '李先生', value: 0.14508601296874474 },
        { text: '老太太', value: 0.09036877536276255 },
        { text: '刘东方', value: 0.08638128089811796 },
        { text: '韩学愈', value: 0.08236354690285666 },
        { text: '李妈', value: 0.07865007748112922 },
        { text: '曹元朗', value: 0.0763369459099647 },
        { text: '陆子潇', value: 0.0763369459099647 },
        { text: '汪处厚', value: 0.07432807891233406 },
        { text: '刘小姐', value: 0.07211047297647454 },
        { text: '汪先生', value: 0.07102016049148042 },
        { text: '阿丑', value: 0.06643563492505461 },
        { text: '顾尔谦', value: 0.060266009928919506 },
        { text: '顾先生', value: 0.05796853584619392 },
        { text: '赵先生', value: 0.05720169712462779 },
        { text: '苏文纨', value: 0.04821280794313561 },
        { text: '明白', value: 0.044722300441098976 },
        { text: '唐晓芙', value: 0.04218620695024365 },
        { text: '梅亭', value: 0.03924274156452697 },
        { text: '褚慎明', value: 0.03816847295498235 },
        { text: '胡子', value: 0.0347468103572576 },
        { text: '孙太太', value: 0.032556325142530665 },
        { text: '胡闹', value: 0.03169125041995463 },
        { text: '封信', value: 0.03140663761517224 },
        { text: '王先生', value: 0.031371347591241806 },
        { text: '老妈子', value: 0.031042790599831956 },
        { text: '伯伯', value: 0.031036399689611832 },
        { text: '阿福', value: 0.030117444981717357 },
        { text: '凤仪', value: 0.02949954564258108 },
        { text: '冷笑', value: 0.026737336057523105 },
        { text: '董斜川', value: 0.026115270969198454 },
        { text: '李顾', value: 0.026115270969198454 },
        { text: '老先生', value: 0.024110165208304488 },
        { text: '慎明', value: 0.024106403971567804 },
        { text: '陆太太', value: 0.023599636514064867 },
        { text: '刘先生', value: 0.02184469835184339 },
        { text: '克莱登', value: 0.0200886699763065 },
        { text: '孙先生', value: 0.018890428147511344 },
        { text: '问辛楣', value: 0.01807980297867585 },
        { text: '美玉', value: 0.017978355604584106 },
        { text: '桂林', value: 0.016348843643602756 },
        { text: '谢谢', value: 0.016105756435313395 },
        { text: '伯母', value: 0.014781026617773483 },
        { text: '牛津', value: 0.014217410827566796 },
        { text: '翁道', value: 0.014062068983414552 },
        { text: '师生', value: 0.01395574514494875 },
        { text: '原谅', value: 0.013453662943555704 },
        { text: '陆先生', value: 0.012311684277012267 },
        { text: '苏家', value: 0.012053201985783902 },
        { text: '子潇', value: 0.012053201985783902 },
        { text: '韩先生', value: 0.011982816181666946 },
        { text: '唐家', value: 0.011799818257032434 },
        { text: '沈先生', value: 0.011693590212401276 },
        { text: '李梅', value: 0.011693590212401276 },
        { text: '韩太太', value: 0.011685771119581584 },
        { text: '罗素', value: 0.01168084358409343 },
        { text: '元朗', value: 0.011597495257133255 },
        { text: '董先生', value: 0.011158592815896488 },
        { text: '苏小', value: 0.011096900076793816 },
        { text: '时髦', value: 0.010563750139984878 },
        { text: '古董', value: 0.010433822569998318 },
        { text: '王尔恺', value: 0.01004433498815325 },
        { text: '范懿', value: 0.01004433498815325 },
        { text: '阿丑道', value: 0.01004433498815325 },
        { text: '李医生', value: 0.00983318188086036 },
        { text: '汪氏', value: 0.00983318188086036 },
        { text: '爸爸妈妈', value: 0.009648742374414383 },
        { text: '大家庭', value: 0.009512454579048901 },
        { text: '别吵', value: 0.009461956244664763 },
        { text: '静默', value: 0.008898172243394387 },
        { text: '殷勤', value: 0.008609698020100823 },
        { text: '子儿', value: 0.008159152167660897 },
        { text: '仁丹', value: 0.008139081285632666 },
        { text: '张开', value: 0.008077768133396068 },
        { text: '白话诗', value: 0.0080354679905226 },
        { text: '阿刘', value: 0.0080354679905226 },
        { text: '苏鸿业', value: 0.0080354679905226 },
        { text: '赵方', value: 0.0080354679905226 },
        { text: '唐小', value: 0.0080354679905226 },
        { text: '陈散原', value: 0.0080354679905226 },
        { text: '子里', value: 0.0080354679905226 },
        { text: '文明', value: 0.007834853877435726 },
        { text: '寒喧', value: 0.007731663504755503 },
        { text: '李瞎子', value: 0.007731663504755503 },
        { text: '祖宗', value: 0.007675502361092252 },
        { text: '老远', value: 0.007486342686271215 },
        { text: '柏格森', value: 0.007439061877264325 },
        { text: '戴帽子', value: 0.00729702921478743 },
        { text: '小弟弟', value: 0.007080075161821543 },
        { text: '满以为', value: 0.007057288032465131 },
        { text: '钮子', value: 0.007007567292219795 },
        { text: '那本书', value: 0.006934739515039489 },
        { text: '满屋子', value: 0.006815310056326667 },
        { text: '小东西', value: 0.006784752251520753 },
        { text: '黑甜', value: 0.00665814004607629 },
        { text: '别以为', value: 0.006637759006042682 },
        { text: '道谢', value: 0.006580274769148043 },
        { text: '孙子', value: 0.006518770161645102 },
        { text: '黄山谷', value: 0.006453738210368005 },
        { text: '饶恕', value: 0.006450420136965215 },
        { text: '西医', value: 0.0063416363860326 },
        { text: '祖母', value: 0.0063263594570593185 },
        { text: '斯文', value: 0.006228162435725089 },
        { text: '老二', value: 0.006108884756578726 },
        { text: '周厚卿', value: 0.006026600992891951 },
        { text: '苏家来', value: 0.006026600992891951 },
        { text: '老世伯', value: 0.006026600992891951 },
        { text: '赵先', value: 0.006026600992891951 },
        { text: '孙小', value: 0.006026600992891951 },
        { text: '维妙维肖', value: 0.005899909128516217 },
        { text: '徐小姐', value: 0.005899909128516217 },
        { text: '夏令', value: 0.005846795106200638 },
        { text: '白衬衫', value: 0.0057987476285666275 },
        { text: '老李', value: 0.005765530279173248 },
        { text: '许先生', value: 0.0057548837181314065 },
        { text: '周密', value: 0.005715015930404974 },
        { text: '张妈', value: 0.005714532832045035 },
        { text: '陈列', value: 0.005682366177321459 },
        { text: '老古董', value: 0.005579296407948244 },
        { text: '钮扣', value: 0.005310056371366157 },
        { text: '雨淋', value: 0.0051479406139640395 },
        { text: '宝贝', value: 0.005146369182530667 },
        { text: '戴眼镜', value: 0.005035450166299782 },
        { text: '沙丁鱼', value: 0.0050254673261216605 },
        { text: '娶媳妇', value: 0.004911003815469669 },
        { text: '乌龟', value: 0.004895491300596538 },
        { text: '老三', value: 0.004831048330586456 },
        { text: '道德', value: 0.004793940138013779 },
        { text: '铁青', value: 0.004711880739563099 },
        { text: '矫正', value: 0.0046962074474760545 },
        { text: '谢仪', value: 0.00467171152814653 },
        { text: '修指甲', value: 0.0044387600307175265 },
        { text: '养条狗', value: 0.004302492140245337 },
        { text: '房东太太', value: 0.004302492140245337 },
        { text: '曹元', value: 0.0042058085333221305 },
        { text: '红墨水', value: 0.0042058085333221305 },
        { text: '纪念周', value: 0.0042058085333221305 },
        { text: '麻木', value: 0.004185307860685598 },
        { text: '朱古力', value: 0.004130814901529155 },
        { text: '小宝贝', value: 0.004069540642816333 },
        { text: '沈氏', value: 0.004069540642816333 },
        { text: '博士文凭', value: 0.0040177339952613 },
        { text: '朱古力糖', value: 0.0040177339952613 },
        { text: '方鸿', value: 0.0040177339952613 },
        { text: '沈子培', value: 0.0040177339952613 },
        { text: '王乐恺', value: 0.0040177339952613 },
        { text: '慎明兄', value: 0.0040177339952613 },
        { text: '向辛楣', value: 0.0040177339952613 },
        { text: '美的', value: 0.0040177339952613 },
        { text: '赵辛', value: 0.0040177339952613 },
        { text: '墨晶', value: 0.0040177339952613 },
        { text: '顾尔廉', value: 0.0040177339952613 },
        { text: '云爱', value: 0.0040177339952613 },
        { text: '钱花', value: 0.0040177339952613 },
        { text: '许大隆', value: 0.0040177339952613 },
        { text: '阿福道', value: 0.0040177339952613 },
        { text: '包仁丹', value: 0.0040177339952613 },
        { text: '早得很', value: 0.0040177339952613 },
        { text: '范小', value: 0.0040177339952613 },
        { text: '汪派', value: 0.0040177339952613 },
        { text: '汪太', value: 0.0040177339952613 },
        { text: '翁笑', value: 0.0040177339952613 },
        { text: '小妞儿', value: 0.003972857035893127 },
        { text: '老处女', value: 0.003972857035893127 },
        { text: '相思病', value: 0.003933272752344144 },
        { text: '墨水瓶', value: 0.003933272752344144 },
        { text: '方氏', value: 0.0038978634041337587 },
        { text: '徐志摩', value: 0.0038658317523777514 },
        { text: '官太太', value: 0.0038658317523777514 },
        { text: '单相思', value: 0.0038658317523777514 },
        { text: '哈巴狗', value: 0.0038365891454209375 },
        { text: '冷冷道', value: 0.003784782497865905 },
        { text: '道贺', value: 0.003784782497865905 },
        { text: '黄毛丫头', value: 0.003784782497865905 },
        { text: '修正', value: 0.0037518094615846074 },
        { text: '苏曼殊', value: 0.003739905538464124 },
        { text: '祖先', value: 0.0037324328659670645 },
        { text: '阳世', value: 0.0037195309386321624 },
        { text: '大贤', value: 0.0037195309386321624 },
        { text: '秋凉', value: 0.003700321254948748 },
        { text: '通顺', value: 0.003700321254948748 },
        { text: '愚忠', value: 0.003700321254948748 },
        { text: '喝咖啡', value: 0.003664911906704756 },
        { text: '续弦', value: 0.003664911906704756 },
        { text: '叶子', value: 0.003663599001193077 },
        { text: '冰淇淋', value: 0.003648514607393715 },
        { text: '包罗万象', value: 0.003632880254948748 },
        { text: '华氏', value: 0.003617940996807259 },
        { text: '东方人', value: 0.003564053364476559 },
        { text: '孙氏', value: 0.003564053364476559 },
        { text: '马屁', value: 0.003564053364476559 },
        { text: '曹禺', value: 0.003564053364476559 }
      ]
    },
    {
      id: 'shapeData',
      source: 'table',
      dependency: ['viewBox'],
      transform: [
        {
          type: 'wordcloudShape',
          size: {
            value: params => {
              return [params.viewBox.width(), params.viewBox.height()];
            }
          },
          fontSize: { field: 'value' },
          text: { field: 'text' },
          colorList: [
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
          ],
          shape: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a222eb3ecfe32db85220dda0d.png',

          colorMode: 'ordinal'
          // padding: 1,
          // fillingPadding: 0.4,
          // fillingRatio: 0.7,
          // ratio: 1,
          // fillingRotateList: ['0'],
          // random: false,
          // textLayoutTimes: 3,
          // fontSizeShrinkFactor: 0.9,
          // stepFactor: 4,
          // layoutMode: 'ensureMapping'
          // fontSizeEnlargeFactor: 1.2,
          // fillingXRatioStep: 0.008, // 步长为宽度的比例
          // fillingYRatioStep: 0.008
        }
      ]
    },
    {
      id: 'keywords',
      source: 'shapeData',
      transform: [
        {
          type: 'filter',
          callback: datum => {
            return !datum.isFillingWord;
          }
        }
      ]
    },
    {
      id: 'filling',
      source: 'shapeData',
      transform: [
        {
          type: 'filter',
          callback: datum => {
            return datum.isFillingWord;
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'colorScale',
      type: 'ordinal',

      domain: { data: 'table', field: 'text' },
      range: [
        '#5383F4',
        '#7BCF8E',
        '#FF9D2C',
        '#FFDB26',
        '#7568D9',
        '#80D8FB',
        '#1857A3',
        '#CAB0E8',
        '#FF8867',
        '#B9E493',
        '#2CB4A8',
        '#B9E4E3'
      ]
    }
  ],

  marks: [
    {
      type: 'text',
      from: { data: 'keywords' },
      encode: {
        enter: {
          text: { field: 'text' },
          textAlign: 'center',
          textBaseline: 'alphabetic',
          fill: { field: 'color' },
          fontFamily: { field: 'fontFamily' },
          fontWeight: { field: 'fontWeight' },
          fontStyle: { field: 'fontStyle' },
          visible: { field: 'visible' }
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          angle: { field: 'angle' },
          fontSize: { field: 'fontSize' },
          fillOpacity: { field: 'opacity' }
        },
        hover: {
          fillOpacity: 0.5
        }
      }
    },
    {
      type: 'text',
      from: { data: 'filling' },
      encode: {
        enter: {
          text: { field: 'text' },
          textAlign: 'center',
          textBaseline: 'alphabetic',
          fill: { field: 'color' },
          fontFamily: { field: 'fontFamily' },
          fontWeight: { field: 'fontWeight' },
          fontStyle: { field: 'fontStyle' },
          fillOpacity: { field: 'opacity' }
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          angle: { field: 'angle' },
          fontSize: { field: 'fontSize' }
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