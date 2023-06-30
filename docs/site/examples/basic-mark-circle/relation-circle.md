---
category: examples
group: basic-mark-circle
title: 相关性图表
cover:
---

# 相关性图表

在这个图表中，我们通过`circle` 的半径表示相关性的大小，越靠近中心点，越相关

## 代码演示

```javascript livedemo template=vgrammar
VGrammar.registerRippleGlyph();
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        { word: '输入法哪个好用', pv: 15952, ratio: 94, sim: 3932 },
        { word: '谷歌拼音输入法', pv: 11032, ratio: 97, sim: 2799 },
        { word: '讯飞输入法', pv: 107908, ratio: 102, sim: 2645 },
        { word: 'QQ输入法', pv: 74912, ratio: 99, sim: 2189 },
        { word: '百度输入法', pv: 193624, ratio: 121, sim: 2100 },
        { word: '搜狗输入法', pv: 835168, ratio: 88, sim: 2050 },
        { word: '谷歌输入法', pv: 14140, ratio: 96, sim: 1953 },
        { word: '手心输入法', pv: 19236, ratio: 97, sim: 1870 },
        { word: '输入法不见了', pv: 1968, ratio: 109, sim: 1705 },
        { word: '输入法哪个最好用', pv: 812, ratio: 150, sim: 1567 },
        { word: '必应输入法', pv: 4602, ratio: 91, sim: 1522 },
        { word: '章鱼输入法', pv: 18262, ratio: 97, sim: 1486 },
        { word: '输入法下载', pv: 34186, ratio: 91, sim: 1278 },
        { word: '拼音输入法', pv: 7186, ratio: 86, sim: 1009 },
        { word: 'SHURUFA', pv: 13418, ratio: 102, sim: 924 },
        { word: '微软输入法', pv: 4680, ratio: 88, sim: 804 },
        { word: 'GOOGLE输入法', pv: 2206, ratio: 97, sim: 800 },
        { word: '输入法切换不出来', pv: 15112, ratio: 85, sim: 764 },
        { word: '章鱼输入法下载', pv: 8204, ratio: 135, sim: 754 },
        { word: '讯飞输入法下载', pv: 5590, ratio: 106, sim: 609 },
        { word: '输入法搜狗', pv: 352, ratio: 132, sim: 593 },
        { word: '输入法皮肤', pv: 2476, ratio: 103, sim: 540 },
        { word: '紫光输入法', pv: 1582, ratio: 86, sim: 538 },
        { word: '输入法设置', pv: 1298, ratio: 75, sim: 527 },
        { word: '搜狗输入法下载安装', pv: 126182, ratio: 102, sim: 521 },
        { word: '微软拼音输入法', pv: 3442, ratio: 88, sim: 510 },
        { word: 'QQ拼音输入法', pv: 24912, ratio: 98, sim: 478 },
        { word: '输入发', pv: 150, ratio: 125, sim: 465 },
        { word: 'SOUGOU输入法', pv: 264, ratio: 89, sim: 452 },
        { word: '微软拼音', pv: 2772, ratio: 93, sim: 443 }
      ]
    }
  ],

  scales: [
    {
      id: 'sizeScale',
      type: 'linear',
      domain: { data: 'table', field: 'pv' },
      range: [12, 30]
    },
    {
      id: 'radiusScale',
      type: 'linear',
      dependency: ['viewBox'],
      domain: { data: 'table', field: 'sim' },
      zero: true,
      range: (scale, params) => {
        const minRadius = Math.max(Math.min(params.viewBox.width() / 2, params.viewBox.height() / 2) * 0.2, 20);
        const maxRadius = Math.max(params.viewBox.width(), params.viewBox.height()) / 2;
        return [minRadius, maxRadius];
      }
    },
    {
      id: 'angleScale',
      type: 'band',
      domain: { data: 'table', field: 'word' },
      range: [Math.PI / 2, (-3 * Math.PI) / 2]
    }
  ],

  marks: [
    {
      type: 'glyph',
      glyphType: 'ripplePoint',
      dependency: ['viewBox'],
      encode: {
        update: {
          x: (datum, element, params) => {
            return params.viewBox.x1 + params.viewBox.width() / 2;
          },
          y: (datum, element, params) => {
            return params.viewBox.y1 + params.viewBox.height() / 2;
          },
          size: (datum, element, params) => {
            return Math.max(params.viewBox.width(), params.viewBox.height()) / 2;
          },
          fill: '#6690F2',
          opacity: 0.2,
          ripple: 0
        }
      }
    },
    {
      type: 'circle',
      dependency: ['viewBox', 'radiusScale'],
      encode: {
        update: {
          x: (datum, element, params) => {
            return params.viewBox.x1 + params.viewBox.width() / 2;
          },
          y: (datum, element, params) => {
            return params.viewBox.y1 + params.viewBox.height() / 2;
          },
          radius: (datum, element, params) => {
            return params.radiusScale.range()[0];
          },
          fill: '#6690F2'
        }
      }
    },
    {
      type: 'text',
      dependency: ['viewBox'],
      encode: {
        update: {
          x: (datum, element, params) => {
            return params.viewBox.x1 + params.viewBox.width() / 2;
          },
          y: (datum, element, params) => {
            return params.viewBox.y1 + params.viewBox.height() / 2;
          },
          fill: '#fff',
          fontSize: 20,
          textAlign: 'center',
          textBaseline: 'middle',
          text: '输入法'
        }
      }
    },
    {
      type: 'circle',
      from: { data: 'table' },
      dependency: ['viewBox', 'angleScale', 'sizeScale', 'radiusScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const angleScale = params.angleScale;
          const radius = params.radiusScale.scale(datum.sim);
          const domain = angleScale.domain();
          const angle = angleScale.scale(datum.word) + (domain.indexOf(datum.word) % 2 ? Math.PI : 0);
          const cx = viewBox.x1 + viewBox.width() / 2;
          const cy = viewBox.y1 + viewBox.height() / 2;

          console.log(datum, element);

          return {
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle),
            radius: params.sizeScale.scale(datum.pv),
            fill: '#6690F2'
          };
        },
        hover: {
          fill: 'red'
        }
      }
    },
    {
      type: 'text',
      from: { data: 'table' },
      dependency: ['viewBox', 'angleScale', 'sizeScale', 'radiusScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const angleScale = params.angleScale;
          const radius = params.radiusScale.scale(datum.sim);
          const domain = angleScale.domain();
          const angle = angleScale.scale(datum.word) + (domain.indexOf(datum.word) % 2 ? Math.PI : 0);
          const cx = viewBox.x1 + viewBox.width() / 2;
          const cy = viewBox.y1 + viewBox.height() / 2;

          return {
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle) + params.sizeScale.scale(datum.pv) + 10,
            text: datum.word,
            textAlign: 'center',
            textBaseline: 'middle',
            fill: '#333'
          };
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
