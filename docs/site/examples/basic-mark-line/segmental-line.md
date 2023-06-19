---
category: examples
group: basic-mark-line
title: segmental-line
cover:
---

# 基础柱图

## 关键配置

- `direction` 属性配置为 'horizontal'
- `xField` 属性声明为数值字段
- `yField` 属性声明为分类字段

## 代码演示

```ts
const spec = {
  width: 1600,
  height: 400,
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
          value: -14
        },
        {
          time: '10:00',
          value: -16
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

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      tickCount: -1,
      encode: {
        update: (scale, elment, params) => {
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
      crosshairShape: 'line',
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
      type: 'line',
      from: { data: 'table' },
      encode: {
        enter: {
          lineWidth: 2
        },
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' },
          enableSegments: true,
          stroke: (datum, element, params) => {
            return datum.value > 0 ? '#6690F2' : '#FF8F62';
          }
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
        update: {
          x: { scale: 'xscale', field: 'time' },
          y: { scale: 'yscale', field: 'value' },
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
  container: CHART_CONTAINER_DOM_ID,
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 相关教程

[柱状图](link)
