---
category: examples
group: glyph-mark
title: Candlestick Chart
order: 30-7
cover: /vgrammar/preview/glyph-mark-candle_0.7.6.png
---

# Candlestick Chart

## Code Demonstration

```javascript livedemo template=vgrammar
VGrammar.Factory.registerGlyph('candle', {
  minMax: 'rule',
  startEnd: 'rect'
})
  .registerChannelEncoder('x', (channel, encodeValue) => {
    return {
      minMax: { x: encodeValue, x1: encodeValue },
      startEnd: { x: encodeValue }
    };
  })
  .registerChannelEncoder('min', (channel, encodeValue) => {
    return {
      minMax: { y: encodeValue }
    };
  })
  .registerChannelEncoder('max', (channel, encodeValue) => {
    return {
      minMax: { y1: encodeValue }
    };
  })
  .registerChannelEncoder('start', (channel, encodeValue) => {
    return {
      startEnd: { y: encodeValue }
    };
  })
  .registerChannelEncoder('end', (channel, encodeValue) => {
    return {
      startEnd: { y1: encodeValue }
    };
  })
  .registerChannelEncoder('boxWidth', (channel, encodeValue) => {
    return {
      startEnd: { width: encodeValue, dx: -encodeValue / 2 }
    };
  });

const spec = {
  padding: { top: 30, right: 40, bottom: 30, left: 40 },

  data: [
    {
      id: 'table',
      values: [
        {
          time: '02-11',
          start: 6.91,
          max: 7.31,
          min: 6.48,
          end: 7.18
        },
        {
          time: '02-12',
          start: 7.01,
          max: 7.14,
          min: 6.8,
          end: 6.85
        },
        {
          time: '02-13',
          start: 7.05,
          max: 7.2,
          min: 6.8,
          end: 6.9
        },
        {
          time: '02-14',
          start: 6.98,
          max: 7.27,
          min: 6.84,
          end: 7.18
        },
        {
          time: '02-15',
          start: 7.09,
          max: 7.44,
          min: 6.93,
          end: 7.17
        },
        {
          time: '02-16',
          start: 7.1,
          max: 7.17,
          min: 6.82,
          end: 7
        },
        {
          time: '02-17',
          start: 7.01,
          max: 7.5,
          min: 7.01,
          end: 7.46
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xScale',
      type: 'point',
      domain: { data: 'table', field: 'time' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.5,
      round: true
    },
    {
      id: 'yScale',
      type: 'linear',
      domain: { data: 'table', field: ['start', 'end', 'min', 'max'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      }
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'xScale',
      crosshairShape: 'rect',
      crosshairType: 'x',
      encode: {
        update: (datum, element, params) => {
          return {
            start: { y: params.viewBox.y1 },
            end: { y: params.viewBox.y2 }
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yScale',
      tickCount: 5,
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: 0, y: -params.viewBox.height() },
            verticalFactor: -1
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xScale',
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'glyph',
      from: { data: 'table' },
      glyphType: 'candle',
      encode: {
        update: {
          x: { scale: 'xScale', field: 'time' },
          max: { scale: 'yScale', field: 'max' },
          start: { scale: 'yScale', field: 'start' },
          end: { scale: 'yScale', field: 'end' },
          min: { scale: 'yScale', field: 'min' },

          boxWidth: 60,
          lineWidth: 2,
          stroke: (datum, element, params) => {
            return datum.end >= datum.start ? '#eb5454' : '#46b262';
          },
          fill: (datum, element, params) => {
            return datum.end >= datum.start ? '#eb5454' : '#46b262';
          }
        },
        hover: {
          stroke: '#000'
        }
      },
      animation: {
        state: {
          duration: 500
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
