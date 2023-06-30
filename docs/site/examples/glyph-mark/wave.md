---
category: examples
group: glyph-mark
title: 水波图
order: 30-5

cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vgrammar-glyph-mark-wave.png
---

# 水波图

## 代码演示

```javascript livedemo template=vgrammar
VGrammar.registerWaveGlyph();

const spec = {
  padding: { top: 30, right: 40, bottom: 30, left: 40 },

  data: [
    {
      id: 'table',
      values: [{ value: 0.35 }]
    }
  ],

  signals: [
    {
      id: 'size',
      update: (value, params) => {
        return Math.min(params.viewWidth, params.viewHeight);
      },
      dependency: ['viewWidth', 'viewHeight', 'padding']
    }
  ],

  scales: [
    {
      id: 'yScale',
      type: 'linear',
      domain: [0, 1],
      range: (scale, params) => {
        return [params.size, 0];
      },
      dependency: ['size']
    }
  ],

  marks: [
    {
      type: 'group',
      clip: true,
      encode: {
        update: (datum, element, params) => {
          const size = params.size;
          const arc = VRender.createArc({
            x: size / 2,
            y: size / 2,
            outerRadius: size / 2,
            innerRadius: 0,
            startAngle: 0,
            endAngle: Math.PI * 2,
            fill: true
          });
          return {
            x: (params.viewBox.x1 + params.viewBox.x2) / 2 - size / 2,
            y: (params.viewBox.y1 + params.viewBox.y2) / 2 - size / 2,
            width: size,
            height: size,
            stroke: '#6690F2',
            lineWidth: 2,
            fillOpacity: 0.7,
            path: [arc]
          };
        }
      },
      dependency: ['viewBox', 'size'],

      marks: [
        {
          type: 'glyph',
          glyphType: 'wave',
          from: { data: 'table' },
          encode: {
            update: {
              y: { scale: 'yScale', field: 'value' },
              height: 1000,
              fill: '#6690F2',
              wave: 0
            }
          },
          animation: {
            enter: {
              channel: {
                wave: { from: 0, to: 1 }
              },
              duration: 2000,
              easing: 'linear',
              loop: true
            }
          }
        },
        {
          type: 'text',
          from: { data: 'table' },
          encode: {
            update: (datum, element, params) => {
              return {
                x: params.size / 2,
                y: params.size / 2,
                text: `${(datum.value * 100).toFixed()}%`,
                fontSize: 60,
                fontWeight: 'bold',
                textBaseline: 'middle',
                textAlign: 'center',
                fill: '#6690F2',
                stroke: '#fff'
              };
            }
          },
          dependency: ['size']
        }
      ]
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
