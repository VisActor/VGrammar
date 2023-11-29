---
category: examples
group: basic-mark-area
title: Basic Area Chart
order: 2-0
cover: /vgrammar/preview/basic-mark-area-basic-area_0.7.6.png
---

# Basic Area Chart

## Code Demonstration

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
  interactions: [
    {
      type: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'line',
      crosshairType: 'x',
      dependencies: ['viewBox'],
      attributes: (scale, elment, params) => {
        return {
          start: { y: params.viewBox.y1 },
          end: { y: params.viewBox.y2 }
        };
      }
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

## Related Tutorials
