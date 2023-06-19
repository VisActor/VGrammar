---
category: examples
group: mark-interval
title: 条形图
cover:
---

# 基础柱图

## 关键配置

## 代码演示

```ts
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        { category: 'A', amount: 28, index: 0, group: 'new' },
        { category: 'B', amount: 55, index: 1, group: 'new' },
        { category: 'C', amount: -43, index: 2, group: 'new' },
        { category: 'D', amount: 91, index: 3, group: 'new' },
        { category: 'E', amount: 81, index: 4, group: 'new' },
        { category: 'F', amount: 53, index: 5, group: 'new' },
        { category: 'G', amount: 19, index: 6, group: 'new' },
        { category: 'H', amount: 87, index: 7, group: 'new' },

        { category: 'A', amount: 28, index: 0, group: 'old' },
        { category: 'B', amount: 65, index: 1, group: 'old' },
        { category: 'C', amount: 43, index: 2, group: 'old' },
        { category: 'D', amount: 41, index: 3, group: 'old' },
        { category: 'E', amount: 61, index: 4, group: 'old' },
        { category: 'F', amount: 23, index: 5, group: 'old' },
        { category: 'G', amount: 39, index: 6, group: 'old' },
        { category: 'H', amount: 47, index: 7, group: 'old' }
      ]
    },
    {
      id: 'markData',
      source: 'table'
    }
  ],

  coordinates: [
    {
      id: 'coord',
      dependency: ['viewBox'],
      start: (coord, params) => {
        return [params.viewBox.x1, params.viewBox.y1];
      },
      end: (coord, params) => {
        return [params.viewBox.x2, params.viewBox.y2];
      },
      transpose: true
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'markData', field: 'category' },
      range: { coordinate: 'coord', dimension: 'x' },
      padding: 0.05
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'markData', field: 'amount' },
      range: { coordinate: 'coord', dimension: 'y' },
      nice: true
    },
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'group' },
      range: colorSchemeForLight
    }
  ],

  marks: [
    {
      type: 'group',
      layout: {
        display: 'relative',
        updateViewSignals: true
      },

      marks: [
        {
          type: 'interval',
          id: 'bar',
          layout: {
            position: 'content',
            skipBeforeLayouted: true
          },
          groupBy: 'group',
          coordinate: 'coord',
          from: { data: 'markData' },
          transform: [
            {
              type: 'dodge',
              maxWidth: 24
            }
          ],
          encode: {
            update: {
              x: { scale: 'xscale', field: 'category' },
              y: { scale: 'yscale', field: 'amount' },
              fill: { scale: 'colorScale', field: 'group' }
            },
            hover: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              cursor: 'pointer'
            }
          }
        },
        {
          type: 'text',
          id: 'text',
          layout: {
            position: 'content',
            skipBeforeLayouted: true
          },
          coordinate: 'coord',
          interactive: false,
          from: { data: 'markData' },
          groupBy: 'group',
          transform: [
            {
              type: 'dodge',
              maxWidth: 24
            }
          ],
          encode: {
            update: {
              textAlign: 'center',
              textBaseline: 'middle',
              fontSize: 10,
              x: { scale: 'xscale', field: 'category' },
              y: { scale: 'yscale', field: 'amount' },
              text: { field: 'amount' },
              fill: '#333'
            }
          }
        },

        {
          id: 'xAxis',
          type: 'component',
          layout: {
            position: 'auto'
          },
          componentType: 'axis',
          scale: 'xscale',
          dependency: ['yscale']
        },

        {
          id: 'yAxis',
          type: 'component',
          layout: {
            position: 'auto'
          },
          componentType: 'axis',
          tickCount: 5,
          scale: 'yscale'
        },

        {
          type: 'component',
          layout: {
            position: 'top'
          },
          componentType: 'legend',
          scale: 'colorScale',
          target: {
            data: 'markData',
            filter: 'amount'
          },
          dependency: ['viewBox'],
          encode: {
            update: (datum, el, params) => {
              return {
                x: params.viewBox.x1,
                y: 0,
                layout: 'horizontal'
              };
            }
          }
        }
      ]
    }
  ]
};

const vGrammarView = new VGrammarView({
  autoFit: true,
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
