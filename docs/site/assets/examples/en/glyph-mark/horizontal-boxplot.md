---
category: examples
group: glyph-mark
title: Horizontal Boxplot
order: 30-1
cover: /vgrammar/preview/glyph-mark-horizontal-boxplot_0.7.6.png
---

# Horizontal Boxplot

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

  scales: [
    {
      id: 'xScale',
      type: 'linear',
      domain: { data: 'table', field: ['value1', 'value2', 'value3', 'value4', 'value5'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      zero: true
    },
    {
      id: 'yScale',
      type: 'point',
      domain: { data: 'table', field: 'test' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      padding: 0.5,
      round: true
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
      scale: 'yScale',
      crosshairShape: 'rect',
      crosshairType: 'y',
      attributes: (datum, element, params) => {
        return {
          start: { x: params.viewBox.x1 },
          end: { x: params.viewBox.x2 }
        };
      },
      dependency: ['viewBox']
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yScale',
      dependency: ['viewBox'],
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
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xScale',
      tickCount: 5,
      dependency: ['viewBox'],
      encode: {
        update: (datum, element, params) => {
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
      type: 'glyph',
      from: { data: 'table' },
      glyphType: 'boxplot',
      glyphConfig: { direction: 'horizontal' },
      encode: {
        update: {
          y: { scale: 'yScale', field: 'test' },
          max: { scale: 'xScale', field: 'value1' },
          q3: { scale: 'xScale', field: 'value2' },
          median: { scale: 'xScale', field: 'value3' },
          q1: { scale: 'xScale', field: 'value4' },
          min: { scale: 'xScale', field: 'value5' },

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
