# 基础图元

VGrammar 中的基础图元描述了某一类特定的绘图形状。

## 分组图元 (Group)

分组图元用于对多个图元进行收拢，以便对其进行统一操作，如缩放、平移等。图元类型声明为 `'group'`。

需要注意的是，分组图元与其他基础图元不同，并不支持数据映射。声明的一个 Group Mark 只能对应到一个最终的 group 图形元素。

## 矩形图元 (Rect)

矩形图元用于绘制矩形，可以用来创建柱状图等可视化效果。图元类型声明为 `'rect'`。

矩形图元渲染示例：

<div class="examples-ref-container" id="examples-ref-rect" data-path="basic-mark-rect/basic-rect">
</div>

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

## 弧形图元 (Arc)

弧形图元用于绘制圆弧，可以用来创建饼图、环形图等可视化效果。图元类型声明为 `'arc'`。

弧形图元渲染示例：

<div class="examples-ref-container" id="examples-ref-arc" data-path="basic-mark-arc/basic-arc">
</div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          value: 3676,
          name: ' ~ 29'
        },
        {
          value: 3872,
          name: '30 ~ 39'
        },
        {
          value: 1668,
          name: '40 ~ 49'
        },
        {
          value: 610,
          name: '50 ~'
        }
      ]
    },
    {
      id: 'stack',
      source: 'table',
      transform: [
        {
          type: 'stack',
          dimensionField: 'none',
          stackField: 'value',
          asStack: 'value1',
          asPrevStack: 'value0',
          asPercentStack: 'percent1',
          asPrevPercentStack: 'percent0'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'angleScale',
      type: 'linear',
      range: [-Math.PI, 0]
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
    }
  ],

  marks: [
    {
      type: 'arc',
      from: { data: 'stack' },
      dependency: ['viewBox', 'angleScale', 'colorScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const angleScale = params.angleScale;
          const startAngle = angleScale.scale(datum.percent0);
          const maxR = Math.min(viewBox.width() / 2, viewBox.height());

          return {
            x: viewBox.x1 + viewBox.width() / 2,
            y: viewBox.y2,
            startAngle: startAngle,
            endAngle: angleScale.scale(datum.percent1),
            innerRadius: 100,
            outerRadius: maxR,
            fill: params.colorScale.scale(datum.name)
          };
        },
        hover: {
          fill: 'red'
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
          value: 3676,
          name: ' ~ 29'
        },
        {
          value: 3872,
          name: '30 ~ 39'
        },
        {
          value: 1668,
          name: '40 ~ 49'
        },
        {
          value: 610,
          name: '50 ~'
        }
      ]
    },
    {
      id: 'stack',
      source: 'table',
      transform: [
        {
          type: 'stack',
          dimensionField: 'none',
          stackField: 'value',
          asStack: 'value1',
          asPrevStack: 'value0',
          asPercentStack: 'percent1',
          asPrevPercentStack: 'percent0'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'angleScale',
      type: 'linear',
      range: [-Math.PI, 0]
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
    }
  ],

  marks: [
    {
      type: 'arc',
      from: { data: 'stack' },
      dependency: ['viewBox', 'angleScale', 'colorScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const angleScale = params.angleScale;
          const startAngle = angleScale.scale(datum.percent0);
          const maxR = Math.min(viewBox.width() / 2, viewBox.height());

          return {
            x: viewBox.x1 + viewBox.width() / 2,
            y: viewBox.y2,
            startAngle: startAngle,
            endAngle: angleScale.scale(datum.percent1),
            innerRadius: 100,
            outerRadius: maxR,
            fill: params.colorScale.scale(datum.name)
          };
        },
        hover: {
          fill: 'red'
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
          value: 3676,
          name: ' ~ 29'
        },
        {
          value: 3872,
          name: '30 ~ 39'
        },
        {
          value: 1668,
          name: '40 ~ 49'
        },
        {
          value: 610,
          name: '50 ~'
        }
      ]
    },
    {
      id: 'stack',
      source: 'table',
      transform: [
        {
          type: 'stack',
          dimensionField: 'none',
          stackField: 'value',
          asStack: 'value1',
          asPrevStack: 'value0',
          asPercentStack: 'percent1',
          asPrevPercentStack: 'percent0'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'angleScale',
      type: 'linear',
      range: [-Math.PI, 0]
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
    }
  ],

  marks: [
    {
      type: 'arc',
      from: { data: 'stack' },
      dependency: ['viewBox', 'angleScale', 'colorScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const angleScale = params.angleScale;
          const startAngle = angleScale.scale(datum.percent0);
          const maxR = Math.min(viewBox.width() / 2, viewBox.height());

          return {
            x: viewBox.x1 + viewBox.width() / 2,
            y: viewBox.y2,
            startAngle: startAngle,
            endAngle: angleScale.scale(datum.percent1),
            innerRadius: 100,
            outerRadius: maxR,
            fill: params.colorScale.scale(datum.name)
          };
        },
        hover: {
          fill: 'red'
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

## 面积图元 (Area)

面积图元用于绘制封闭曲线与坐标轴之间的区域，可以用来创建面积图等可视化效果。图元类型声明为 `'area'`。

面积图元渲染示例：

<div class="examples-ref-container" id="examples-ref-area" data-path="basic-mark-area/basic-area">
</div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

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
          value: -11
        },
        {
          time: '8:00',
          value: -14
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
    }
  ],

  scales: [
    {
      id: 'xscale',
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
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
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
      type: 'area',
      from: { data: 'table' },
      dependency: ['yscale'],
      encode: {
        enter: {
          fill: '#6690F2',
          fillOpacity: 0.3
        },
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' },
          y1: { scale: 'yscale', value: 0 }
          // fill: (datum, element, params) => {
          //   const range = params.yscale.range();

          //   return {
          //     gradient: 'linear',
          //     x0: 0.5,
          //     y0: 0,
          //     x1: 0.5,
          //     y1: 1,
          //     stops: [
          //       {
          //         offset: 0,
          //         color: '#6690F2'
          //       },
          //       {
          //         offset: Math.abs((params.yscale.scale(0) - range[0]) / (range[1] - range[0])),
          //         color: '#fff'
          //       },
          //       {
          //         offset: 1,
          //         color: '#6690F2'
          //       }
          //     ]
          //   };
          // }
        },
        hover: {
          fill: 'red'
        }
      }
    },
    {
      type: 'line',
      from: { data: 'table' },
      dependency: ['yscale'],
      encode: {
        enter: {
          stroke: '#6690F2',
          lineWidth: 2
        },
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' }
        },
        hover: {
          stroke: 'red'
        }
      }
    },
    {
      type: 'symbol',
      from: { data: 'table' },
      encode: {
        enter: {
          stroke: '#6690F2',
          fill: '#fff',
          lineWidth: 2
        },
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' }
        },
        hover: {
          fill: '#6690F2'
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
          time: '2:00',
          value: 8
        },
        {
          time: '4:00',
          value: 9
        },
        {
          time: '6:00',
          value: -11
        },
        {
          time: '8:00',
          value: -14
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
    }
  ],

  scales: [
    {
      id: 'xscale',
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
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
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
      type: 'area',
      from: { data: 'table' },
      dependency: ['yscale'],
      encode: {
        enter: {
          fill: '#6690F2',
          fillOpacity: 0.3
        },
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' },
          y1: { scale: 'yscale', value: 0 }
          // fill: (datum, element, params) => {
          //   const range = params.yscale.range();

          //   return {
          //     gradient: 'linear',
          //     x0: 0.5,
          //     y0: 0,
          //     x1: 0.5,
          //     y1: 1,
          //     stops: [
          //       {
          //         offset: 0,
          //         color: '#6690F2'
          //       },
          //       {
          //         offset: Math.abs((params.yscale.scale(0) - range[0]) / (range[1] - range[0])),
          //         color: '#fff'
          //       },
          //       {
          //         offset: 1,
          //         color: '#6690F2'
          //       }
          //     ]
          //   };
          // }
        },
        hover: {
          fill: 'red'
        }
      }
    },
    {
      type: 'line',
      from: { data: 'table' },
      dependency: ['yscale'],
      encode: {
        enter: {
          stroke: '#6690F2',
          lineWidth: 2
        },
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' }
        },
        hover: {
          stroke: 'red'
        }
      }
    },
    {
      type: 'symbol',
      from: { data: 'table' },
      encode: {
        enter: {
          stroke: '#6690F2',
          fill: '#fff',
          lineWidth: 2
        },
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' }
        },
        hover: {
          fill: '#6690F2'
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
          time: '2:00',
          value: 8
        },
        {
          time: '4:00',
          value: 9
        },
        {
          time: '6:00',
          value: -11
        },
        {
          time: '8:00',
          value: -14
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
    }
  ],

  scales: [
    {
      id: 'xscale',
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
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
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
      type: 'area',
      from: { data: 'table' },
      dependency: ['yscale'],
      encode: {
        enter: {
          fill: '#6690F2',
          fillOpacity: 0.3
        },
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' },
          y1: { scale: 'yscale', value: 0 }
          // fill: (datum, element, params) => {
          //   const range = params.yscale.range();

          //   return {
          //     gradient: 'linear',
          //     x0: 0.5,
          //     y0: 0,
          //     x1: 0.5,
          //     y1: 1,
          //     stops: [
          //       {
          //         offset: 0,
          //         color: '#6690F2'
          //       },
          //       {
          //         offset: Math.abs((params.yscale.scale(0) - range[0]) / (range[1] - range[0])),
          //         color: '#fff'
          //       },
          //       {
          //         offset: 1,
          //         color: '#6690F2'
          //       }
          //     ]
          //   };
          // }
        },
        hover: {
          fill: 'red'
        }
      }
    },
    {
      type: 'line',
      from: { data: 'table' },
      dependency: ['yscale'],
      encode: {
        enter: {
          stroke: '#6690F2',
          lineWidth: 2
        },
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' }
        },
        hover: {
          stroke: 'red'
        }
      }
    },
    {
      type: 'symbol',
      from: { data: 'table' },
      encode: {
        enter: {
          stroke: '#6690F2',
          fill: '#fff',
          lineWidth: 2
        },
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' }
        },
        hover: {
          fill: '#6690F2'
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

## 线图元 (Line)

线图元用于绘制折线，可以用来创建折线图等可视化效果。图元类型声明为 `'line'`。

线图元渲染示例：

<div class="examples-ref-container" id="examples-ref-line" data-path="basic-mark-line/basic-line">
</div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

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
    }
  ],

  scales: [
    {
      id: 'xscale',
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
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
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
      from: { data: 'table' },
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
      from: { data: 'table' },
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
    }
  ],

  scales: [
    {
      id: 'xscale',
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
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
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
      from: { data: 'table' },
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
      from: { data: 'table' },
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
    }
  ],

  scales: [
    {
      id: 'xscale',
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
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
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
      from: { data: 'table' },
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
      from: { data: 'table' },
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

## 符号图元 (Symbol)

符号图元用于绘制特定图形，如圆、矩形等，可以用来创建散点图等可视化效果。图元类型声明为 `'symbol'`。

符号图元渲染示例：

<div class="examples-ref-container" id="examples-ref-symbol" data-path="basic-mark-symbol/basic-symbol">
</div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 25, right: 5, bottom: 30, left: 60 },

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
      componentType: 'crosshair',
      scale: 'yscale',
      crosshairShape: 'line',
      crosshairType: 'y',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            start: { x: params.viewBox.x1 },
            end: { x: params.viewBox.x2 }
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
      type: 'symbol',
      from: { data: 'table' },
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
  padding: { top: 25, right: 5, bottom: 30, left: 60 },

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
      componentType: 'crosshair',
      scale: 'yscale',
      crosshairShape: 'line',
      crosshairType: 'y',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            start: { x: params.viewBox.x1 },
            end: { x: params.viewBox.x2 }
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
      type: 'symbol',
      from: { data: 'table' },
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
  padding: { top: 25, right: 5, bottom: 30, left: 60 },

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
      componentType: 'crosshair',
      scale: 'yscale',
      crosshairShape: 'line',
      crosshairType: 'y',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            start: { x: params.viewBox.x1 },
            end: { x: params.viewBox.x2 }
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
      type: 'symbol',
      from: { data: 'table' },
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

## 路径图元 (Path)

路径图元用于绘制任意形状的路径，可以用来创建自定义的图形和地理轨迹等可视化效果。图元类型声明为 `'path'`。

<!--
路径图元渲染示例：
![路径图元]()
 -->

## 连线图元 (Rule)

连线图元用于绘制直线，可以用来创建辅助线、参考线等可视化效果。图元类型声明为 `'rule'`。

连线图元渲染示例：

<div class="examples-ref-container" id="examples-ref-rule" data-path="basic-mark-rule/basic-rule">
</div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

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
      id: 'avg',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: data => {
            const len = data.length;
            return data.reduce((avg, entry) => {
              return avg + entry.value / len;
            }, 0);
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
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
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      zero: true
    }
  ],

  marks: [
    {
      type: 'rule',
      from: { data: 'avg' },
      dependency: ['viewBox'],
      encode: {
        update: {
          y: { scale: 'yscale', field: 'data' },
          y1: { scale: 'yscale', field: 'data' },
          x: (datum, el, params) => {
            return params.viewBox.x1;
          },
          x1: (datum, el, params) => {
            return params.viewBox.x2;
          },
          lineDash: [2, 2],
          stroke: '#999'
        }
      }
    },
    {
      type: 'text',
      from: { data: 'avg' },
      dependency: ['viewBox'],
      encode: {
        update: {
          x: (datum, el, params) => {
            return params.viewBox.x2;
          },
          dy: 10,
          y: { scale: 'yscale', field: 'data' },
          textAlign: 'end',
          textBaseline: 'middle',
          text: (datum, el, params) => {
            return ` AVG: ${datum.data.toFixed(2)}`;
          },
          fill: '#666'
        }
      }
    },

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
      type: 'line',
      from: { data: 'table' },
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
      from: { data: 'table' },
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
      id: 'avg',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: data => {
            const len = data.length;
            return data.reduce((avg, entry) => {
              return avg + entry.value / len;
            }, 0);
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
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
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      zero: true
    }
  ],

  marks: [
    {
      type: 'rule',
      from: { data: 'avg' },
      dependency: ['viewBox'],
      encode: {
        update: {
          y: { scale: 'yscale', field: 'data' },
          y1: { scale: 'yscale', field: 'data' },
          x: (datum, el, params) => {
            return params.viewBox.x1;
          },
          x1: (datum, el, params) => {
            return params.viewBox.x2;
          },
          lineDash: [2, 2],
          stroke: '#999'
        }
      }
    },
    {
      type: 'text',
      from: { data: 'avg' },
      dependency: ['viewBox'],
      encode: {
        update: {
          x: (datum, el, params) => {
            return params.viewBox.x2;
          },
          dy: 10,
          y: { scale: 'yscale', field: 'data' },
          textAlign: 'end',
          textBaseline: 'middle',
          text: (datum, el, params) => {
            return ` AVG: ${datum.data.toFixed(2)}`;
          },
          fill: '#666'
        }
      }
    },

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
      type: 'line',
      from: { data: 'table' },
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
      from: { data: 'table' },
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
      id: 'avg',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: data => {
            const len = data.length;
            return data.reduce((avg, entry) => {
              return avg + entry.value / len;
            }, 0);
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
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
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      zero: true
    }
  ],

  marks: [
    {
      type: 'rule',
      from: { data: 'avg' },
      dependency: ['viewBox'],
      encode: {
        update: {
          y: { scale: 'yscale', field: 'data' },
          y1: { scale: 'yscale', field: 'data' },
          x: (datum, el, params) => {
            return params.viewBox.x1;
          },
          x1: (datum, el, params) => {
            return params.viewBox.x2;
          },
          lineDash: [2, 2],
          stroke: '#999'
        }
      }
    },
    {
      type: 'text',
      from: { data: 'avg' },
      dependency: ['viewBox'],
      encode: {
        update: {
          x: (datum, el, params) => {
            return params.viewBox.x2;
          },
          dy: 10,
          y: { scale: 'yscale', field: 'data' },
          textAlign: 'end',
          textBaseline: 'middle',
          text: (datum, el, params) => {
            return ` AVG: ${datum.data.toFixed(2)}`;
          },
          fill: '#666'
        }
      }
    },

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
      type: 'line',
      from: { data: 'table' },
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
      from: { data: 'table' },
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

## 形状图元 (Shape)

形状图元用于绘制自定义形状，可以用来创建地图等可视化效果。图元类型声明为 `'shape'`。

<!--
形状图元渲染示例：
![形状图元]()
 -->

## 图像图元 (Image)

图像图元用于在视化场景中插入图片，可以用来创建背景、图标等可视化效果。图元类型声明为 `'image'`。

<!--
图像图元渲染示例：
![图像图元]()
 -->

## 文本图元 (Text)

文本图元用于绘制文本，可以用来创建标签、标题等可视化效果。图元类型声明为 `'text'`。

文本图元渲染示例：

<div class="examples-ref-container" id="examples-ref-text" data-path="basic-mark-text/basic-text">
</div>

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
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      nice: true
    },
    {
      id: 'size',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      range: [12, 30]
    },
    {
      id: 'color',
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
      type: 'text',
      from: { data: 'table' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'name' },
          y: { scale: 'yscale', field: 'name' },
          text: { field: 'name' },
          fontSize: { scale: 'size', field: 'value' },
          fill: { scale: 'color', field: 'name' },
          textAlign: 'center',
          textBaseline: 'middle'
        },
        hover: {
          fill: 'red'
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
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      nice: true
    },
    {
      id: 'size',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      range: [12, 30]
    },
    {
      id: 'color',
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
      type: 'text',
      from: { data: 'table' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'name' },
          y: { scale: 'yscale', field: 'name' },
          text: { field: 'name' },
          fontSize: { scale: 'size', field: 'value' },
          fill: { scale: 'color', field: 'name' },
          textAlign: 'center',
          textBaseline: 'middle'
        },
        hover: {
          fill: 'red'
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
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      nice: true
    },
    {
      id: 'size',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      range: [12, 30]
    },
    {
      id: 'color',
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
      type: 'text',
      from: { data: 'table' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'name' },
          y: { scale: 'yscale', field: 'name' },
          text: { field: 'name' },
          fontSize: { scale: 'size', field: 'value' },
          fill: { scale: 'color', field: 'name' },
          textAlign: 'center',
          textBaseline: 'middle'
        },
        hover: {
          fill: 'red'
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

## 富文本图元 (Richtext)

富文本图元用于绘制带有样式的文本，可以用来创建高亮、链接等可视化效果。图元类型声明为 `'richtext'`。

富文本图元渲染示例：

<div class="examples-ref-container" id="examples-ref-richtext" data-path="basic-mark-richtext/basic-richtext">
</div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 40, right: 5, bottom: 30, left: 60 },

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
        return [params.viewBox.y1, params.viewBox.y2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'xScale',
      type: 'linear',
      domain: { data: 'table', field: ['2020'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      nice: true,
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
      type: 'richtext',
      dependency: ['viewBox'],
      encode: {
        update: (datum, elment, params) => {
          return {
            x: (params.viewBox.x1 + params.viewBox.x2) / 2,
            y: 0,
            textAlign: 'center',
            textBaseline: 'top',

            textConfig: [
              {
                text: '2020',
                fontWeight: 'bold',
                fontSize: 40,
                fillColor: [
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
                ][1],
                fill: true
              },
              {
                text: '销售趋势',
                fillColor: '#333',
                fill: true
              }
            ]
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'yScale',
      crosshairShape: 'rect',
      crosshairType: 'y',
      dependency: ['viewBox'],
      encode: {
        update: (datum, elment, params) => {
          return {
            start: { x: params.viewBox.x1 },
            end: { x: params.viewBox.x2 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xScale',
      tickCount: 5,
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
      scale: 'yScale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: 0 },
            end: { x: 0, y: params.viewBox.height() }
          };
        }
      }
    },
    {
      type: 'rect',
      from: { data: 'table' },
      encode: {
        update: {
          x: { scale: 'xScale', field: '2020' },
          x1: { scale: 'xScale', value: 0 },
          y: { scale: 'yScale', field: 'sales', band: 0.25 },
          height: { scale: 'yScale', band: 0.5 },
          fill: '#6690F2'
        },
        hover: {
          fill: 'red'
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
  padding: { top: 40, right: 5, bottom: 30, left: 60 },

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
        return [params.viewBox.y1, params.viewBox.y2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'xScale',
      type: 'linear',
      domain: { data: 'table', field: ['2020'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      nice: true,
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
      type: 'richtext',
      dependency: ['viewBox'],
      encode: {
        update: (datum, elment, params) => {
          return {
            x: (params.viewBox.x1 + params.viewBox.x2) / 2,
            y: 0,
            textAlign: 'center',
            textBaseline: 'top',

            textConfig: [
              {
                text: '2020',
                fontWeight: 'bold',
                fontSize: 40,
                fillColor: [
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
                ][1],
                fill: true
              },
              {
                text: '销售趋势',
                fillColor: '#333',
                fill: true
              }
            ]
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'yScale',
      crosshairShape: 'rect',
      crosshairType: 'y',
      dependency: ['viewBox'],
      encode: {
        update: (datum, elment, params) => {
          return {
            start: { x: params.viewBox.x1 },
            end: { x: params.viewBox.x2 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xScale',
      tickCount: 5,
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
      scale: 'yScale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: 0 },
            end: { x: 0, y: params.viewBox.height() }
          };
        }
      }
    },
    {
      type: 'rect',
      from: { data: 'table' },
      encode: {
        update: {
          x: { scale: 'xScale', field: '2020' },
          x1: { scale: 'xScale', value: 0 },
          y: { scale: 'yScale', field: 'sales', band: 0.25 },
          height: { scale: 'yScale', band: 0.5 },
          fill: '#6690F2'
        },
        hover: {
          fill: 'red'
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
  padding: { top: 40, right: 5, bottom: 30, left: 60 },

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
        return [params.viewBox.y1, params.viewBox.y2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'xScale',
      type: 'linear',
      domain: { data: 'table', field: ['2020'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      nice: true,
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
      type: 'richtext',
      dependency: ['viewBox'],
      encode: {
        update: (datum, elment, params) => {
          return {
            x: (params.viewBox.x1 + params.viewBox.x2) / 2,
            y: 0,
            textAlign: 'center',
            textBaseline: 'top',

            textConfig: [
              {
                text: '2020',
                fontWeight: 'bold',
                fontSize: 40,
                fillColor: [
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
                ][1],
                fill: true
              },
              {
                text: '销售趋势',
                fillColor: '#333',
                fill: true
              }
            ]
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'yScale',
      crosshairShape: 'rect',
      crosshairType: 'y',
      dependency: ['viewBox'],
      encode: {
        update: (datum, elment, params) => {
          return {
            start: { x: params.viewBox.x1 },
            end: { x: params.viewBox.x2 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xScale',
      tickCount: 5,
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
      scale: 'yScale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: 0 },
            end: { x: 0, y: params.viewBox.height() }
          };
        }
      }
    },
    {
      type: 'rect',
      from: { data: 'table' },
      encode: {
        update: {
          x: { scale: 'xScale', field: '2020' },
          x1: { scale: 'xScale', value: 0 },
          y: { scale: 'yScale', field: 'sales', band: 0.25 },
          height: { scale: 'yScale', band: 0.5 },
          fill: '#6690F2'
        },
        hover: {
          fill: 'red'
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

## 多边形图元 (Polygon)

多边形图元用于绘制多边形，可以用来创建漏斗图、凸包等可视化效果。图元类型声明为 `'polygon'`。

多边形图元渲染示例：

<div class="examples-ref-container" id="examples-ref-polygon" data-path="basic-mark-polygon/basic-polygon">
</div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          value: 5676,
          name: 'Sent'
        },
        {
          value: 3872,
          name: 'Viewed'
        },
        {
          value: 1668,
          name: 'Clicked'
        },
        {
          value: 610,
          name: 'Add to Cart'
        },
        {
          value: 565,
          name: 'Purchased'
        }
      ]
    },
    {
      id: 'funnel',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: data => {
            return data.map((entry, index, arr) => {
              return {
                ...entry,
                nextValue: arr[index + 1]?.value
              };
            });
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      domain: { data: 'funnel', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true,
      min: 0
    },
    {
      id: 'yscale',
      type: 'band',
      domain: { data: 'funnel', field: 'name' },
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
      domain: { data: 'funnel', field: 'name' },
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
      type: 'polygon',
      from: { data: 'funnel' },
      dependency: ['xscale', 'yscale', 'viewBox'],
      encode: {
        update: {
          points: (datum, element, params) => {
            const xScale = params.xscale;
            const yScale = params.yscale;
            const xRange = xScale.range();
            const midX = (xRange[0] + xRange[1]) / 2;
            const height = yScale.bandwidth();
            const baseX = xScale.scale(0);
            const upWidth = xScale.scale(datum.value) - baseX;
            const downWidth = datum.nextValue == null ? 0 : xScale.scale(datum.nextValue) - baseX;
            const y0 = yScale.scale(datum.name);

            return [
              {
                x: midX - upWidth / 2,
                y: y0
              },
              {
                x: midX + upWidth / 2,
                y: y0
              },
              {
                x: midX + downWidth / 2,
                y: y0 + height
              },
              {
                x: midX - downWidth / 2,
                y: y0 + height
              }
            ];
          },
          fill: { scale: 'color', field: 'name' }
        },
        hover: {
          fill: 'red'
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
          value: 5676,
          name: 'Sent'
        },
        {
          value: 3872,
          name: 'Viewed'
        },
        {
          value: 1668,
          name: 'Clicked'
        },
        {
          value: 610,
          name: 'Add to Cart'
        },
        {
          value: 565,
          name: 'Purchased'
        }
      ]
    },
    {
      id: 'funnel',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: data => {
            return data.map((entry, index, arr) => {
              return {
                ...entry,
                nextValue: arr[index + 1]?.value
              };
            });
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      domain: { data: 'funnel', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true,
      min: 0
    },
    {
      id: 'yscale',
      type: 'band',
      domain: { data: 'funnel', field: 'name' },
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
      domain: { data: 'funnel', field: 'name' },
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
      type: 'polygon',
      from: { data: 'funnel' },
      dependency: ['xscale', 'yscale', 'viewBox'],
      encode: {
        update: {
          points: (datum, element, params) => {
            const xScale = params.xscale;
            const yScale = params.yscale;
            const xRange = xScale.range();
            const midX = (xRange[0] + xRange[1]) / 2;
            const height = yScale.bandwidth();
            const baseX = xScale.scale(0);
            const upWidth = xScale.scale(datum.value) - baseX;
            const downWidth = datum.nextValue == null ? 0 : xScale.scale(datum.nextValue) - baseX;
            const y0 = yScale.scale(datum.name);

            return [
              {
                x: midX - upWidth / 2,
                y: y0
              },
              {
                x: midX + upWidth / 2,
                y: y0
              },
              {
                x: midX + downWidth / 2,
                y: y0 + height
              },
              {
                x: midX - downWidth / 2,
                y: y0 + height
              }
            ];
          },
          fill: { scale: 'color', field: 'name' }
        },
        hover: {
          fill: 'red'
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
          value: 5676,
          name: 'Sent'
        },
        {
          value: 3872,
          name: 'Viewed'
        },
        {
          value: 1668,
          name: 'Clicked'
        },
        {
          value: 610,
          name: 'Add to Cart'
        },
        {
          value: 565,
          name: 'Purchased'
        }
      ]
    },
    {
      id: 'funnel',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: data => {
            return data.map((entry, index, arr) => {
              return {
                ...entry,
                nextValue: arr[index + 1]?.value
              };
            });
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      domain: { data: 'funnel', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true,
      min: 0
    },
    {
      id: 'yscale',
      type: 'band',
      domain: { data: 'funnel', field: 'name' },
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
      domain: { data: 'funnel', field: 'name' },
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
      type: 'polygon',
      from: { data: 'funnel' },
      dependency: ['xscale', 'yscale', 'viewBox'],
      encode: {
        update: {
          points: (datum, element, params) => {
            const xScale = params.xscale;
            const yScale = params.yscale;
            const xRange = xScale.range();
            const midX = (xRange[0] + xRange[1]) / 2;
            const height = yScale.bandwidth();
            const baseX = xScale.scale(0);
            const upWidth = xScale.scale(datum.value) - baseX;
            const downWidth = datum.nextValue == null ? 0 : xScale.scale(datum.nextValue) - baseX;
            const y0 = yScale.scale(datum.name);

            return [
              {
                x: midX - upWidth / 2,
                y: y0
              },
              {
                x: midX + upWidth / 2,
                y: y0
              },
              {
                x: midX + downWidth / 2,
                y: y0 + height
              },
              {
                x: midX - downWidth / 2,
                y: y0 + height
              }
            ];
          },
          fill: { scale: 'color', field: 'name' }
        },
        hover: {
          fill: 'red'
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

## 三维矩形图元 (Rect3d)

三维矩形图元用于绘制长方体，可以用来创建三维可视化中的柱状图等可视化效果。图元类型声明为 `'rect3d'`。

三维矩形图元渲染示例：

<div class="examples-ref-container" id="examples-ref-rect3d" data-path="3d-mark/rect3d">
</div>

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
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.25,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      nice: true
    }
  ],

  marks: [
    {
      type: 'component',
      mode: '3d',
      componentType: 'axis',
      scale: 'xscale',
      // tickCount: -1,
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
      mode: '3d',
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
      type: 'rect3d',
      from: { data: 'table' },
      dependency: ['yscale'],
      encode: {
        update: {
          x: { scale: 'xscale', field: 'name' },
          width: { scale: 'xscale', band: 1 },
          y: { scale: 'yscale', field: 'value' },
          y1: (datum, element, params) => {
            return params.yscale.scale(params.yscale.domain()[0]);
          },
          z: 0,
          length: 20,
          fill: '#6690F2'
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  options3d: {
    enable: true,
    alpha: 0,
    beta: 0
    // center: { x: 800, y: 400 }
    // enableView3dTranform: true
  },
  disableDirtyBounds: true
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
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.25,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      nice: true
    }
  ],

  marks: [
    {
      type: 'component',
      mode: '3d',
      componentType: 'axis',
      scale: 'xscale',
      // tickCount: -1,
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
      mode: '3d',
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
      type: 'rect3d',
      from: { data: 'table' },
      dependency: ['yscale'],
      encode: {
        update: {
          x: { scale: 'xscale', field: 'name' },
          width: { scale: 'xscale', band: 1 },
          y: { scale: 'yscale', field: 'value' },
          y1: (datum, element, params) => {
            return params.yscale.scale(params.yscale.domain()[0]);
          },
          z: 0,
          length: 20,
          fill: '#6690F2'
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  options3d: {
    enable: true,
    alpha: 0,
    beta: 0
    // center: { x: 800, y: 400 }
    // enableView3dTranform: true
  },
  disableDirtyBounds: true
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
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.25,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      nice: true
    }
  ],

  marks: [
    {
      type: 'component',
      mode: '3d',
      componentType: 'axis',
      scale: 'xscale',
      // tickCount: -1,
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
      mode: '3d',
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
      type: 'rect3d',
      from: { data: 'table' },
      dependency: ['yscale'],
      encode: {
        update: {
          x: { scale: 'xscale', field: 'name' },
          width: { scale: 'xscale', band: 1 },
          y: { scale: 'yscale', field: 'value' },
          y1: (datum, element, params) => {
            return params.yscale.scale(params.yscale.domain()[0]);
          },
          z: 0,
          length: 20,
          fill: '#6690F2'
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  options3d: {
    enable: true,
    alpha: 0,
    beta: 0
    // center: { x: 800, y: 400 }
    // enableView3dTranform: true
  },
  disableDirtyBounds: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 三维弧形图元 (Arc3d)

三维弧形图元用于绘制柱体，可以用来创建三维可视化中的饼图、环形图等可视化效果。图元类型声明为 `'arc3d'`。

三维弧形图元渲染示例：

<div class="examples-ref-container" id="examples-ref-arc3d" data-path="3d-mark/arc3d">
</div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          value: 335,
          name: '直接访问'
        },
        {
          value: 310,
          name: '邮件营销'
        },
        {
          value: 274,
          name: '联盟广告'
        },
        {
          value: 123,
          name: '搜索引擎'
        },
        {
          value: 215,
          name: '视频广告'
        }
      ],
      transform: [
        {
          type: 'pie',
          field: 'value',
          asStartAngle: 'startAngle',
          asEndAngle: 'endAngle'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'test' },
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
      type: 'arc3d',
      from: { data: 'table' },
      encode: {
        update: {
          x: (datum, element, params) => params.viewBox.x1 + params.viewBox.width() / 2,
          y: (datum, element, params) => params.viewBox.y1 + params.viewBox.height() / 2,
          outerRadius: 150,
          startAngle: { field: 'startAngle' },
          endAngle: { field: 'endAngle' },
          height: 20,
          fill: { scale: 'colorScale', field: 'name' }
        },
        hover: {
          fill: 'red'
        }
      },
      animation: {
        enter: {
          type: 'growAngleIn',
          options: { overall: true },
          duration: 2000
        },
        state: {
          duration: 500
        }
      },
      dependency: ['viewBox']
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  options3d: {
    enable: true,
    alpha: 0,
    beta: -0.85
    // center: { x: 800, y: 400 }
    // enableView3dTranform: true
  },
  disableDirtyBounds: true
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
          value: 335,
          name: '直接访问'
        },
        {
          value: 310,
          name: '邮件营销'
        },
        {
          value: 274,
          name: '联盟广告'
        },
        {
          value: 123,
          name: '搜索引擎'
        },
        {
          value: 215,
          name: '视频广告'
        }
      ],
      transform: [
        {
          type: 'pie',
          field: 'value',
          asStartAngle: 'startAngle',
          asEndAngle: 'endAngle'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'test' },
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
      type: 'arc3d',
      from: { data: 'table' },
      encode: {
        update: {
          x: (datum, element, params) => params.viewBox.x1 + params.viewBox.width() / 2,
          y: (datum, element, params) => params.viewBox.y1 + params.viewBox.height() / 2,
          outerRadius: 150,
          startAngle: { field: 'startAngle' },
          endAngle: { field: 'endAngle' },
          height: 20,
          fill: { scale: 'colorScale', field: 'name' }
        },
        hover: {
          fill: 'red'
        }
      },
      animation: {
        enter: {
          type: 'growAngleIn',
          options: { overall: true },
          duration: 2000
        },
        state: {
          duration: 500
        }
      },
      dependency: ['viewBox']
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  options3d: {
    enable: true,
    alpha: 0,
    beta: -0.85
    // center: { x: 800, y: 400 }
    // enableView3dTranform: true
  },
  disableDirtyBounds: true
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
          value: 335,
          name: '直接访问'
        },
        {
          value: 310,
          name: '邮件营销'
        },
        {
          value: 274,
          name: '联盟广告'
        },
        {
          value: 123,
          name: '搜索引擎'
        },
        {
          value: 215,
          name: '视频广告'
        }
      ],
      transform: [
        {
          type: 'pie',
          field: 'value',
          asStartAngle: 'startAngle',
          asEndAngle: 'endAngle'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'test' },
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
      type: 'arc3d',
      from: { data: 'table' },
      encode: {
        update: {
          x: (datum, element, params) => params.viewBox.x1 + params.viewBox.width() / 2,
          y: (datum, element, params) => params.viewBox.y1 + params.viewBox.height() / 2,
          outerRadius: 150,
          startAngle: { field: 'startAngle' },
          endAngle: { field: 'endAngle' },
          height: 20,
          fill: { scale: 'colorScale', field: 'name' }
        },
        hover: {
          fill: 'red'
        }
      },
      animation: {
        enter: {
          type: 'growAngleIn',
          options: { overall: true },
          duration: 2000
        },
        state: {
          duration: 500
        }
      },
      dependency: ['viewBox']
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  options3d: {
    enable: true,
    alpha: 0,
    beta: -0.85
    // center: { x: 800, y: 400 }
    // enableView3dTranform: true
  },
  disableDirtyBounds: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 三维金字塔图元 (Pyramid3d)

三维金字塔图元用于绘制金字塔形状的六面体，可以用来创建三维可视化中的漏斗图等可视化效果。图元类型声明为 `'pyramid3d'`。

三维金字塔图元渲染示例：

<div class="examples-ref-container" id="examples-ref-pyramid3d" data-path="3d-mark/pyramid3d">
</div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          value: 100,
          name: 'Step1'
        },
        {
          value: 80,
          name: 'Step2'
        },
        {
          value: 60,
          name: 'Step3'
        },
        {
          value: 40,
          name: 'Step4'
        },
        {
          value: 20,
          name: 'Step5'
        }
      ],
      transform: [
        {
          type: 'funnel',
          field: 'value',
          isCone: false,
          asValueRatio: 'valueRatio',
          asNextValueRatio: 'nextValueRatio'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'lengthScale',
      type: 'linear',
      domain: [0, 1],
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      zero: true,
      nice: true
    },
    {
      id: 'heightScale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      },
      round: true
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
    }
  ],

  marks: [
    {
      type: 'pyramid3d',
      from: { data: 'table' },
      encode: {
        update: (datum, element, params) => {
          const currentLength = params.lengthScale.scale(datum.valueRatio);
          const nextLength = params.lengthScale.scale(datum.nextValueRatio);
          const height = params.heightScale.bandwidth();
          const currentX = params.viewBox.x1 + params.viewBox.width() / 2 - currentLength / 2;
          const currentX1 = params.viewBox.x1 + params.viewBox.width() / 2 + currentLength / 2;
          const nextX = params.viewBox.x1 + params.viewBox.width() / 2 - nextLength / 2;
          const nextX1 = params.viewBox.x1 + params.viewBox.width() / 2 + nextLength / 2;
          const y = params.heightScale.scale(datum.name);
          const y1 = y + height;

          const points = [
            { x: currentX, y: y },
            { x: currentX1, y: y },
            { x: nextX1, y: y1 },
            { x: nextX, y: y1 }
          ];

          const maxLength = params.lengthScale.scale(1);
          const deltaZ = (maxLength - currentLength) / 2;

          return {
            fill: params.colorScale.scale(datum.name),
            points: points,
            z: deltaZ
          };
        }
      },
      dependency: ['viewBox', 'lengthScale', 'heightScale', 'colorScale']
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  options3d: {
    enable: true,
    alpha: -0.5,
    beta: 0.2,
    // center: { x: 800, y: 400 },
    enableView3dTranform: true
  },
  disableDirtyBounds: true
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
          value: 100,
          name: 'Step1'
        },
        {
          value: 80,
          name: 'Step2'
        },
        {
          value: 60,
          name: 'Step3'
        },
        {
          value: 40,
          name: 'Step4'
        },
        {
          value: 20,
          name: 'Step5'
        }
      ],
      transform: [
        {
          type: 'funnel',
          field: 'value',
          isCone: false,
          asValueRatio: 'valueRatio',
          asNextValueRatio: 'nextValueRatio'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'lengthScale',
      type: 'linear',
      domain: [0, 1],
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      zero: true,
      nice: true
    },
    {
      id: 'heightScale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      },
      round: true
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
    }
  ],

  marks: [
    {
      type: 'pyramid3d',
      from: { data: 'table' },
      encode: {
        update: (datum, element, params) => {
          const currentLength = params.lengthScale.scale(datum.valueRatio);
          const nextLength = params.lengthScale.scale(datum.nextValueRatio);
          const height = params.heightScale.bandwidth();
          const currentX = params.viewBox.x1 + params.viewBox.width() / 2 - currentLength / 2;
          const currentX1 = params.viewBox.x1 + params.viewBox.width() / 2 + currentLength / 2;
          const nextX = params.viewBox.x1 + params.viewBox.width() / 2 - nextLength / 2;
          const nextX1 = params.viewBox.x1 + params.viewBox.width() / 2 + nextLength / 2;
          const y = params.heightScale.scale(datum.name);
          const y1 = y + height;

          const points = [
            { x: currentX, y: y },
            { x: currentX1, y: y },
            { x: nextX1, y: y1 },
            { x: nextX, y: y1 }
          ];

          const maxLength = params.lengthScale.scale(1);
          const deltaZ = (maxLength - currentLength) / 2;

          return {
            fill: params.colorScale.scale(datum.name),
            points: points,
            z: deltaZ
          };
        }
      },
      dependency: ['viewBox', 'lengthScale', 'heightScale', 'colorScale']
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  options3d: {
    enable: true,
    alpha: -0.5,
    beta: 0.2,
    // center: { x: 800, y: 400 },
    enableView3dTranform: true
  },
  disableDirtyBounds: true
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
          value: 100,
          name: 'Step1'
        },
        {
          value: 80,
          name: 'Step2'
        },
        {
          value: 60,
          name: 'Step3'
        },
        {
          value: 40,
          name: 'Step4'
        },
        {
          value: 20,
          name: 'Step5'
        }
      ],
      transform: [
        {
          type: 'funnel',
          field: 'value',
          isCone: false,
          asValueRatio: 'valueRatio',
          asNextValueRatio: 'nextValueRatio'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'lengthScale',
      type: 'linear',
      domain: [0, 1],
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      zero: true,
      nice: true
    },
    {
      id: 'heightScale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      },
      round: true
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
    }
  ],

  marks: [
    {
      type: 'pyramid3d',
      from: { data: 'table' },
      encode: {
        update: (datum, element, params) => {
          const currentLength = params.lengthScale.scale(datum.valueRatio);
          const nextLength = params.lengthScale.scale(datum.nextValueRatio);
          const height = params.heightScale.bandwidth();
          const currentX = params.viewBox.x1 + params.viewBox.width() / 2 - currentLength / 2;
          const currentX1 = params.viewBox.x1 + params.viewBox.width() / 2 + currentLength / 2;
          const nextX = params.viewBox.x1 + params.viewBox.width() / 2 - nextLength / 2;
          const nextX1 = params.viewBox.x1 + params.viewBox.width() / 2 + nextLength / 2;
          const y = params.heightScale.scale(datum.name);
          const y1 = y + height;

          const points = [
            { x: currentX, y: y },
            { x: currentX1, y: y },
            { x: nextX1, y: y1 },
            { x: nextX, y: y1 }
          ];

          const maxLength = params.lengthScale.scale(1);
          const deltaZ = (maxLength - currentLength) / 2;

          return {
            fill: params.colorScale.scale(datum.name),
            points: points,
            z: deltaZ
          };
        }
      },
      dependency: ['viewBox', 'lengthScale', 'heightScale', 'colorScale']
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  options3d: {
    enable: true,
    alpha: -0.5,
    beta: 0.2,
    // center: { x: 800, y: 400 },
    enableView3dTranform: true
  },
  disableDirtyBounds: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```
