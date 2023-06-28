---
category: examples
group: basic-mark-rect
title: 区间柱图
cover:
---

# 区间柱图

## 关键配置

## 代码演示

```ts
const spec = {
  width: 1600,
  height: 400,
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'weather',
      values: [
        {
          date: '05.16',
          low: 32,
          high: 20
        },
        {
          date: '05.17',
          low: 22,
          high: 25
        },
        {
          date: '05.18',
          low: 26,
          high: 19
        },
        {
          date: '05.19',
          low: 26,
          high: 17
        },
        {
          date: '05.20',
          low: 28,
          high: 20
        },
        {
          date: '05.21',
          low: 31,
          high: 19
        },
        {
          date: '05.22',
          low: 21,
          high: 15
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
        return [params.viewBox.x1, params.viewBox.x2];
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
        return [params.viewBox.y2, params.viewBox.y1];
      },
      nice: true
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
      scale: 'xscale',
      crosshairShape: 'rect',
      crosshairType: 'x',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            start: { y: params.viewBox.y1 },
            end: { y: params.viewBox.y2 }
          };
        }
      }
    },
    {
      type: 'rect',
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
};

const vGrammarView = new VGrammarView({
  width: spec.width,
  height: spec.height,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 相关教程
