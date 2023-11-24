# Marks

Marks are the core grammar elements in VGrammar. The declarative logic of VGrammar visualization scenarios essentially lies in describing the data mapping (data join), visual channel encoding (visual encoding), and animation transition (animation) logic corresponding to the marks.

Marks in VGrammar can be understood as graphic elements with specific shapes or capabilities, such as basic lines, points, planes, and more complex axes, legend components, etc. By combining these basic elements, various complex visualization effects can be constructed.

Marks in VGrammar include several categories:

- Basic Mark: Describes the basic drawing mark of a specific shape, such as a rectangular mark, Rect;
- Semantic Mark: A mark with a specific semantic, such as a mark that describes a data interval, Interval;
- Glyph Mark: A mark obtained by combining any basic marks, used to describe a complex graphic effect, such as RipplePoint;
- Component Mark: Components with specific interaction, animation, and data logic, such as Axis.

![Composition of Marks](To be added)

## transform

Marks also support transform operations, and the difference between the data grammar elements Data is that the transform of marks now supports execution in two stages

1. Before executing `join`, perform data transformation on **join data**;
2. After completing the graphic channel mapping, before creating the graphic elements, perform data transformation on **graphic elements**;

So when VGrammar registers a transform, it will declare the stage of the `transform` when it is executed in the mark. Therefore, all the transforms supported by the data grammar element Data are also supported on the mark;

Example:

```js
{
  marks: [
    {
      type: 'rect',
      transform: [
        {
          type: 'filter',
          callback: datum => {
            return datum.value > 0;
          }
        }
      ]
    }
  ];
}
```

## Custom Graphics

In addition to the built-in mark rendering effects of VGrammar, developers can use the `marks.setCustomizedShape` interface to declare the rendering logic of marks and implement custom mark effects.

Custom graphics example:

<div class="examples-ref-container" id="examples-ref-customized-shape" data-path="basic-mark-rect/customized-shape">
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
          setCustomizedShape: (data, attrs, path) => {
            path.moveTo(attrs.width / 2, 0);
            path.quadraticCurveTo(0.55 * attrs.width, 0.67 * attrs.height, attrs.width, attrs.height);
            path.lineTo(0, attrs.height);
            path.quadraticCurveTo(0.45 * attrs.width, 0.67 * attrs.height, attrs.width / 2, 0);
            path.closePath();
            return path;
          },
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
Key configuration is as follows:

```js
{
  type: 'rect',
  setCustomizedShape: (data, attrs, path) => {
    path.moveTo(attrs.width / 2, 0);
    path.quadraticCurveTo(0.55 * attrs.width, 0.67 * attrs.height, attrs.width, attrs.height);
    path.lineTo(0, attrs.height);
    path.quadraticCurveTo(0.45 * attrs.width, 0.67 * attrs.height, attrs.width / 2, 0);
    path.closePath();
    return path;
  }
}
```

## Performance

### Progressive Rendering

Rendering large data visualizations requires high performance. To solve the performance problem that may be encountered when rendering large data volume, VGrammar provides a progressive rendering feature. By setting the `marks.progressiveStep` and `marks.progressiveThreshold` configuration items, large data volume graphics can be rendered in segments to optimize performance.

Progressive rendering example:

```js
{
  type: 'rect',
  progressiveStep: 3000,
  progressiveThreshold: 50000,
}
```

<div class="examples-ref-container" id="examples-ref-progressive-rect" data-path="performance/progressive-rect">
</div>

```javascript livedemo template=vgrammar
const data = new Array(10000).fill(0).map((entry, index) => {
  return {
    name: `${index}`,
    value: Math.floor(10000 * Math.random())
  };
});
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: data
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
      padding: 0.05
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
          // tickCount: -1,
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
          progressiveStep: 200,
          progressiveThreshold: 3000,
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
### Simplification of Large Data Volume Graphics

After enabling progressive rendering, the rendering effect of specific graphic elements will be simplified to improve rendering speed.

In common situations, graphic elements under large data volume only have position-related visual channel differences. During the progressive rendering process, VGrammar will extract non-reusable visual channels related to positioning and simplify the visual encoding process of each mark to improve rendering performance.
