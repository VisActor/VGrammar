---
category: examples
group: basic-mark-rect
title: Range Bar Chart
order: 0-1
cover: /vgrammar/preview/basic-mark-rect-range-rect_0.7.6.png
---

# Range Bar Chart

## Code Demonstration

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'weather',
      values: [
        {
          date: '05.16',
          high: 32,
          low: 20
        },
        {
          date: '05.17',
          high: 22,
          low: 25
        },
        {
          date: '05.18',
          high: 26,
          low: 19
        },
        {
          date: '05.19',
          high: 26,
          low: 17
        },
        {
          date: '05.20',
          high: 28,
          low: 20
        },
        {
          date: '05.21',
          high: 31,
          low: 19
        },
        {
          date: '05.22',
          high: 21,
          low: 15
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'weather', field: 'date' },
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
      domain: { data: 'weather', field: ['low', 'high'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
    }
  ],

  interactions: [
    {
      type: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'rect',
      crosshairType: 'x',
      container: '#container'
    },

    {
      type: 'tooltip',
      selector: '#rect',
      title: { value: { field: 'date' } },
      content: [
        {
          key: '最高值',
          value: { field: 'high' },
          symbol: {
            symbolType: 'circle',
            fill: '#6690F2'
          }
        },

        {
          key: '最低值',
          value: { field: 'low' },
          symbol: {
            symbolType: 'circle',
            fill: '#6690F2'
          }
        }
      ]
    }
  ],

  marks: [
    {
      type: 'group',
      id: 'container',
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
          type: 'rect',
          id: 'rect',
          from: { data: 'weather' },
          encode: {
            update: {
              x: { scale: 'xscale', field: 'date', band: 0.25 },
              width: { scale: 'xscale', band: 0.5 },
              y: { scale: 'yscale', field: 'high' },
              y1: { scale: 'yscale', field: 'low' },
              fill: '#6690F2'
            },
            hover: {
              fill: 'red'
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

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## Related Tutorials
