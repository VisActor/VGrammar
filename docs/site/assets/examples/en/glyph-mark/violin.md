---
category: examples
group: glyph-mark
title: violin chart
order: 30-8
cover: /vgrammar/preview/glyph-mark-violin_0.7.6.png
---

# violin chart

## Code Demonstration

```javascript livedemo template=vgrammar
VGrammar.registerViolinGlyph();

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
          value5: 500,
          density: [
            [0, 0],
            [100, 0.00005],
            [200, 0.0001],
            [300, 0.0001],
            [400, 0.0002],
            [500, 0.0003],
            [600, 0.0007],
            [700, 0.0008],
            [800, 0.0009],
            [900, 0.0008],
            [1000, 0.0008],
            [1200, 0.0006],
            [1300, 0.0005],
            [1400, 0.0004],
            [1500, 0.0003],
            [1600, 0.0003],
            [1700, 0.0002],
            [1800, 0.0001],
            [1900, 0.00005],
            [2000, 0]
          ]
        },
        {
          test: 'test1',
          value1: 1900,
          value2: 1000,
          value3: 400,
          value4: 300,
          value5: 100,
          density: [
            [-100, 0],
            [0, 0.0001],
            [100, 0.0002],
            [200, 0.0004],
            [300, 0.0006],
            [400, 0.0008],
            [500, 0.0007],
            [600, 0.0007],
            [700, 0.0006],
            [800, 0.0006],
            [900, 0.0005],
            [1000, 0.0005],
            [1200, 0.0004],
            [1300, 0.0003],
            [1400, 0.0002],
            [1500, 0.0002],
            [1600, 0.0003],
            [1700, 0.0004],
            [1800, 0.0003],
            [1900, 0.0002],
            [2000, 0.0001],
            [2100, 0]
          ]
        },
        {
          test: 'test2',
          value1: 1300,
          value2: 1200,
          value3: 200,
          value4: -100,
          value5: -500,
          density: [
            [-500, 0],
            [-400, 0.0001],
            [-300, 0.0002],
            [-200, 0.0004],
            [-100, 0.0008],
            [0, 0.0007],
            [100, 0.0003],
            [200, 0.0004],
            [300, 0.0003],
            [400, 0.0003],
            [500, 0.0003],
            [600, 0.0002],
            [700, 0.0002],
            [800, 0.0003],
            [900, 0.0004],
            [1000, 0.0002],
            [1200, 0.0003],
            [1300, 0.0004],
            [1400, 0.0005],
            [1500, 0.0006],
            [1600, 0.0003],
            [1700, 0.0002],
            [1800, 0.0001],
            [1900, 0.0001],
            [2000, 0]
          ]
        },
        {
          test: 'test3',
          value1: 1400,
          value2: 1000,
          value3: 900,
          value4: 800,
          value5: 500,
          density: [
            [0, 0],
            [100, 0],
            [200, 0],
            [300, 0.0001],
            [400, 0.0001],
            [500, 0.0002],
            [600, 0.0003],
            [700, 0.0007],
            [800, 0.0006],
            [900, 0.0006],
            [1000, 0.0002],
            [1200, 0.0001],
            [1300, 0]
          ]
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xScale',
      type: 'point',
      domain: { data: 'table', field: 'test' },
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
      domain: [-800, 2500],
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      zero: true
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
      glyphType: 'violin',
      encode: {
        update: {
          x: { scale: 'xScale', field: 'test' },
          max: { scale: 'yScale', field: 'value1' },
          q3: { scale: 'yScale', field: 'value2' },
          median: { scale: 'yScale', field: 'value3' },
          q1: { scale: 'yScale', field: 'value4' },
          min: { scale: 'yScale', field: 'value5' },
          density: { scale: 'yScale', field: 'density' },
          densitySize: 50,

          width: 10,
          size: 6,

          stroke: 'black',
          violinFill: { scale: 'colorScale', field: 'test' },
          opacity: 1
        },
        hover: {
          opacity: 0.7
        }
      },
      animation: {
        enter: {
          type: 'fadeIn',
          duration: 1000
        },
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

## 相关教程
