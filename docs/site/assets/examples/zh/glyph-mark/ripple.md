---
category: examples
group: glyph-mark
title: 涟漪点折线图
order: 30-4
cover: /vgrammar/preview/glyph-mark-ripple_0.6.5.png
---

# 涟漪点折线图

## 代码演示

```javascript livedemo template=vgrammar
VGrammar.registerRippleGlyph();

const spec = {
  padding: { top: 30, right: 40, bottom: 30, left: 40 },
  signals: [
    {
      id: 'test',
      value: 'testValue'
    }
  ],

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
      id: 'normalData',
      source: 'table',
      transform: [
        {
          type: 'filter',
          callback: (datum, params) => {
            return datum.time !== '16:00';
          },
          dependency: ['test']
        }
      ]
    },
    {
      id: 'highlightData',
      source: 'table',
      transform: [
        {
          type: 'filter',
          callback: (datum, params) => {
            return datum.time === '16:00';
          }
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
      type: 'line',
      from: { data: 'table' },
      encode: {
        update: {
          x: { scale: 'xScale', field: 'time' },
          y: { scale: 'yScale', field: 'value' },
          stroke: '#6690F2',
          lineWidth: 2
        }
      }
    },
    {
      type: 'symbol',
      from: { data: 'normalData' },
      encode: {
        update: {
          x: { scale: 'xScale', field: 'time' },
          y: { scale: 'yScale', field: 'value' },
          size: 30,
          fill: '#6690F2'
        }
      }
    },
    {
      type: 'glyph',
      glyphType: 'ripplePoint',
      from: { data: 'highlightData' },
      encode: {
        update: {
          x: { scale: 'xScale', field: 'time' },
          y: { scale: 'yScale', field: 'value' },
          size: 30,
          fill: '#6690F2',
          ripple: 0
        }
      },
      animation: {
        enter: {
          channel: {
            ripple: { from: 0, to: 1 }
          },
          easing: 'linear',
          loop: true
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
