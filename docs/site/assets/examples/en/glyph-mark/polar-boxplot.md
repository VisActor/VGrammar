---
category: examples
group: glyph-mark
title: Boxplot in Polar Coordinates
order: 30-2
cover: /vgrammar/preview/glyph-mark-polar-boxplot_0.7.6.png
---

# Boxplot in Polar Coordinates

## Code Demo

```javascript livedemo template=vgrammar
VGrammar.registerBoxplotGlyph();

const spec = {
  padding: { top: 30, right: 40, bottom: 30, left: 40 },

  data: [
    {
      id: 'table',
      values: [
        {
          test: 'test0',
          value1: 1600,
          value2: 1200,
          value3: 800,
          value4: 700,
          value5: 500
        },
        {
          test: 'test1',
          value1: 1900,
          value2: 1000,
          value3: 400,
          value4: 300,
          value5: 100
        },
        {
          test: 'test2',
          value1: 1300,
          value2: 1200,
          value3: 200,
          value4: -100,
          value5: -500
        },
        {
          test: 'test3',
          value1: 1400,
          value2: 1000,
          value3: 900,
          value4: 800,
          value5: 500
        },
        {
          test: 'test4',
          value1: 1200,
          value2: 500,
          value3: 400,
          value4: -100,
          value5: -400
        },
        {
          test: 'test5',
          value1: 1400,
          value2: 1000,
          value3: 900,
          value4: 700,
          value5: 300
        }
      ]
    }
  ],

  signals: [
    {
      id: 'polar',
      update: (signal, params) => {
        return {
          x: params.viewBox.x1 + params.viewBox.width() / 2,
          y: params.viewBox.y1 + params.viewBox.height() / 2,
          radius: Math.min(params.viewBox.width(), params.viewBox.height()) / 2
        };
      },
      dependency: ['viewBox']
    }
  ],

  scales: [
    {
      id: 'angleScale',
      type: 'point',
      domain: { data: 'table', field: 'test' },
      range: [0, Math.PI * 2],
      padding: 0.5
    },
    {
      id: 'radiusScale',
      type: 'linear',
      domain: [-1000, 2000],
      range: (scale, params) => [0, params.polar.radius],
      dependency: 'polar'
    },
    {
      id: 'valueScale',
      type: 'linear',
      domain: [-1000, 2000],
      range: (scale, params) => [params.polar.x, params.polar.x + params.polar.radius],
      dependency: 'polar'
    },
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

  interactions: [
    {
      type: 'crosshair',
      scale: 'angleScale',
      crosshairShape: 'rect',
      crosshairType: 'angle',
      attributes: (datum, element, params) => {
        return {
          radius: params.polar.radius,
          center: {
            x: params.polar.x,
            y: params.polar.y
          }
        };
      },
      dependency: 'polar'
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'angleScale',
      axisType: 'circle',
      encode: {
        update: (datum, element, params) => {
          return {
            center: { x: params.polar.x, y: params.polar.y },
            radius: params.polar.radius,
            grid: { visible: true }
          };
        }
      },
      dependency: 'polar'
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'radiusScale',
      tickCount: 5,
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.polar.x,
            y: params.polar.y,
            start: { x: 0, y: 0 },
            end: { x: params.polar.radius, y: 0 },
            grid: { visible: true, center: { x: 0, y: 0 }, type: 'circle', closed: true, sides: 10 }
          };
        }
      },
      dependency: 'polar'
    },

    {
      type: 'glyph',
      from: { data: 'table' },
      glyphType: 'boxplot',
      glyphConfig: { direction: 'horizontal' },
      encode: {
        update: {
          y: (datum, element, params) => params.polar.y,
          angle: { scale: 'angleScale', field: 'test' },
          anchor: (datum, element, params) => [params.polar.x, params.polar.y],

          max: { scale: 'valueScale', field: 'value1' },
          q3: { scale: 'valueScale', field: 'value2' },
          median: { scale: 'valueScale', field: 'value3' },
          q1: { scale: 'valueScale', field: 'value4' },
          min: { scale: 'valueScale', field: 'value5' },

          boxHeight: 30,
          ruleHeight: 20,

          stroke: 'black',
          fill: { scale: 'colorScale', field: 'test' },
          opacity: 1
        },
        hover: {
          opacity: 0.7
        }
      },
      animation: {
        enter: {
          type: 'boxplotScaleIn',
          duration: 1000
        },
        state: {
          duration: 500
        }
      },
      dependency: 'polar'
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
