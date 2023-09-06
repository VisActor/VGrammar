---
category: examples
group: basic-mark-area
title: Vertical Area Chart
order: 2-3
cover: /vgrammar/preview/basic-mark-area-vertical-area_0.6.5.png
---

# Vertical Area Chart

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
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'point',
      domain: { data: 'table', field: 'time' },
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
      type: 'area',
      from: { data: 'table' },
      encode: {
        enter: {
          fill: '#6690F2',
          fillOpacity: 0.4
        },
        update: {
          y: { scale: 'yscale', field: 'time' },
          x: { scale: 'xscale', field: 'value' },
          x1: { scale: 'xscale', value: 0 }
        },
        hover: {
          fill: 'red'
        }
      }
    },
    {
      type: 'line',
      from: { data: 'table' },
      encode: {
        enter: {
          stroke: '#6690F2',
          lineWidth: 2
        },
        update: {
          y: { scale: 'yscale', field: 'time' },
          x: { scale: 'xscale', field: 'value' }
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
          lineWidth: 2,
          fill: '#fff'
        },
        update: {
          x: { scale: 'xscale', field: 'value' },
          y: { scale: 'yscale', field: 'time' }
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
