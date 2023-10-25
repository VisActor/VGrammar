# 组件图元

VGrammar 中的组件图元（Component）是包含特定交互、动画、数据逻辑的组件，用于提供某一类特定的可视化功能。

所有组件图元的图元类型均为 `'component'`，开发者需要配置 `componetType` 以声明其为何种类型的组合图元：

```js
{
  type: 'component',
  componentType: 'axis',
  encode: {}
}
```

## 轴 (Axis)

轴是一种基本的图形组件，用于表示图表的基准值和数据的映射关系。轴通常包括一个刻度线一个标签，分别表示值域和数据的具体值。此外，轴可以额外设置网格线部分等，以强化数据的可读性。

在笛卡尔坐标系中，包括两种轴：横轴（X 轴）和纵轴（Y 轴）。不同类型的轴也可能用于不同类型的图表，如径向图表需极轴和角轴。

轴组件的 componentType 为 `'axis'` ，同时 View 上也提供了 `View.component()` 接口以便捷的创建一个轴。

一个简单的直角坐标系轴示例为：

<div class="examples-ref-container" id="examples-ref-axis-rect" data-path="basic-mark-rect/basic-rect"></div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

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
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
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
          componentType: 'axis',
          scale: 'xscale',
          tickCount: -1,
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: params.viewBox.height(),
                start: { x: 0, y: 0 },
                end: { x: params.viewBox.width(), y: 0 }
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'axis',
          scale: 'yscale',
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: 0,
                start: { x: 0, y: params.viewBox.height() },
                end: { x: 0, y: 0 },
                verticalFactor: -1
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'xscale',
          crosshairShape: 'rect',
          crosshairType: 'x'
        },
        {
          type: 'rect',
          id: 'rect',
          from: { data: 'table' },
          dependency: ['yscale'],
          encode: {
            update: {
              x: { scale: 'xscale', field: 'name', band: 0.25 },
              width: { scale: 'xscale', band: 0.5 },
              y: { scale: 'yscale', field: 'value' },
              y1: (datum, element, params) => {
                return params.yscale.scale(params.yscale.domain()[0]);
              },
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

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

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
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
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
          componentType: 'axis',
          scale: 'xscale',
          tickCount: -1,
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: params.viewBox.height(),
                start: { x: 0, y: 0 },
                end: { x: params.viewBox.width(), y: 0 }
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'axis',
          scale: 'yscale',
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: 0,
                start: { x: 0, y: params.viewBox.height() },
                end: { x: 0, y: 0 },
                verticalFactor: -1
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'xscale',
          crosshairShape: 'rect',
          crosshairType: 'x'
        },
        {
          type: 'rect',
          id: 'rect',
          from: { data: 'table' },
          dependency: ['yscale'],
          encode: {
            update: {
              x: { scale: 'xscale', field: 'name', band: 0.25 },
              width: { scale: 'xscale', band: 0.5 },
              y: { scale: 'yscale', field: 'value' },
              y1: (datum, element, params) => {
                return params.yscale.scale(params.yscale.domain()[0]);
              },
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

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

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
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
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
          componentType: 'axis',
          scale: 'xscale',
          tickCount: -1,
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: params.viewBox.height(),
                start: { x: 0, y: 0 },
                end: { x: params.viewBox.width(), y: 0 }
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'axis',
          scale: 'yscale',
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: 0,
                start: { x: 0, y: params.viewBox.height() },
                end: { x: 0, y: 0 },
                verticalFactor: -1
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'xscale',
          crosshairShape: 'rect',
          crosshairType: 'x'
        },
        {
          type: 'rect',
          id: 'rect',
          from: { data: 'table' },
          dependency: ['yscale'],
          encode: {
            update: {
              x: { scale: 'xscale', field: 'name', band: 0.25 },
              width: { scale: 'xscale', band: 0.5 },
              y: { scale: 'yscale', field: 'value' },
              y1: (datum, element, params) => {
                return params.yscale.scale(params.yscale.domain()[0]);
              },
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

一个简单的极坐标系轴示例为：

<div class="examples-ref-container" id="examples-ref-axis-polar" data-path="mark-interval/polar-interval"></div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        { category: 'A', amount: 28, index: 0, group: 'new' },
        { category: 'B', amount: 55, index: 1, group: 'new' },
        { category: 'C', amount: -43, index: 2, group: 'new' },
        { category: 'D', amount: 91, index: 3, group: 'new' },
        { category: 'E', amount: 81, index: 4, group: 'new' },
        { category: 'F', amount: 53, index: 5, group: 'new' },
        { category: 'G', amount: 19, index: 6, group: 'new' },
        { category: 'H', amount: 87, index: 7, group: 'new' },

        { category: 'A', amount: 28, index: 0, group: 'old' },
        { category: 'B', amount: 65, index: 1, group: 'old' },
        { category: 'C', amount: 43, index: 2, group: 'old' },
        { category: 'D', amount: 41, index: 3, group: 'old' },
        { category: 'E', amount: 61, index: 4, group: 'old' },
        { category: 'F', amount: 23, index: 5, group: 'old' },
        { category: 'G', amount: 39, index: 6, group: 'old' },
        { category: 'H', amount: 47, index: 7, group: 'old' }
      ]
    },
    {
      id: 'markData',
      source: 'table'
    }
  ],

  coordinates: [
    {
      id: 'coord',
      type: 'polar',
      dependency: ['viewBox'],
      start: (coord, params) => {
        return [params.viewBox.x1, params.viewBox.y1];
      },
      end: (coord, params) => {
        return [params.viewBox.x2, params.viewBox.y2];
      }
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'markData', field: 'category' },
      range: { coordinate: 'coord', dimension: 'x' },
      padding: 0.05
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'markData', field: 'amount' },
      range: { coordinate: 'coord', dimension: 'y' },
      nice: true
    },
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'group' },
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
      layout: {
        display: 'relative',
        updateViewSignals: true
      },

      marks: [
        {
          id: 'xAxis',
          type: 'component',
          layout: {
            position: 'auto'
          },
          componentType: 'axis',
          scale: 'xscale',
          dependency: ['yscale']
        },

        {
          id: 'yAxis',
          type: 'component',
          layout: {
            position: 'auto'
          },
          componentType: 'axis',
          tickCount: 5,
          scale: 'yscale'
        },

        {
          type: 'component',
          layout: {
            position: 'top'
          },
          componentType: 'legend',
          scale: 'colorScale',
          target: {
            data: 'markData',
            filter: 'amount'
          },
          dependency: ['viewBox'],
          encode: {
            update: (datum, el, params) => {
              return {
                x: params.viewBox.x1,
                y: 0,
                layout: 'horizontal'
              };
            }
          }
        },

        {
          type: 'interval',
          id: 'bar',
          layout: {
            position: 'content',
            skipBeforeLayouted: true
          },
          groupBy: 'group',
          coordinate: 'coord',
          from: { data: 'markData' },
          transform: [
            {
              type: 'dodge',
              maxWidth: 24
            }
          ],
          encode: {
            update: {
              x: { scale: 'xscale', field: 'category' },
              y: { scale: 'yscale', field: 'amount' },
              fill: { scale: 'colorScale', field: 'group' }
            },
            hover: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              cursor: 'pointer'
            }
          }
        },
        {
          type: 'text',
          id: 'text',
          layout: {
            position: 'content',
            skipBeforeLayouted: true
          },
          coordinate: 'coord',
          interactive: false,
          from: { data: 'markData' },
          groupBy: 'group',
          transform: [
            {
              type: 'dodge',
              maxWidth: 24
            }
          ],
          encode: {
            update: {
              textAlign: 'center',
              textBaseline: 'middle',
              fontSize: 10,
              x: { scale: 'xscale', field: 'category' },
              y: { scale: 'yscale', field: 'amount' },
              text: { field: 'amount' },
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
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        { category: 'A', amount: 28, index: 0, group: 'new' },
        { category: 'B', amount: 55, index: 1, group: 'new' },
        { category: 'C', amount: -43, index: 2, group: 'new' },
        { category: 'D', amount: 91, index: 3, group: 'new' },
        { category: 'E', amount: 81, index: 4, group: 'new' },
        { category: 'F', amount: 53, index: 5, group: 'new' },
        { category: 'G', amount: 19, index: 6, group: 'new' },
        { category: 'H', amount: 87, index: 7, group: 'new' },

        { category: 'A', amount: 28, index: 0, group: 'old' },
        { category: 'B', amount: 65, index: 1, group: 'old' },
        { category: 'C', amount: 43, index: 2, group: 'old' },
        { category: 'D', amount: 41, index: 3, group: 'old' },
        { category: 'E', amount: 61, index: 4, group: 'old' },
        { category: 'F', amount: 23, index: 5, group: 'old' },
        { category: 'G', amount: 39, index: 6, group: 'old' },
        { category: 'H', amount: 47, index: 7, group: 'old' }
      ]
    },
    {
      id: 'markData',
      source: 'table'
    }
  ],

  coordinates: [
    {
      id: 'coord',
      type: 'polar',
      dependency: ['viewBox'],
      start: (coord, params) => {
        return [params.viewBox.x1, params.viewBox.y1];
      },
      end: (coord, params) => {
        return [params.viewBox.x2, params.viewBox.y2];
      }
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'markData', field: 'category' },
      range: { coordinate: 'coord', dimension: 'x' },
      padding: 0.05
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'markData', field: 'amount' },
      range: { coordinate: 'coord', dimension: 'y' },
      nice: true
    },
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'group' },
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
      layout: {
        display: 'relative',
        updateViewSignals: true
      },

      marks: [
        {
          id: 'xAxis',
          type: 'component',
          layout: {
            position: 'auto'
          },
          componentType: 'axis',
          scale: 'xscale',
          dependency: ['yscale']
        },

        {
          id: 'yAxis',
          type: 'component',
          layout: {
            position: 'auto'
          },
          componentType: 'axis',
          tickCount: 5,
          scale: 'yscale'
        },

        {
          type: 'component',
          layout: {
            position: 'top'
          },
          componentType: 'legend',
          scale: 'colorScale',
          target: {
            data: 'markData',
            filter: 'amount'
          },
          dependency: ['viewBox'],
          encode: {
            update: (datum, el, params) => {
              return {
                x: params.viewBox.x1,
                y: 0,
                layout: 'horizontal'
              };
            }
          }
        },

        {
          type: 'interval',
          id: 'bar',
          layout: {
            position: 'content',
            skipBeforeLayouted: true
          },
          groupBy: 'group',
          coordinate: 'coord',
          from: { data: 'markData' },
          transform: [
            {
              type: 'dodge',
              maxWidth: 24
            }
          ],
          encode: {
            update: {
              x: { scale: 'xscale', field: 'category' },
              y: { scale: 'yscale', field: 'amount' },
              fill: { scale: 'colorScale', field: 'group' }
            },
            hover: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              cursor: 'pointer'
            }
          }
        },
        {
          type: 'text',
          id: 'text',
          layout: {
            position: 'content',
            skipBeforeLayouted: true
          },
          coordinate: 'coord',
          interactive: false,
          from: { data: 'markData' },
          groupBy: 'group',
          transform: [
            {
              type: 'dodge',
              maxWidth: 24
            }
          ],
          encode: {
            update: {
              textAlign: 'center',
              textBaseline: 'middle',
              fontSize: 10,
              x: { scale: 'xscale', field: 'category' },
              y: { scale: 'yscale', field: 'amount' },
              text: { field: 'amount' },
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
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        { category: 'A', amount: 28, index: 0, group: 'new' },
        { category: 'B', amount: 55, index: 1, group: 'new' },
        { category: 'C', amount: -43, index: 2, group: 'new' },
        { category: 'D', amount: 91, index: 3, group: 'new' },
        { category: 'E', amount: 81, index: 4, group: 'new' },
        { category: 'F', amount: 53, index: 5, group: 'new' },
        { category: 'G', amount: 19, index: 6, group: 'new' },
        { category: 'H', amount: 87, index: 7, group: 'new' },

        { category: 'A', amount: 28, index: 0, group: 'old' },
        { category: 'B', amount: 65, index: 1, group: 'old' },
        { category: 'C', amount: 43, index: 2, group: 'old' },
        { category: 'D', amount: 41, index: 3, group: 'old' },
        { category: 'E', amount: 61, index: 4, group: 'old' },
        { category: 'F', amount: 23, index: 5, group: 'old' },
        { category: 'G', amount: 39, index: 6, group: 'old' },
        { category: 'H', amount: 47, index: 7, group: 'old' }
      ]
    },
    {
      id: 'markData',
      source: 'table'
    }
  ],

  coordinates: [
    {
      id: 'coord',
      type: 'polar',
      dependency: ['viewBox'],
      start: (coord, params) => {
        return [params.viewBox.x1, params.viewBox.y1];
      },
      end: (coord, params) => {
        return [params.viewBox.x2, params.viewBox.y2];
      }
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'markData', field: 'category' },
      range: { coordinate: 'coord', dimension: 'x' },
      padding: 0.05
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'markData', field: 'amount' },
      range: { coordinate: 'coord', dimension: 'y' },
      nice: true
    },
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'group' },
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
      layout: {
        display: 'relative',
        updateViewSignals: true
      },

      marks: [
        {
          id: 'xAxis',
          type: 'component',
          layout: {
            position: 'auto'
          },
          componentType: 'axis',
          scale: 'xscale',
          dependency: ['yscale']
        },

        {
          id: 'yAxis',
          type: 'component',
          layout: {
            position: 'auto'
          },
          componentType: 'axis',
          tickCount: 5,
          scale: 'yscale'
        },

        {
          type: 'component',
          layout: {
            position: 'top'
          },
          componentType: 'legend',
          scale: 'colorScale',
          target: {
            data: 'markData',
            filter: 'amount'
          },
          dependency: ['viewBox'],
          encode: {
            update: (datum, el, params) => {
              return {
                x: params.viewBox.x1,
                y: 0,
                layout: 'horizontal'
              };
            }
          }
        },

        {
          type: 'interval',
          id: 'bar',
          layout: {
            position: 'content',
            skipBeforeLayouted: true
          },
          groupBy: 'group',
          coordinate: 'coord',
          from: { data: 'markData' },
          transform: [
            {
              type: 'dodge',
              maxWidth: 24
            }
          ],
          encode: {
            update: {
              x: { scale: 'xscale', field: 'category' },
              y: { scale: 'yscale', field: 'amount' },
              fill: { scale: 'colorScale', field: 'group' }
            },
            hover: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              cursor: 'pointer'
            }
          }
        },
        {
          type: 'text',
          id: 'text',
          layout: {
            position: 'content',
            skipBeforeLayouted: true
          },
          coordinate: 'coord',
          interactive: false,
          from: { data: 'markData' },
          groupBy: 'group',
          transform: [
            {
              type: 'dodge',
              maxWidth: 24
            }
          ],
          encode: {
            update: {
              textAlign: 'center',
              textBaseline: 'middle',
              fontSize: 10,
              x: { scale: 'xscale', field: 'category' },
              y: { scale: 'yscale', field: 'amount' },
              text: { field: 'amount' },
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

## 图例 (Legend)

图例组件主要用于呈现图表中不同数据系列的标识，帮助用户理解图表内容。对于不同类型的图表，如折线图、柱状图等，图例可以表示多种信息（如颜色、形状等）。

依据图例所对应的 Scale 形式的差异，目前 VGrammar 提供的图例包含三种：

- 离散图例：用于描述离散型 Scale；
- 颜色图例：用于描述连续的颜色型 Scale；
- 尺寸图例：用于描述连续的数值型 Scale。

图例组件的 componentType 为 `'legend'` ，同时 View 上也提供了 `View.legend()` 接口以便捷的创建一个图例。

不同类型图例的示例：

<div class="examples-ref-container" id="examples-ref-legend" data-path="component/legend"></div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

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
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
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
    },

    {
      id: 'continuousColor',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
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
      type: 'component',
      componentType: 'legend',
      scale: 'xscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            layout: 'horizontal',
            select: false
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'legend',
      scale: 'yscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: 40,
            layout: 'horizontal',
            select: false,
            sizeBackground: {
              fill: '#6690F2',
              fillOpacity: 0.5
            },
            railStyle: {
              fill: '#6690F2',
              fillOpacity: 0.5
            }
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'legend',
      scale: 'colorScale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: 80,
            layout: 'horizontal',
            select: false
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'legend',
      scale: 'continuousColor',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: 120,
            layout: 'horizontal',
            select: false
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

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

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
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
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
    },

    {
      id: 'continuousColor',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
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
      type: 'component',
      componentType: 'legend',
      scale: 'xscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            layout: 'horizontal',
            select: false
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'legend',
      scale: 'yscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: 40,
            layout: 'horizontal',
            select: false,
            sizeBackground: {
              fill: '#6690F2',
              fillOpacity: 0.5
            },
            railStyle: {
              fill: '#6690F2',
              fillOpacity: 0.5
            }
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'legend',
      scale: 'colorScale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: 80,
            layout: 'horizontal',
            select: false
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'legend',
      scale: 'continuousColor',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: 120,
            layout: 'horizontal',
            select: false
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

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

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
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
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
    },

    {
      id: 'continuousColor',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
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
      type: 'component',
      componentType: 'legend',
      scale: 'xscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            layout: 'horizontal',
            select: false
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'legend',
      scale: 'yscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: 40,
            layout: 'horizontal',
            select: false,
            sizeBackground: {
              fill: '#6690F2',
              fillOpacity: 0.5
            },
            railStyle: {
              fill: '#6690F2',
              fillOpacity: 0.5
            }
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'legend',
      scale: 'colorScale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: 80,
            layout: 'horizontal',
            select: false
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'legend',
      scale: 'continuousColor',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: 120,
            layout: 'horizontal',
            select: false
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

## 筛选器 (Slider)

筛选器是一种实现数据过滤和缩放的交互组件。用户通过拖动筛选器条，实现对数据范围的调整。用户可以通过拖动滑块间距和位置来控制数据范围。通过操作筛选器，用户可根据需要查看指定范围的数据。

筛选器组件的 componentType 为 `'slider'` ，同时 View 上也提供了 `View.slider()` 接口以便捷的创建一个筛选器。

筛选器的示例：

<div class="examples-ref-container" id="examples-ref-slider" data-path="component/slider"></div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 25, right: 20, bottom: 60, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          sepalLength: 5.1,
          sepalWidth: 3.5,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.7,
          sepalWidth: 3.2,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.1,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.6,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.9,
          petalLength: 1.7,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.4,
          petalLength: 1.4,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.4,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.4,
          sepalWidth: 2.9,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3.1,
          petalLength: 1.5,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.7,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3.4,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3,
          petalLength: 1.4,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 4.3,
          sepalWidth: 3,
          petalLength: 1.1,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 4,
          petalLength: 1.2,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 4.4,
          petalLength: 1.5,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.9,
          petalLength: 1.3,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.5,
          petalLength: 1.4,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 3.8,
          petalLength: 1.7,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.8,
          petalLength: 1.5,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.4,
          petalLength: 1.7,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.7,
          petalLength: 1.5,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.6,
          petalLength: 1,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.3,
          petalLength: 1.7,
          petalWidth: 0.5,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3.4,
          petalLength: 1.9,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.4,
          petalLength: 1.6,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 3.5,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 3.4,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.7,
          sepalWidth: 3.2,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3.1,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.4,
          petalLength: 1.5,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 4.1,
          petalLength: 1.5,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 4.2,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3.1,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.2,
          petalLength: 1.2,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 3.5,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3.6,
          petalLength: 1.4,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 4.4,
          sepalWidth: 3,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.4,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.5,
          petalLength: 1.3,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 4.5,
          sepalWidth: 2.3,
          petalLength: 1.3,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 4.4,
          sepalWidth: 3.2,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.5,
          petalLength: 1.6,
          petalWidth: 0.6,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.8,
          petalLength: 1.9,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3,
          petalLength: 1.4,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.8,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.2,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.3,
          sepalWidth: 3.7,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.3,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 7,
          sepalWidth: 3.2,
          petalLength: 4.7,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 3.2,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.1,
          petalLength: 4.9,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.3,
          petalLength: 4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 2.8,
          petalLength: 4.6,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.8,
          petalLength: 4.5,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 3.3,
          petalLength: 4.7,
          petalWidth: 1.6,
          species: 'versicolor'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 2.4,
          petalLength: 3.3,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 6.6,
          sepalWidth: 2.9,
          petalLength: 4.6,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 2.7,
          petalLength: 3.9,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5,
          sepalWidth: 2,
          petalLength: 3.5,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.9,
          sepalWidth: 3,
          petalLength: 4.2,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.2,
          petalLength: 4,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.9,
          petalLength: 4.7,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.9,
          petalLength: 3.6,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.1,
          petalLength: 4.4,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 3,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 4.1,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 2.2,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.5,
          petalLength: 3.9,
          petalWidth: 1.1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.9,
          sepalWidth: 3.2,
          petalLength: 4.8,
          petalWidth: 1.8,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.8,
          petalLength: 4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.5,
          petalLength: 4.9,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.8,
          petalLength: 4.7,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.9,
          petalLength: 4.3,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.6,
          sepalWidth: 3,
          petalLength: 4.4,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 6.8,
          sepalWidth: 2.8,
          petalLength: 4.8,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3,
          petalLength: 5,
          petalWidth: 1.7,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.9,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.6,
          petalLength: 3.5,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.4,
          petalLength: 3.8,
          petalWidth: 1.1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.4,
          petalLength: 3.7,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 3.9,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.7,
          petalLength: 5.1,
          petalWidth: 1.6,
          species: 'versicolor'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 3.4,
          petalLength: 4.5,
          petalWidth: 1.6,
          species: 'versicolor'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.1,
          petalLength: 4.7,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.3,
          petalLength: 4.4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 3,
          petalLength: 4.1,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.5,
          petalLength: 4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.6,
          petalLength: 4.4,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 3,
          petalLength: 4.6,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.6,
          petalLength: 4,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 5,
          sepalWidth: 2.3,
          petalLength: 3.3,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.7,
          petalLength: 4.2,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 3,
          petalLength: 4.2,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.9,
          petalLength: 4.2,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 2.9,
          petalLength: 4.3,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 2.5,
          petalLength: 3,
          petalWidth: 1.1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.8,
          petalLength: 4.1,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 3.3,
          petalLength: 6,
          petalWidth: 2.5,
          species: 'virginica'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 5.1,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 7.1,
          sepalWidth: 3,
          petalLength: 5.9,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.9,
          petalLength: 5.6,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3,
          petalLength: 5.8,
          petalWidth: 2.2,
          species: 'virginica'
        },
        {
          sepalLength: 7.6,
          sepalWidth: 3,
          petalLength: 6.6,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 2.5,
          petalLength: 4.5,
          petalWidth: 1.7,
          species: 'virginica'
        },
        {
          sepalLength: 7.3,
          sepalWidth: 2.9,
          petalLength: 6.3,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 2.5,
          petalLength: 5.8,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 7.2,
          sepalWidth: 3.6,
          petalLength: 6.1,
          petalWidth: 2.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3.2,
          petalLength: 5.1,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.7,
          petalLength: 5.3,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 6.8,
          sepalWidth: 3,
          petalLength: 5.5,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.5,
          petalLength: 5,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.8,
          petalLength: 5.1,
          petalWidth: 2.4,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 3.2,
          petalLength: 5.3,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3,
          petalLength: 5.5,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 3.8,
          petalLength: 6.7,
          petalWidth: 2.2,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 2.6,
          petalLength: 6.9,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.2,
          petalLength: 5,
          petalWidth: 1.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.2,
          petalLength: 5.7,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.8,
          petalLength: 4.9,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 2.8,
          petalLength: 6.7,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.7,
          petalLength: 4.9,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.3,
          petalLength: 5.7,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 7.2,
          sepalWidth: 3.2,
          petalLength: 6,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 2.8,
          petalLength: 4.8,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 3,
          petalLength: 4.9,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.8,
          petalLength: 5.6,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 7.2,
          sepalWidth: 3,
          petalLength: 5.8,
          petalWidth: 1.6,
          species: 'virginica'
        },
        {
          sepalLength: 7.4,
          sepalWidth: 2.8,
          petalLength: 6.1,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 7.9,
          sepalWidth: 3.8,
          petalLength: 6.4,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.8,
          petalLength: 5.6,
          petalWidth: 2.2,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.8,
          petalLength: 5.1,
          petalWidth: 1.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.6,
          petalLength: 5.6,
          petalWidth: 1.4,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 3,
          petalLength: 6.1,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 3.4,
          petalLength: 5.6,
          petalWidth: 2.4,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 3.1,
          petalLength: 5.5,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6,
          sepalWidth: 3,
          petalLength: 4.8,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.1,
          petalLength: 5.4,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.1,
          petalLength: 5.6,
          petalWidth: 2.4,
          species: 'virginica'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.1,
          petalLength: 5.1,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 5.1,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 6.8,
          sepalWidth: 3.2,
          petalLength: 5.9,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.3,
          petalLength: 5.7,
          petalWidth: 2.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3,
          petalLength: 5.2,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.5,
          petalLength: 5,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3,
          petalLength: 5.2,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 3.4,
          petalLength: 5.4,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 5.9,
          sepalWidth: 3,
          petalLength: 5.1,
          petalWidth: 1.8,
          species: 'virginica'
        }
      ]
    },
    {
      id: 'markData',
      source: 'table'
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      domain: { data: 'table', field: 'sepalWidth' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'sepalLength' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'species' },
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
    },
    {
      id: 'shape',
      type: 'ordinal',
      domain: { data: 'table', field: 'species' },
      range: ['circle', 'diamond', 'cross']
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
          crosshairShape: 'line',
          crosshairType: 'x',
          dependency: ['viewBox']
        },

        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'yscale',
          crosshairShape: 'line',
          crosshairType: 'y',
          dependency: ['viewBox']
        },

        {
          type: 'symbol',
          from: { data: 'markData' },
          encode: {
            update: {
              x: { scale: 'xscale', field: 'sepalWidth' },
              y: { scale: 'yscale', field: 'sepalLength' },
              size: 10,
              shape: { scale: 'shape', field: 'species' },
              fill: { scale: 'color', field: 'species' }
            },
            hover: {
              fill: 'red'
            }
          }
        }
      ]
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: params.viewBox.height() },
            end: { x: 0, y: 0 },
            verticalFactor: -1
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'legend',
      scale: 'color',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1 + params.viewBox.width() / 2 - 100,
            layout: 'horizontal',
            select: false
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'slider',
      dependency: ['yscale', 'viewBox'],
      target: { data: 'markData', filter: 'sepalLength' },
      min: (datum, element, params) => {
        return params.yscale.domain()[0];
      },
      max: (datum, element, params) => {
        return params.yscale.domain()[1];
      },
      encode: {
        update: (datum, element, params) => {
          return {
            x: 5,
            y: params.viewBox.y1,
            layout: 'vertical',
            railWidth: 10,
            railHeight: params.viewBox.height()
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'slider',
      dependency: ['xscale', 'viewBox'],
      target: { data: 'markData', filter: 'sepalWidth' },
      min: (datum, element, params) => {
        return params.xscale.domain()[0];
      },
      max: (datum, element, params) => {
        return params.xscale.domain()[1];
      },
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2 + 30,
            railWidth: params.viewBox.width(),
            railHeight: 10
          };
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
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
const spec = {
  padding: { top: 25, right: 20, bottom: 60, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          sepalLength: 5.1,
          sepalWidth: 3.5,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.7,
          sepalWidth: 3.2,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.1,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.6,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.9,
          petalLength: 1.7,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.4,
          petalLength: 1.4,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.4,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.4,
          sepalWidth: 2.9,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3.1,
          petalLength: 1.5,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.7,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3.4,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3,
          petalLength: 1.4,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 4.3,
          sepalWidth: 3,
          petalLength: 1.1,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 4,
          petalLength: 1.2,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 4.4,
          petalLength: 1.5,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.9,
          petalLength: 1.3,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.5,
          petalLength: 1.4,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 3.8,
          petalLength: 1.7,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.8,
          petalLength: 1.5,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.4,
          petalLength: 1.7,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.7,
          petalLength: 1.5,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.6,
          petalLength: 1,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.3,
          petalLength: 1.7,
          petalWidth: 0.5,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3.4,
          petalLength: 1.9,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.4,
          petalLength: 1.6,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 3.5,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 3.4,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.7,
          sepalWidth: 3.2,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3.1,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.4,
          petalLength: 1.5,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 4.1,
          petalLength: 1.5,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 4.2,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3.1,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.2,
          petalLength: 1.2,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 3.5,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3.6,
          petalLength: 1.4,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 4.4,
          sepalWidth: 3,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.4,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.5,
          petalLength: 1.3,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 4.5,
          sepalWidth: 2.3,
          petalLength: 1.3,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 4.4,
          sepalWidth: 3.2,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.5,
          petalLength: 1.6,
          petalWidth: 0.6,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.8,
          petalLength: 1.9,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3,
          petalLength: 1.4,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.8,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.2,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.3,
          sepalWidth: 3.7,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.3,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 7,
          sepalWidth: 3.2,
          petalLength: 4.7,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 3.2,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.1,
          petalLength: 4.9,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.3,
          petalLength: 4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 2.8,
          petalLength: 4.6,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.8,
          petalLength: 4.5,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 3.3,
          petalLength: 4.7,
          petalWidth: 1.6,
          species: 'versicolor'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 2.4,
          petalLength: 3.3,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 6.6,
          sepalWidth: 2.9,
          petalLength: 4.6,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 2.7,
          petalLength: 3.9,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5,
          sepalWidth: 2,
          petalLength: 3.5,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.9,
          sepalWidth: 3,
          petalLength: 4.2,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.2,
          petalLength: 4,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.9,
          petalLength: 4.7,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.9,
          petalLength: 3.6,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.1,
          petalLength: 4.4,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 3,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 4.1,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 2.2,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.5,
          petalLength: 3.9,
          petalWidth: 1.1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.9,
          sepalWidth: 3.2,
          petalLength: 4.8,
          petalWidth: 1.8,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.8,
          petalLength: 4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.5,
          petalLength: 4.9,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.8,
          petalLength: 4.7,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.9,
          petalLength: 4.3,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.6,
          sepalWidth: 3,
          petalLength: 4.4,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 6.8,
          sepalWidth: 2.8,
          petalLength: 4.8,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3,
          petalLength: 5,
          petalWidth: 1.7,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.9,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.6,
          petalLength: 3.5,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.4,
          petalLength: 3.8,
          petalWidth: 1.1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.4,
          petalLength: 3.7,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 3.9,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.7,
          petalLength: 5.1,
          petalWidth: 1.6,
          species: 'versicolor'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 3.4,
          petalLength: 4.5,
          petalWidth: 1.6,
          species: 'versicolor'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.1,
          petalLength: 4.7,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.3,
          petalLength: 4.4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 3,
          petalLength: 4.1,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.5,
          petalLength: 4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.6,
          petalLength: 4.4,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 3,
          petalLength: 4.6,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.6,
          petalLength: 4,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 5,
          sepalWidth: 2.3,
          petalLength: 3.3,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.7,
          petalLength: 4.2,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 3,
          petalLength: 4.2,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.9,
          petalLength: 4.2,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 2.9,
          petalLength: 4.3,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 2.5,
          petalLength: 3,
          petalWidth: 1.1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.8,
          petalLength: 4.1,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 3.3,
          petalLength: 6,
          petalWidth: 2.5,
          species: 'virginica'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 5.1,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 7.1,
          sepalWidth: 3,
          petalLength: 5.9,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.9,
          petalLength: 5.6,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3,
          petalLength: 5.8,
          petalWidth: 2.2,
          species: 'virginica'
        },
        {
          sepalLength: 7.6,
          sepalWidth: 3,
          petalLength: 6.6,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 2.5,
          petalLength: 4.5,
          petalWidth: 1.7,
          species: 'virginica'
        },
        {
          sepalLength: 7.3,
          sepalWidth: 2.9,
          petalLength: 6.3,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 2.5,
          petalLength: 5.8,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 7.2,
          sepalWidth: 3.6,
          petalLength: 6.1,
          petalWidth: 2.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3.2,
          petalLength: 5.1,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.7,
          petalLength: 5.3,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 6.8,
          sepalWidth: 3,
          petalLength: 5.5,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.5,
          petalLength: 5,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.8,
          petalLength: 5.1,
          petalWidth: 2.4,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 3.2,
          petalLength: 5.3,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3,
          petalLength: 5.5,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 3.8,
          petalLength: 6.7,
          petalWidth: 2.2,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 2.6,
          petalLength: 6.9,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.2,
          petalLength: 5,
          petalWidth: 1.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.2,
          petalLength: 5.7,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.8,
          petalLength: 4.9,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 2.8,
          petalLength: 6.7,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.7,
          petalLength: 4.9,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.3,
          petalLength: 5.7,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 7.2,
          sepalWidth: 3.2,
          petalLength: 6,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 2.8,
          petalLength: 4.8,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 3,
          petalLength: 4.9,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.8,
          petalLength: 5.6,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 7.2,
          sepalWidth: 3,
          petalLength: 5.8,
          petalWidth: 1.6,
          species: 'virginica'
        },
        {
          sepalLength: 7.4,
          sepalWidth: 2.8,
          petalLength: 6.1,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 7.9,
          sepalWidth: 3.8,
          petalLength: 6.4,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.8,
          petalLength: 5.6,
          petalWidth: 2.2,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.8,
          petalLength: 5.1,
          petalWidth: 1.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.6,
          petalLength: 5.6,
          petalWidth: 1.4,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 3,
          petalLength: 6.1,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 3.4,
          petalLength: 5.6,
          petalWidth: 2.4,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 3.1,
          petalLength: 5.5,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6,
          sepalWidth: 3,
          petalLength: 4.8,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.1,
          petalLength: 5.4,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.1,
          petalLength: 5.6,
          petalWidth: 2.4,
          species: 'virginica'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.1,
          petalLength: 5.1,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 5.1,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 6.8,
          sepalWidth: 3.2,
          petalLength: 5.9,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.3,
          petalLength: 5.7,
          petalWidth: 2.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3,
          petalLength: 5.2,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.5,
          petalLength: 5,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3,
          petalLength: 5.2,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 3.4,
          petalLength: 5.4,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 5.9,
          sepalWidth: 3,
          petalLength: 5.1,
          petalWidth: 1.8,
          species: 'virginica'
        }
      ]
    },
    {
      id: 'markData',
      source: 'table'
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      domain: { data: 'table', field: 'sepalWidth' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'sepalLength' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'species' },
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
    },
    {
      id: 'shape',
      type: 'ordinal',
      domain: { data: 'table', field: 'species' },
      range: ['circle', 'diamond', 'cross']
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
          crosshairShape: 'line',
          crosshairType: 'x',
          dependency: ['viewBox']
        },

        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'yscale',
          crosshairShape: 'line',
          crosshairType: 'y',
          dependency: ['viewBox']
        },

        {
          type: 'symbol',
          from: { data: 'markData' },
          encode: {
            update: {
              x: { scale: 'xscale', field: 'sepalWidth' },
              y: { scale: 'yscale', field: 'sepalLength' },
              size: 10,
              shape: { scale: 'shape', field: 'species' },
              fill: { scale: 'color', field: 'species' }
            },
            hover: {
              fill: 'red'
            }
          }
        }
      ]
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: params.viewBox.height() },
            end: { x: 0, y: 0 },
            verticalFactor: -1
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'legend',
      scale: 'color',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1 + params.viewBox.width() / 2 - 100,
            layout: 'horizontal',
            select: false
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'slider',
      dependency: ['yscale', 'viewBox'],
      target: { data: 'markData', filter: 'sepalLength' },
      min: (datum, element, params) => {
        return params.yscale.domain()[0];
      },
      max: (datum, element, params) => {
        return params.yscale.domain()[1];
      },
      encode: {
        update: (datum, element, params) => {
          return {
            x: 5,
            y: params.viewBox.y1,
            layout: 'vertical',
            railWidth: 10,
            railHeight: params.viewBox.height()
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'slider',
      dependency: ['xscale', 'viewBox'],
      target: { data: 'markData', filter: 'sepalWidth' },
      min: (datum, element, params) => {
        return params.xscale.domain()[0];
      },
      max: (datum, element, params) => {
        return params.xscale.domain()[1];
      },
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2 + 30,
            railWidth: params.viewBox.width(),
            railHeight: 10
          };
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
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
const spec = {
  padding: { top: 25, right: 20, bottom: 60, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          sepalLength: 5.1,
          sepalWidth: 3.5,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.7,
          sepalWidth: 3.2,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.1,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.6,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.9,
          petalLength: 1.7,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.4,
          petalLength: 1.4,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.4,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.4,
          sepalWidth: 2.9,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3.1,
          petalLength: 1.5,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.7,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3.4,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3,
          petalLength: 1.4,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 4.3,
          sepalWidth: 3,
          petalLength: 1.1,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 4,
          petalLength: 1.2,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 4.4,
          petalLength: 1.5,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.9,
          petalLength: 1.3,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.5,
          petalLength: 1.4,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 3.8,
          petalLength: 1.7,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.8,
          petalLength: 1.5,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.4,
          petalLength: 1.7,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.7,
          petalLength: 1.5,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.6,
          petalLength: 1,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.3,
          petalLength: 1.7,
          petalWidth: 0.5,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3.4,
          petalLength: 1.9,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.4,
          petalLength: 1.6,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 3.5,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 3.4,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.7,
          sepalWidth: 3.2,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3.1,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.4,
          petalLength: 1.5,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 4.1,
          petalLength: 1.5,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 4.2,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3.1,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.2,
          petalLength: 1.2,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 3.5,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3.6,
          petalLength: 1.4,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 4.4,
          sepalWidth: 3,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.4,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.5,
          petalLength: 1.3,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 4.5,
          sepalWidth: 2.3,
          petalLength: 1.3,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 4.4,
          sepalWidth: 3.2,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.5,
          petalLength: 1.6,
          petalWidth: 0.6,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.8,
          petalLength: 1.9,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3,
          petalLength: 1.4,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.8,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.2,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.3,
          sepalWidth: 3.7,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.3,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 7,
          sepalWidth: 3.2,
          petalLength: 4.7,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 3.2,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.1,
          petalLength: 4.9,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.3,
          petalLength: 4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 2.8,
          petalLength: 4.6,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.8,
          petalLength: 4.5,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 3.3,
          petalLength: 4.7,
          petalWidth: 1.6,
          species: 'versicolor'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 2.4,
          petalLength: 3.3,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 6.6,
          sepalWidth: 2.9,
          petalLength: 4.6,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 2.7,
          petalLength: 3.9,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5,
          sepalWidth: 2,
          petalLength: 3.5,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.9,
          sepalWidth: 3,
          petalLength: 4.2,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.2,
          petalLength: 4,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.9,
          petalLength: 4.7,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.9,
          petalLength: 3.6,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.1,
          petalLength: 4.4,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 3,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 4.1,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 2.2,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.5,
          petalLength: 3.9,
          petalWidth: 1.1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.9,
          sepalWidth: 3.2,
          petalLength: 4.8,
          petalWidth: 1.8,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.8,
          petalLength: 4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.5,
          petalLength: 4.9,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.8,
          petalLength: 4.7,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.9,
          petalLength: 4.3,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.6,
          sepalWidth: 3,
          petalLength: 4.4,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 6.8,
          sepalWidth: 2.8,
          petalLength: 4.8,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3,
          petalLength: 5,
          petalWidth: 1.7,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.9,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.6,
          petalLength: 3.5,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.4,
          petalLength: 3.8,
          petalWidth: 1.1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.4,
          petalLength: 3.7,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 3.9,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.7,
          petalLength: 5.1,
          petalWidth: 1.6,
          species: 'versicolor'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 3.4,
          petalLength: 4.5,
          petalWidth: 1.6,
          species: 'versicolor'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.1,
          petalLength: 4.7,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.3,
          petalLength: 4.4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 3,
          petalLength: 4.1,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.5,
          petalLength: 4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.6,
          petalLength: 4.4,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 3,
          petalLength: 4.6,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.6,
          petalLength: 4,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 5,
          sepalWidth: 2.3,
          petalLength: 3.3,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.7,
          petalLength: 4.2,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 3,
          petalLength: 4.2,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.9,
          petalLength: 4.2,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 2.9,
          petalLength: 4.3,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 2.5,
          petalLength: 3,
          petalWidth: 1.1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.8,
          petalLength: 4.1,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 3.3,
          petalLength: 6,
          petalWidth: 2.5,
          species: 'virginica'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 5.1,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 7.1,
          sepalWidth: 3,
          petalLength: 5.9,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.9,
          petalLength: 5.6,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3,
          petalLength: 5.8,
          petalWidth: 2.2,
          species: 'virginica'
        },
        {
          sepalLength: 7.6,
          sepalWidth: 3,
          petalLength: 6.6,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 2.5,
          petalLength: 4.5,
          petalWidth: 1.7,
          species: 'virginica'
        },
        {
          sepalLength: 7.3,
          sepalWidth: 2.9,
          petalLength: 6.3,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 2.5,
          petalLength: 5.8,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 7.2,
          sepalWidth: 3.6,
          petalLength: 6.1,
          petalWidth: 2.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3.2,
          petalLength: 5.1,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.7,
          petalLength: 5.3,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 6.8,
          sepalWidth: 3,
          petalLength: 5.5,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.5,
          petalLength: 5,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.8,
          petalLength: 5.1,
          petalWidth: 2.4,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 3.2,
          petalLength: 5.3,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3,
          petalLength: 5.5,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 3.8,
          petalLength: 6.7,
          petalWidth: 2.2,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 2.6,
          petalLength: 6.9,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.2,
          petalLength: 5,
          petalWidth: 1.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.2,
          petalLength: 5.7,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.8,
          petalLength: 4.9,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 2.8,
          petalLength: 6.7,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.7,
          petalLength: 4.9,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.3,
          petalLength: 5.7,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 7.2,
          sepalWidth: 3.2,
          petalLength: 6,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 2.8,
          petalLength: 4.8,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 3,
          petalLength: 4.9,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.8,
          petalLength: 5.6,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 7.2,
          sepalWidth: 3,
          petalLength: 5.8,
          petalWidth: 1.6,
          species: 'virginica'
        },
        {
          sepalLength: 7.4,
          sepalWidth: 2.8,
          petalLength: 6.1,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 7.9,
          sepalWidth: 3.8,
          petalLength: 6.4,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.8,
          petalLength: 5.6,
          petalWidth: 2.2,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.8,
          petalLength: 5.1,
          petalWidth: 1.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.6,
          petalLength: 5.6,
          petalWidth: 1.4,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 3,
          petalLength: 6.1,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 3.4,
          petalLength: 5.6,
          petalWidth: 2.4,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 3.1,
          petalLength: 5.5,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6,
          sepalWidth: 3,
          petalLength: 4.8,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.1,
          petalLength: 5.4,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.1,
          petalLength: 5.6,
          petalWidth: 2.4,
          species: 'virginica'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.1,
          petalLength: 5.1,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 5.1,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 6.8,
          sepalWidth: 3.2,
          petalLength: 5.9,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.3,
          petalLength: 5.7,
          petalWidth: 2.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3,
          petalLength: 5.2,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.5,
          petalLength: 5,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3,
          petalLength: 5.2,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 3.4,
          petalLength: 5.4,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 5.9,
          sepalWidth: 3,
          petalLength: 5.1,
          petalWidth: 1.8,
          species: 'virginica'
        }
      ]
    },
    {
      id: 'markData',
      source: 'table'
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      domain: { data: 'table', field: 'sepalWidth' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'sepalLength' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'species' },
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
    },
    {
      id: 'shape',
      type: 'ordinal',
      domain: { data: 'table', field: 'species' },
      range: ['circle', 'diamond', 'cross']
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
          crosshairShape: 'line',
          crosshairType: 'x',
          dependency: ['viewBox']
        },

        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'yscale',
          crosshairShape: 'line',
          crosshairType: 'y',
          dependency: ['viewBox']
        },

        {
          type: 'symbol',
          from: { data: 'markData' },
          encode: {
            update: {
              x: { scale: 'xscale', field: 'sepalWidth' },
              y: { scale: 'yscale', field: 'sepalLength' },
              size: 10,
              shape: { scale: 'shape', field: 'species' },
              fill: { scale: 'color', field: 'species' }
            },
            hover: {
              fill: 'red'
            }
          }
        }
      ]
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: params.viewBox.height() },
            end: { x: 0, y: 0 },
            verticalFactor: -1
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'legend',
      scale: 'color',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1 + params.viewBox.width() / 2 - 100,
            layout: 'horizontal',
            select: false
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'slider',
      dependency: ['yscale', 'viewBox'],
      target: { data: 'markData', filter: 'sepalLength' },
      min: (datum, element, params) => {
        return params.yscale.domain()[0];
      },
      max: (datum, element, params) => {
        return params.yscale.domain()[1];
      },
      encode: {
        update: (datum, element, params) => {
          return {
            x: 5,
            y: params.viewBox.y1,
            layout: 'vertical',
            railWidth: 10,
            railHeight: params.viewBox.height()
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'slider',
      dependency: ['xscale', 'viewBox'],
      target: { data: 'markData', filter: 'sepalWidth' },
      min: (datum, element, params) => {
        return params.xscale.domain()[0];
      },
      max: (datum, element, params) => {
        return params.xscale.domain()[1];
      },
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2 + 30,
            railWidth: params.viewBox.width(),
            railHeight: 10
          };
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 缩略轴 (Datazoom)

缩略轴用于在较长的数据序列中进行局部查看。它可以方便地放大和缩小数据可视化范围，并提供一个较为直观的交互体验。通过设置缩略轴，用户可以更轻松地查看或筛选感兴趣的信息，提高数据分析效率。

缩略轴组件的 componentType 为 `'datazoom'` ，同时 View 上也提供了 `View.datazoom()` 接口以便捷的创建一个缩略轴。

缩略轴的示例：

<div class="examples-ref-container" id="examples-ref-dataZoom" data-path="component/dataZoom"></div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 80, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          time: '2:00',
          value: 8
        },
        {
          time: '4:00',
          value: 9
        },
        {
          time: '6:00',
          value: 11
        },
        {
          time: '8:00',
          value: 14
        },
        {
          time: '10:00',
          value: 16
        },
        {
          time: '12:00',
          value: 17
        },
        {
          time: '14:00',
          value: 17
        },
        {
          time: '16:00',
          value: 16
        },
        {
          time: '18:00',
          value: 15
        }
      ]
    },
    {
      id: 'markData',
      source: 'table'
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'point',
      domain: { data: 'markData', field: 'time' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'markData', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      zero: true
    },

    {
      id: 'dataZoomXScale',
      type: 'point',
      domain: { data: 'table', field: 'time' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'dataZoomYScale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2 + 80, params.viewBox.y2 + 30];
      },
      zero: true
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      tickCount: -1,
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'line',
      crosshairType: 'x',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            start: { y: params.viewBox.y1 },
            end: { y: params.viewBox.y2 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: params.viewBox.height() },
            end: { x: 0, y: 0 },
            verticalFactor: -1
          };
        }
      }
    },
    {
      type: 'line',
      from: { data: 'markData' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' },
          stroke: '#6690F2'
        },
        hover: {
          stroke: 'red',
          lineWidth: 2
        }
      }
    },
    {
      type: 'symbol',
      from: { data: 'markData' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' },
          fill: '#6690F2'
        },
        hover: {
          fill: 'red',
          lineWidth: 2
        }
      }
    },
    {
      type: 'component',
      componentType: 'datazoom',
      target: {
        data: 'markData',
        filter: 'time'
      },
      dependency: ['viewBox'],
      preview: {
        data: 'table',
        x: { scale: 'dataZoomXScale', field: 'time' },
        y: { scale: 'dataZoomYScale', field: 'value' }
      },
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2 + 30,
            size: { width: params.viewBox.width() },
            start: 0,
            end: 1
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

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 80, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          time: '2:00',
          value: 8
        },
        {
          time: '4:00',
          value: 9
        },
        {
          time: '6:00',
          value: 11
        },
        {
          time: '8:00',
          value: 14
        },
        {
          time: '10:00',
          value: 16
        },
        {
          time: '12:00',
          value: 17
        },
        {
          time: '14:00',
          value: 17
        },
        {
          time: '16:00',
          value: 16
        },
        {
          time: '18:00',
          value: 15
        }
      ]
    },
    {
      id: 'markData',
      source: 'table'
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'point',
      domain: { data: 'markData', field: 'time' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'markData', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      zero: true
    },

    {
      id: 'dataZoomXScale',
      type: 'point',
      domain: { data: 'table', field: 'time' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'dataZoomYScale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2 + 80, params.viewBox.y2 + 30];
      },
      zero: true
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      tickCount: -1,
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'line',
      crosshairType: 'x',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            start: { y: params.viewBox.y1 },
            end: { y: params.viewBox.y2 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: params.viewBox.height() },
            end: { x: 0, y: 0 },
            verticalFactor: -1
          };
        }
      }
    },
    {
      type: 'line',
      from: { data: 'markData' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' },
          stroke: '#6690F2'
        },
        hover: {
          stroke: 'red',
          lineWidth: 2
        }
      }
    },
    {
      type: 'symbol',
      from: { data: 'markData' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' },
          fill: '#6690F2'
        },
        hover: {
          fill: 'red',
          lineWidth: 2
        }
      }
    },
    {
      type: 'component',
      componentType: 'datazoom',
      target: {
        data: 'markData',
        filter: 'time'
      },
      dependency: ['viewBox'],
      preview: {
        data: 'table',
        x: { scale: 'dataZoomXScale', field: 'time' },
        y: { scale: 'dataZoomYScale', field: 'value' }
      },
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2 + 30,
            size: { width: params.viewBox.width() },
            start: 0,
            end: 1
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

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 80, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          time: '2:00',
          value: 8
        },
        {
          time: '4:00',
          value: 9
        },
        {
          time: '6:00',
          value: 11
        },
        {
          time: '8:00',
          value: 14
        },
        {
          time: '10:00',
          value: 16
        },
        {
          time: '12:00',
          value: 17
        },
        {
          time: '14:00',
          value: 17
        },
        {
          time: '16:00',
          value: 16
        },
        {
          time: '18:00',
          value: 15
        }
      ]
    },
    {
      id: 'markData',
      source: 'table'
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'point',
      domain: { data: 'markData', field: 'time' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'markData', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      zero: true
    },

    {
      id: 'dataZoomXScale',
      type: 'point',
      domain: { data: 'table', field: 'time' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'dataZoomYScale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2 + 80, params.viewBox.y2 + 30];
      },
      zero: true
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      tickCount: -1,
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'line',
      crosshairType: 'x',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            start: { y: params.viewBox.y1 },
            end: { y: params.viewBox.y2 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: params.viewBox.height() },
            end: { x: 0, y: 0 },
            verticalFactor: -1
          };
        }
      }
    },
    {
      type: 'line',
      from: { data: 'markData' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' },
          stroke: '#6690F2'
        },
        hover: {
          stroke: 'red',
          lineWidth: 2
        }
      }
    },
    {
      type: 'symbol',
      from: { data: 'markData' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' },
          fill: '#6690F2'
        },
        hover: {
          fill: 'red',
          lineWidth: 2
        }
      }
    },
    {
      type: 'component',
      componentType: 'datazoom',
      target: {
        data: 'markData',
        filter: 'time'
      },
      dependency: ['viewBox'],
      preview: {
        data: 'table',
        x: { scale: 'dataZoomXScale', field: 'time' },
        y: { scale: 'dataZoomYScale', field: 'value' }
      },
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2 + 30,
            size: { width: params.viewBox.width() },
            start: 0,
            end: 1
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

## 标签 (Label)

标签通常用于向可视化图形元素添加文字说明，帮助用户快速了解数据点的具体信息。

标签组件的 componentType 为 `'label'` ，同时 View 上也提供了 `View.label()` 接口以便捷的创建标签。

标签的示例：

<div class="examples-ref-container" id="examples-ref-label" data-path="component/label"></div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

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
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
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
          componentType: 'axis',
          scale: 'xscale',
          tickCount: -1,
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: params.viewBox.height(),
                start: { x: 0, y: 0 },
                end: { x: params.viewBox.width(), y: 0 }
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'axis',
          scale: 'yscale',
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: 0,
                start: { x: 0, y: params.viewBox.height() },
                end: { x: 0, y: 0 },
                verticalFactor: -1
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'xscale',
          crosshairShape: 'rect',
          crosshairType: 'x'
        },
        {
          type: 'rect',
          id: 'rect',
          from: { data: 'table' },
          dependency: ['yscale'],
          encode: {
            update: {
              x: { scale: 'xscale', field: 'name', band: 0.25 },
              width: { scale: 'xscale', band: 0.5 },
              y: { scale: 'yscale', field: 'value' },
              y1: (datum, element, params) => {
                return params.yscale.scale(params.yscale.domain()[0]);
              },
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
        },
        {
          type: 'component',
          componentType: 'label',
          target: 'rect',
          // labelStyle: {
          //   textStyle: {
          //     fontSize: 12,
          //     fill: '#999'
          //   }
          // },
          encode: {
            update: {
              text: datum => `${datum.value}`
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
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

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
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
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
          componentType: 'axis',
          scale: 'xscale',
          tickCount: -1,
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: params.viewBox.height(),
                start: { x: 0, y: 0 },
                end: { x: params.viewBox.width(), y: 0 }
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'axis',
          scale: 'yscale',
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: 0,
                start: { x: 0, y: params.viewBox.height() },
                end: { x: 0, y: 0 },
                verticalFactor: -1
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'xscale',
          crosshairShape: 'rect',
          crosshairType: 'x'
        },
        {
          type: 'rect',
          id: 'rect',
          from: { data: 'table' },
          dependency: ['yscale'],
          encode: {
            update: {
              x: { scale: 'xscale', field: 'name', band: 0.25 },
              width: { scale: 'xscale', band: 0.5 },
              y: { scale: 'yscale', field: 'value' },
              y1: (datum, element, params) => {
                return params.yscale.scale(params.yscale.domain()[0]);
              },
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
        },
        {
          type: 'component',
          componentType: 'label',
          target: 'rect',
          // labelStyle: {
          //   textStyle: {
          //     fontSize: 12,
          //     fill: '#999'
          //   }
          // },
          encode: {
            update: {
              text: datum => `${datum.value}`
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
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

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
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
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
          componentType: 'axis',
          scale: 'xscale',
          tickCount: -1,
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: params.viewBox.height(),
                start: { x: 0, y: 0 },
                end: { x: params.viewBox.width(), y: 0 }
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'axis',
          scale: 'yscale',
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: 0,
                start: { x: 0, y: params.viewBox.height() },
                end: { x: 0, y: 0 },
                verticalFactor: -1
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'xscale',
          crosshairShape: 'rect',
          crosshairType: 'x'
        },
        {
          type: 'rect',
          id: 'rect',
          from: { data: 'table' },
          dependency: ['yscale'],
          encode: {
            update: {
              x: { scale: 'xscale', field: 'name', band: 0.25 },
              width: { scale: 'xscale', band: 0.5 },
              y: { scale: 'yscale', field: 'value' },
              y1: (datum, element, params) => {
                return params.yscale.scale(params.yscale.domain()[0]);
              },
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
        },
        {
          type: 'component',
          componentType: 'label',
          target: 'rect',
          // labelStyle: {
          //   textStyle: {
          //     fontSize: 12,
          //     fill: '#999'
          //   }
          // },
          encode: {
            update: {
              text: datum => `${datum.value}`
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

## 播放器 (Player)

在可视化场景中，有时需要展示数据随时间变化的过程。通过使用放器功能，用户可以通过时间线轴观察数据的动态变化。

播放器组件的 componentType 为 `'player'` ，同时 View 上也提供了 `View.player()` 接口以便捷的创建一个播放器。

播放器的示例：

<div class="examples-ref-container" id="examples-ref-player" data-path="component/player"></div>

```javascript livedemo template=vgrammar
const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  padding: { top: 5, right: 5, bottom: 50, left: 60 }
});
const data = vGrammarView
  .data([
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
    }
  ])
  .id('table');

const xScale = vGrammarView
  .scale('band')
  .id('xscale')
  .domain({ data, field: 'name' })
  .depend(['viewBox'])
  .range((scale, params) => {
    return [0, params.viewBox.width()];
  })
  .configure({ padding: 0.05, round: true });

const yScale = vGrammarView
  .scale('linear')
  .id('yscale')
  .domain({ data, field: 'value' })
  .depend(['viewBox'])
  .range((scale, params) => {
    return [params.viewBox.height(), 0];
  })
  .configure({ nice: true });

const group = vGrammarView
  .group(vGrammarView.rootMark)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: params.viewBox.x1,
      y: params.viewBox.y1,
      width: params.viewBox.width(),
      height: params.viewBox.height()
    };
  });

const xAxis = vGrammarView
  .axis(group)
  .scale(xScale)
  .tickCount(-1)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: 0,
      y: params.viewBox.height(),
      start: { x: 0, y: 0 },
      end: { x: params.viewBox.width(), y: 0 }
    };
  });
const yAxis = vGrammarView
  .axis(group)
  .scale(yScale)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: 0,
      y: 0,
      start: { x: 0, y: params.viewBox.height() },
      end: { x: 0, y: 0 },
      verticalFactor: -1
    };
  });

const rect = vGrammarView
  .mark('rect', group)
  .join(data)
  .depend(['yscale'])
  .encode({
    x: { scale: 'xscale', field: 'name', band: 0.25 },
    width: { scale: 'xscale', band: 0.5 },
    y: { scale: 'yscale', field: 'value' },
    y1: (datum, element, params) => {
      return params.yscale.scale(params.yscale.domain()[0]);
    },
    fill: '#6690F2'
  })
  .encodeState('hover', 'fill', 'red');

const player = vGrammarView
  .player(group)
  .playerType('discrete')
  .depend([data, 'viewBox'])
  .encode((datum, el, params) => {
    return {
      x: 0,
      y: params.viewBox.y2 + 20,
      size: { width: params.viewBox.width() },
      interval: 1000,
      data: params.table,
      controller: {
        forward: { style: { visible: false, size: 0 } },
        backward: { style: { visible: false, size: 0 } }
      }
    };
  });

let animate;

player.on('onPlay', a => {
  if (!animate) {
    animate = rect.animate.run({
      type: 'growHeightIn',
      duration: 1000,
      easing: 'linear',
      oneByOne: true,
      options: { orient: 'negative' }
    });
  } else {
    rect.animate.resume();
  }
});

player.on('onPause', a => {
  rect.animate.pause();
});

rect.on('animationEnd', () => {
  animate = null;
});

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

```javascript livedemo template=vgrammar
const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  padding: { top: 5, right: 5, bottom: 50, left: 60 }
});
const data = vGrammarView
  .data([
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
    }
  ])
  .id('table');

const xScale = vGrammarView
  .scale('band')
  .id('xscale')
  .domain({ data, field: 'name' })
  .depend(['viewBox'])
  .range((scale, params) => {
    return [0, params.viewBox.width()];
  })
  .configure({ padding: 0.05, round: true });

const yScale = vGrammarView
  .scale('linear')
  .id('yscale')
  .domain({ data, field: 'value' })
  .depend(['viewBox'])
  .range((scale, params) => {
    return [params.viewBox.height(), 0];
  })
  .configure({ nice: true });

const group = vGrammarView
  .group(vGrammarView.rootMark)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: params.viewBox.x1,
      y: params.viewBox.y1,
      width: params.viewBox.width(),
      height: params.viewBox.height()
    };
  });

const xAxis = vGrammarView
  .axis(group)
  .scale(xScale)
  .tickCount(-1)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: 0,
      y: params.viewBox.height(),
      start: { x: 0, y: 0 },
      end: { x: params.viewBox.width(), y: 0 }
    };
  });
const yAxis = vGrammarView
  .axis(group)
  .scale(yScale)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: 0,
      y: 0,
      start: { x: 0, y: params.viewBox.height() },
      end: { x: 0, y: 0 },
      verticalFactor: -1
    };
  });

const rect = vGrammarView
  .mark('rect', group)
  .join(data)
  .depend(['yscale'])
  .encode({
    x: { scale: 'xscale', field: 'name', band: 0.25 },
    width: { scale: 'xscale', band: 0.5 },
    y: { scale: 'yscale', field: 'value' },
    y1: (datum, element, params) => {
      return params.yscale.scale(params.yscale.domain()[0]);
    },
    fill: '#6690F2'
  })
  .encodeState('hover', 'fill', 'red');

const player = vGrammarView
  .player(group)
  .playerType('discrete')
  .depend([data, 'viewBox'])
  .encode((datum, el, params) => {
    return {
      x: 0,
      y: params.viewBox.y2 + 20,
      size: { width: params.viewBox.width() },
      interval: 1000,
      data: params.table,
      controller: {
        forward: { style: { visible: false, size: 0 } },
        backward: { style: { visible: false, size: 0 } }
      }
    };
  });

let animate;

player.on('onPlay', a => {
  if (!animate) {
    animate = rect.animate.run({
      type: 'growHeightIn',
      duration: 1000,
      easing: 'linear',
      oneByOne: true,
      options: { orient: 'negative' }
    });
  } else {
    rect.animate.resume();
  }
});

player.on('onPause', a => {
  rect.animate.pause();
});

rect.on('animationEnd', () => {
  animate = null;
});

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

```javascript livedemo template=vgrammar
const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  padding: { top: 5, right: 5, bottom: 50, left: 60 }
});
const data = vGrammarView
  .data([
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
    }
  ])
  .id('table');

const xScale = vGrammarView
  .scale('band')
  .id('xscale')
  .domain({ data, field: 'name' })
  .depend(['viewBox'])
  .range((scale, params) => {
    return [0, params.viewBox.width()];
  })
  .configure({ padding: 0.05, round: true });

const yScale = vGrammarView
  .scale('linear')
  .id('yscale')
  .domain({ data, field: 'value' })
  .depend(['viewBox'])
  .range((scale, params) => {
    return [params.viewBox.height(), 0];
  })
  .configure({ nice: true });

const group = vGrammarView
  .group(vGrammarView.rootMark)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: params.viewBox.x1,
      y: params.viewBox.y1,
      width: params.viewBox.width(),
      height: params.viewBox.height()
    };
  });

const xAxis = vGrammarView
  .axis(group)
  .scale(xScale)
  .tickCount(-1)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: 0,
      y: params.viewBox.height(),
      start: { x: 0, y: 0 },
      end: { x: params.viewBox.width(), y: 0 }
    };
  });
const yAxis = vGrammarView
  .axis(group)
  .scale(yScale)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: 0,
      y: 0,
      start: { x: 0, y: params.viewBox.height() },
      end: { x: 0, y: 0 },
      verticalFactor: -1
    };
  });

const rect = vGrammarView
  .mark('rect', group)
  .join(data)
  .depend(['yscale'])
  .encode({
    x: { scale: 'xscale', field: 'name', band: 0.25 },
    width: { scale: 'xscale', band: 0.5 },
    y: { scale: 'yscale', field: 'value' },
    y1: (datum, element, params) => {
      return params.yscale.scale(params.yscale.domain()[0]);
    },
    fill: '#6690F2'
  })
  .encodeState('hover', 'fill', 'red');

const player = vGrammarView
  .player(group)
  .playerType('discrete')
  .depend([data, 'viewBox'])
  .encode((datum, el, params) => {
    return {
      x: 0,
      y: params.viewBox.y2 + 20,
      size: { width: params.viewBox.width() },
      interval: 1000,
      data: params.table,
      controller: {
        forward: { style: { visible: false, size: 0 } },
        backward: { style: { visible: false, size: 0 } }
      }
    };
  });

let animate;

player.on('onPlay', a => {
  if (!animate) {
    animate = rect.animate.run({
      type: 'growHeightIn',
      duration: 1000,
      easing: 'linear',
      oneByOne: true,
      options: { orient: 'negative' }
    });
  } else {
    rect.animate.resume();
  }
});

player.on('onPause', a => {
  rect.animate.pause();
});

rect.on('animationEnd', () => {
  animate = null;
});

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```
