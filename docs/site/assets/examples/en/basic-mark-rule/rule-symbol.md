---
category: examples
group: basic-mark-rule
title: Rule Shape Display
order: 4-1
cover: /vgrammar/preview/basic-mark-rule-rule-symbol_0.7.6.png
---

# Rule Shape Display

Use the `rule` graphic element together with the `symbol` graphic element to draw a **Lollipop** chart.

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
      type: 'rule',
      from: { data: 'table' },
      dependency: ['viewBox'],
      encode: {
        update: {
          y: { scale: 'yscale', field: 'value' },
          y1: (datum, el, params) => {
            return params.viewBox.y2;
          },
          x: { scale: 'xscale', field: 'time' },
          x1: { scale: 'xscale', field: 'time' },
          lineWidth: 2,
          stroke: '#6690F2'
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

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## Related Tutorials
