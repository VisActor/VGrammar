# Component Marks

In VGrammar, component Marks (Component) are components containing specific interactions, animations, and data logic, used to provide specific visualization functions.

The primitive type of all component marks is `'component'`. Developers need to configure `componetType` to declare its type of combination primitive:

```js
{
  type: 'component',
  componentType: 'axis',
  encode: {}
}
```

## Axis

An axis is a basic graphical component used to represent the baseline value of a chart and the mapping relationship of data. An axis usually includes a tick line and a label, representing the value range and the specific value of the data, respectively. In addition, the axis can be set with additional grid lines to enhance the readability of the data.

In the Cartesian coordinate system, there are two types of axes: horizontal axis (X-axis) and vertical axis (Y-axis). Different types of axes may be used for different types of charts, such as polar and angular axes for radial charts.

The componentType of the axis component is `'axis'`. The View also provides a `View.component()` interface for conveniently creating an axis.

A simple Cartesian coordinate axis example is:

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

A simple polar coordinate axis example is:

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

## Legend

Legends are mainly used to display the identification of different data series in charts, helping users understand the chart content. For different types of charts, such as line charts and bar charts, legends can represent various information (such as color, shape, etc.).

According to the differences in the form of the corresponding Scale, VGrammar currently provides three types of legends:

- Discrete Legend: used to describe discrete Scale;
- Color Legend: used to describe continuous color scale;
- Size Legend: used to describe continuous numeric Scale.

The componentType of the legend component is `'legend'`. The View also provides a `View.legend()` interface for conveniently creating a legend.

Examples of different types of legends:

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

## Slider

The slider is an interactive component for filtering and scaling data. Users can adjust the data range by dragging the slider bar. Users can control the data range by dragging the slider gap and position. By operating the slider, users can view the data in a specified range according to their needs.

The componentType of the slider component is `'slider'`. The View also provides a `View.slider()` interface for conveniently creating a slider.

Slider example:

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

## Datazoom

The datazoom is used to view specific parts of long data sequences. It can easily expand and contract the data visualization range, providing a more intuitive interactive experience. By setting the datazoom, users can more easily view or filter information of interest, improving data analysis efficiency.

The componentType of the datazoom component is `'datazoom'`. The View also provides a `View.datazoom()` interface for conveniently creating a datazoom.

Datazoom example:

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

## Label

Labels are used to add text descriptions to visualization graphical elements, helping users quickly understand the specific information of data points.

The componentType of the label component is `'label'`. The View also provides a `View.label()` interface for conveniently creating a label.

Label example:

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

## Player

In visualization scenarios, sometimes it is necessary to display the process of data changing over time. By using the player feature, users can observe the dynamic changes of data through the timeline.

The componentType of the player component is `'player'`. The View also provides a `View.player()` interface for conveniently creating a player.

Player example:

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
