---
category: examples
group: basic-mark-line
title: Archimedean Spiral
order: 1-3
cover: /vgrammar/preview/basic-mark-line-spiral_0.7.6.png
---

# Archimedean Spiral

By sampling points according to any arbitrary formula and displaying them using the `line` element, we can draw any type of curve.

## Code Demo

```javascript livedemo template=vgrammar
const getSpiralData = size => {
  const rad = Math.PI / 180;
  const alpha = 20;
  const beta = size / 80;
  const data = [];

  for (let i = 0; i <= 360 * 4; i++) {
    let t = i * rad;
    let r = alpha + beta * t;

    data.push({ x: size / 2 + r * Math.cos(t), y: size / 2 + r * Math.sin(t) });
  }

  return data;
};
const spec = {
  width: 400,
  height: 400,
  padding: 30,

  data: [
    {
      id: 'table',
      values: getSpiralData(400)
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      domain: { data: 'table', field: 'x' },
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
      domain: { data: 'table', field: ['y'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      }
    }
  ],
  interactions: [
    {
      type: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'line',
      crosshairType: 'angle',
      dependency: ['viewBox'],
      attributes: (scale, elment, params) => {
        return {
          radius: Math.min(params.viewBox.height(), params.viewBox.width()) / 2,
          center: {
            x: (params.viewBox.x1 + params.viewBox.x2) / 2,
            y: (params.viewBox.y1 + params.viewBox.y2) / 2
          }
        };
      }
    },
    {
      type: 'tooltip',
      selector: '#symbol',
      title: { value: { field: 'time' } },
      content: [{ key: 'a', value: { field: 'a' } }]
    }
  ],

  marks: [
    {
      type: 'component',
      id: 'radiusAxis',
      componentType: 'axis',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          const cx = (params.viewBox.x1 + params.viewBox.x2) / 2;
          const cy = (params.viewBox.y1 + params.viewBox.y2) / 2;
          return {
            x: cx,
            y: cy,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width() / 2, y: 0 },
            items: [
              new Array(5).fill(1).map((entry, index) => {
                return {
                  id: index,
                  value: index / 5,
                  label: index / 5,
                  rawValue: index / 5
                };
              })
            ],
            grid: { visible: true, center: { x: cx, y: cy }, startAngle: 0, endAngle: 2 * Math.PI, type: 'circle' }
          };
        }
      }
    },
    {
      type: 'component',
      id: 'angleAxis',
      componentType: 'axis',
      axisType: 'circle',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            center: {
              x: (params.viewBox.x1 + params.viewBox.x2) / 2,
              y: (params.viewBox.y1 + params.viewBox.y2) / 2
            },
            startAngle: 0,
            endAngle: Math.PI * 2,
            radius: Math.min(params.viewBox.height(), params.viewBox.width()) / 2,
            items: [
              new Array(12).fill(1).map((entry, index) => {
                return {
                  id: index,
                  value: (index * 30) / 360,
                  label: index * 30,
                  rawValue: index * 30
                };
              })
            ],
            grid: { visible: true }
          };
        }
      }
    },

    {
      type: 'line',
      from: { data: 'table' },
      encode: {
        update: {
          curveType: 'basis',
          x: { field: 'x' },
          y: { field: 'y' },
          stroke: '#6690F2'
        },
        hover: {
          stroke: 'red',
          lineWidth: 2
        }
      }
    }
    // {
    //   type: 'symbol',
    //   id: 'symbol',
    //   from: { data: 'table' },
    //   encode: {
    //     update: {
    //       x: { scale: 'xscale', field: 'x' },
    //       y: { scale: 'yscale', field: 'y' },
    //       fill: '#6690F2'
    //     },
    //     hover: {
    //       fill: 'red',
    //       lineWidth: 2
    //     }
    //   }
    // },
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## Related Tutorials
