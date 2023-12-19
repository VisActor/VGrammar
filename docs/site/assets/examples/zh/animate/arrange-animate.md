---
category: examples
group: animate
title: 动画编排
order: 60-4
cover: /vgrammar/preview/animate-arrange-animate_0.7.6.gif
---

# 动画编排

当常见的动画配置不能满足需求的时候，可以通过动画编排可以定制各个图元之间动画的顺序、关系

## 代码演示

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 30, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          month: 'Jan.',
          product: 'A',
          value: 203
        },
        {
          month: 'Jan.',
          product: 'B',
          value: 120
        },
        {
          month: 'Jan.',
          product: 'C',
          value: 230
        },
        {
          month: 'Feb.',
          product: 'A',
          value: 129
        },
        {
          month: 'Feb.',
          product: 'B',
          value: 430
        },
        {
          month: 'Feb.',
          product: 'C',
          value: 233
        },
        {
          month: 'Mar.',
          product: 'A',
          value: 100
        },
        {
          month: 'Mar.',
          product: 'B',
          value: 100
        },
        {
          month: 'Mar.',
          product: 'C',
          value: 100
        },
        {
          month: 'Apr.',
          product: 'A',
          value: 100
        },
        {
          month: 'Apr.',
          product: 'B',
          value: 100
        },
        {
          month: 'May',
          product: 'A',
          value: 221
        },
        {
          month: 'May',
          product: 'B',
          value: 410
        },
        {
          month: 'May',
          product: 'C',
          value: 309
        },
        {
          month: 'Jun.',
          product: 'A',
          value: 221
        },
        {
          month: 'Jun.',
          product: 'B',
          value: 221
        },
        {
          month: 'Jun.',
          product: 'C',
          value: 221
        },
        {
          month: 'Jul.',
          product: 'A',
          value: 15
        },
        {
          month: 'Jul.',
          product: 'B',
          value: 15
        },
        {
          month: 'Jul.',
          product: 'C',
          value: 15
        },
        {
          month: 'Aug.',
          product: 'A',
          value: 20
        },
        {
          month: 'Aug.',
          product: 'B',
          value: 20
        },
        {
          month: 'Aug.',
          product: 'C',
          value: 20
        },
        {
          month: 'Sep.',
          product: 'A',
          value: 19
        },
        {
          month: 'Sep.',
          product: 'B',
          value: 19
        },
        {
          month: 'Sep.',
          product: 'C',
          value: 19
        },
        {
          month: 'Oct.',
          product: 'A',
          value: 15
        },
        {
          month: 'Oct.',
          product: 'B',
          value: 15
        },
        {
          month: 'Oct.',
          product: 'C',
          value: 15
        },
        {
          month: 'Nov.',
          product: 'A',
          value: 19
        },
        {
          month: 'Nov.',
          product: 'B',
          value: 19
        },
        {
          month: 'Nov.',
          product: 'C',
          value: 19
        },
        {
          month: 'Dec.',
          product: 'A',
          value: 15
        },
        {
          month: 'Dec.',
          product: 'B',
          value: 15
        },
        {
          month: 'Dec.',
          product: 'C',
          value: 15
        }
      ]
    },
    {
      id: 'stack',
      source: 'table',
      transform: [
        {
          type: 'stack',
          dimensionField: 'month',
          stackField: 'value',
          asStack: 'value',
          asPrevStack: 'lastValue'
        }
      ]
    }
  ],

  interactions: [
    {
      type: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'rect',
      crosshairType: 'x',
      container: '#container'
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'stack', field: 'month' },
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
      domain: { data: 'stack', field: ['value', 'lastValue'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'stack', field: 'month' },
      range: [
        '#6690F2',
        '#70D6A3',
        '#B4E6E2'
        // '#63B5FC',
        // '#FF8F62',
        // '#FFDC83',
        // '#BCC5FD',
        // '#A29BFE',
        // '#63C4C7',
        // '#F68484'
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
          type: 'text',
          id: 'title',
          encode: {
            update: (datum, element, params) => {
              return {
                x: 10,
                y: -25,
                fill: '#000',
                fontSize: 24,
                text: '全年产品销售额统计',
                textBaseline: 'top'
              };
            }
          },
          dependency: ['viewBox']
        },
        {
          type: 'component',
          id: 'leftAxis',
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
          id: 'bottomAxis',
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
          id: 'bar',
          from: { data: 'stack' },
          groupBy: 'product',
          key: 'month',
          encode: {
            update: {
              x: { scale: 'xscale', field: 'month', band: 0.25 },
              width: { scale: 'xscale', band: 0.5 },
              y: { scale: 'yscale', field: 'value' },
              y1: { scale: 'yscale', field: 'lastValue' },
              fill: { scale: 'color', field: 'product' }
            },
            hover: {
              fill: 'red'
            }
          },
          dependency: ['viewBox']
        }
      ]
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  // autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync().then(() => {
  const title = vGrammarView.getMarkById('title');
  const leftAxis = vGrammarView.getMarkById('leftAxis');
  const bottomAxis = vGrammarView.getMarkById('bottomAxis');
  const bar = vGrammarView.getMarkById('bar');
  const viewBox = vGrammarView.getSignalById('viewBox');

  const animation0 = title.animate.run({
    channel: {
      text: {
        from: '',
        to: '全年产品销售额统计'
      }
    },
    custom: VRender.InputText,
    duration: 2000,
    easing: 'linear'
  });
  const animation1 = leftAxis.animate
    .run({
      custom: VRender.GroupFadeIn,
      duration: 2000
    })
    .after(animation0);
  const animation2 = bottomAxis.animate
    .run({
      custom: VRender.GroupFadeIn,
      duration: 2000
    })
    .parallel(animation1);
  const animation3 = bar.animate
    .run({
      type: 'growHeightIn',
      duration: 2000,
      options: { overall: viewBox.getValue().y2, orient: 'negative' }
    })
    .after(animation2);
});

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 相关教程
