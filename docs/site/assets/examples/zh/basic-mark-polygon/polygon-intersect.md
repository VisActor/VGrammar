---
category: examples
group: basic-mark-polygon
title: 多边形交集
order: 5-2
cover: /vgrammar/preview/basic-mark-polygon-polygon-intersect_0.7.6.png
---

# 多边形交集

`polygon`图元可以展示任意的多边形

## 代码演示

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  marks: [
    {
      type: 'component',
      id: 'xAxis',
      componentType: 'axis',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          const width = params.viewBox.width();
          const height = params.viewBox.height();
          let tickCount = Math.floor(width / 100);
          tickCount = tickCount % 2 ? tickCount : tickCount + 1;
          const mid = Math.floor(tickCount / 2);

          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1 + height / 2,
            start: { x: 0, y: 0 },
            end: { x: width, y: 0 },
            // grid: { visible: true, length: width },
            items: [
              new Array(tickCount).fill(0).map((entry, index) => {
                const tick = index + mid + 1 - tickCount;
                return {
                  id: index,
                  label: `${tick}`,
                  value: tick / tickCount + 0.5,
                  rawValue: `${tick}`
                };
              })
            ]
          };
        }
      }
    },
    {
      type: 'component',
      id: 'yAxis',
      componentType: 'axis',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          const width = params.viewBox.width();
          const height = params.viewBox.height();
          let tickCount = Math.floor(height / 50);
          tickCount = tickCount % 2 ? tickCount : tickCount + 1;
          const mid = Math.floor(tickCount / 2);

          return {
            x: params.viewBox.x1 + width / 2,
            y: params.viewBox.y1,
            start: { x: 0, y: height },
            end: { x: 0, y: 0 },
            verticalFactor: -1,
            // grid: { visible: true, length: height },
            items: [
              new Array(tickCount).fill(0).map((entry, index) => {
                const tick = index + mid + 1 - tickCount;
                return {
                  id: index,
                  label: `${tick}`,
                  value: tick / tickCount + 0.5,
                  rawValue: `${tick}`
                };
              })
            ]
          };
        }
      }
    },
    {
      type: 'polygon',
      dependency: ['viewBox'],
      encode: {
        update: {
          points: (datum, element, params) => {
            const viewBox = params.viewBox;
            const radius = Math.min(viewBox.width(), viewBox.height()) / 3;
            const cx = (viewBox.x1 + viewBox.x2) / 2 - radius / 3;
            const cy = (viewBox.y1 + viewBox.y2) / 2 + radius / 3;

            return new Array(5).fill(0).map((entry, index) => {
              return {
                x: cx + radius * Math.cos((index * 2 * Math.PI) / 5),
                y: cy + radius * Math.sin((index * 2 * Math.PI) / 5)
              };
            });
          },
          stroke: '#6690F2',
          fill: '#6690F2',
          fillOpacity: 0.3,
          lineWidth: 4
        },
        hover: {
          fill: 'red'
        }
      }
    },
    {
      type: 'polygon',
      dependency: ['viewBox'],
      encode: {
        update: {
          points: (datum, element, params) => {
            const viewBox = params.viewBox;
            const radius = Math.min(viewBox.width(), viewBox.height()) / 3;
            const cx = (viewBox.x1 + viewBox.x2) / 2 + radius / 3;
            const cy = (viewBox.y1 + viewBox.y2) / 2;

            return new Array(6).fill(0).map((entry, index) => {
              return {
                x: cx + radius * Math.cos((index * 2 * Math.PI) / 6),
                y: cy + radius * Math.sin((index * 2 * Math.PI) / 6)
              };
            });
          },
          stroke: '#70D6A3',
          fill: '#70D6A3',
          fillOpacity: 0.3,
          lineWidth: 4
        },
        hover: {
          fill: 'red'
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
