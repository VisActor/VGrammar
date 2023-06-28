---
category: examples
group: animate
title: 自定义动画
cover:
---

# 自定义动画

基于 VRender 渲染引擎，实现自定义的动画效果

## 关键配置

## 代码演示

```javascript livedemo
const spec = {
  width: 1600,
  height: 400,
  padding: { top: 60, right: 30, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          sales: 'Jack',
          2020: 324,
          2021: 420
        },
        {
          sales: 'Marry',
          2020: 240,
          2021: 321
        },
        {
          sales: 'Tom',
          2020: 601,
          2021: 561
        },
        {
          sales: 'Lily',
          2020: 320,
          2021: 287
        },
        {
          sales: 'Lucy',
          2020: 629,
          2021: 400
        },
        {
          sales: 'Nancy',
          2020: 320,
          2021: 312
        },
        {
          sales: 'Ada',
          2020: 420,
          2021: 312
        },
        {
          sales: 'Bill',
          2020: 563,
          2021: 890
        },
        {
          sales: 'Maggie',
          2020: 223,
          2021: 444
        }
      ]
    }
  ],

  scales: [
    {
      id: 'yScale',
      type: 'band',
      domain: { data: 'table', field: 'sales' },
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      padding: 0.05,
      round: true,
      dependency: ['viewBox']
    },
    {
      id: 'xScale',
      type: 'linear',
      domain: { data: 'table', field: '2021' },
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      zero: true,
      dependency: ['viewBox']
    }
  ],

  marks: [
    {
      type: 'text',
      id: 'title',
      encode: {
        update: (datum, element, params) => {
          return {
            x: (params.viewBox.x1 + params.viewBox.x2) / 2,
            y: params.viewBox.y1,
            fontSize: 40,
            text: '2021年销售额统计',
            textAlign: 'center'
          };
        }
      },
      animation: {
        enter: {
          custom: VRender.FadeInPlus,
          // customParameters: { direction: 4 },
          duration: 2000
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'group',
      id: 'container',
      encode: {
        update: (datum, element, params) => {
          return {
            // x: params.padding.left,
            // y: params.padding.top,
            width: params.viewBox.width(),
            height: params.viewBox.height()
          };
        }
      },
      dependency: ['viewBox'],

      marks: [
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'yScale',
          crosshairShape: 'rect',
          crosshairType: 'y',
          encode: {
            update: (datum, element, params) => {
              return {
                start: { x: params.viewBox.x1 },
                end: { x: params.viewBox.x2 }
              };
            }
          },
          dependency: ['viewBox']
        },
        {
          type: 'component',
          componentType: 'axis',
          scale: 'xScale',
          tickCount: 5,
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
          animation: {
            enter: {
              custom: VRender.GroupFadeIn,
              duration: 2000
            }
          },
          dependency: ['viewBox']
        },
        {
          type: 'component',
          componentType: 'axis',
          scale: 'yScale',
          encode: {
            update: (datum, element, params) => {
              return {
                x: params.viewBox.x1,
                y: params.viewBox.y1,
                start: { x: 0, y: params.viewBox.height() },
                end: { x: 0, y: 0 },
                line: { visible: false },
                tick: { style: { strokeOpacity: 0 } },
                verticalFactor: -1
              };
            }
          },
          animation: {
            enter: {
              custom: VRender.GroupFadeIn,
              duration: 2000
            }
          },
          dependency: ['viewBox']
        },
        {
          type: 'rect',
          from: { data: 'table' },
          encode: {
            update: {
              x: { scale: 'xScale', field: '2021' },
              x1: { scale: 'xScale', value: 0 },
              y: { scale: 'yScale', field: 'sales', band: 0.25 },
              height: { scale: 'yScale', band: 0.5 },
              fill: '#6690F2'
            }
          },
          animation: {
            enter: [
              {
                type: 'fadeIn',
                duration: 2000
              },
              {
                custom: VRender.StreamLight,
                customParameters: {
                  attribute: { width: 100, fillColor: '#bcdeff', shadowColor: '#bcdeff' },
                  streamLength: 1600
                },
                duration: 2000,
                startTime: 2000,
                loop: true
              }
            ]
          }
        }
      ]
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
