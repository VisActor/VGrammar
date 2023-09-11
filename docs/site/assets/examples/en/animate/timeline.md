---
category: examples
group: animate
title: Timeline & Animation
order: 60-5
cover: /vgrammar/preview/animate-timeline_0.6.5.png
---

# Timeline & Animation

We have implemented the display of event points through custom `glyphs`, and then demonstrated the playback of the timeline through loop animation.

## Code Demo

```javascript livedemo template=vgrammar
VGrammar.Factory.registerGlyph('event', {
  label: 'text',
  event: 'text',
  dot: 'symbol',
  line: 'rule'
})
  .registerChannelEncoder('x', (channel, encodeValue) => {
    return {
      label: { x: encodeValue },
      event: { x: encodeValue },
      dot: { x: encodeValue },
      line: { x: encodeValue, x1: encodeValue }
    };
  })
  .registerChannelEncoder('color', (channel, encodeValue) => {
    return {
      event: { fill: encodeValue },
      dot: { fill: encodeValue }
    };
  })
  .registerChannelEncoder('y0', (channel, encodeValue) => {
    return {
      label: { y: encodeValue },
      line: { y1: encodeValue }
    };
  })
  .registerChannelEncoder('y1', (channel, encodeValue) => {
    return {
      event: { y: encodeValue - 20 },
      dot: { y: encodeValue - 5 },
      line: { y: encodeValue }
    };
  })
  .registerChannelEncoder('label', (channel, encodeValue) => {
    return {
      label: { text: encodeValue }
    };
  })
  .registerChannelEncoder('event', (channel, encodeValue) => {
    return {
      event: { text: encodeValue }
    };
  })
  .registerDefaultEncoder(() => {
    return {
      label: {
        textAlign: 'center',
        textBaseline: 'top',
        // fontFamily: '行楷-简',
        fontSize: 12,
        fontStyle: 'normal',
        lineHeight: 24,
        fillOpacity: 0.6,
        fill: '#fff'
      },
      event: { textAlign: 'center', fontFamily: '行楷-简', fontSize: 20, fontStyle: 'bold', lineHeight: 16 },
      dot: { shape: 'circle', size: 10, fillOpacity: 0.5 },
      line: { lineWidth: 1, strokeOpacity: 0.3, stroke: '#fff' }
    };
  });

const spec = {
  padding: { top: 0, right: 0, bottom: 60, left: 0 },
  background: 'black',

  data: [
    {
      id: 'source',
      values: [
        { year: '2014-8', event: '订阅号创建', name: '玄魂', node: 'node' },
        { year: '2015', event: '沉寂', name: '玄魂', node: 'node' },
        { year: '2016-4', event: '暗网系列', name: '玄魂', node: 'node' },
        { year: '2016-5', event: 'kali Linux 系列', name: '玄魂', node: 'node1' },
        { year: '2016-6', event: '黑客编程系列', name: '玄魂', node: 'node' },
        { year: '2016-7', event: '如何学习 Python 系列', name: '玄魂', node: 'node' },
        { year: '2016-8', event: `启动'每周1书'赠送计划`, name: '玄魂', node: 'node' },
        { year: '2018-3', event: '如何学 Python 新番', name: '初音', node: 'node' },
        { year: '2018-4', event: 'linux 基础系列', name: '初音', node: 'node' },
        { year: '2018-5', event: 'CTF 实战系列', name: '初音', node: 'node1' },
        { year: '2018-7', event: 'Kali Linux Web渗透测试手册(第二版) 翻译系列', name: '掣雷小组', node: 'node1' },
        { year: '2019-8', event: 'CVE 漏洞系列', name: 'power7089', node: 'node1' },
        { year: '2020-5', event: '磐石计划 ', name: '陈殷', node: 'node1' },
        { year: '2020-12', event: '移动端逆向系列 ', name: 'WhITECat安全团队', node: 'node1' },
        { year: '2021-8', event: '炼石计划', name: 'power7089', node: 'node1' },
        { year: '2023-7', event: '玄魂工作室正式告别', name: '玄魂', node: 'node1' }
      ]
    },
    {
      id: 'table',
      source: 'source',
      transform: [
        {
          type: 'map',
          all: true,
          callback: data => {
            return data.map((entry, index, arr) => {
              return {
                ...entry,
                index,
                group: index < arr.length / 2 ? 0 : 1
              };
            });
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'year' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        const minWidth = params.table.length * 200;
        const width = params.viewBox.width();

        return [params.viewBox.x1, width < minWidth ? params.viewBox.x1 + minWidth : params.viewBox.x2];
      },

      padding: 0,
      round: true
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'year' },
      range: [
        '#5383F4',
        '#7BCF8E',
        '#FF9D2C',
        '#FFDB26',
        '#7568D9',
        '#80D8FB',
        '#1857A3',
        '#CAB0E8',
        '#FF8867',
        '#B9E493',
        '#2CB4A8',
        '#B9E4E3'
      ]
    }
  ],

  marks: [
    {
      type: 'rule',
      dependency: ['width', 'viewBox', 'color'],
      encode: {
        update: (datum, el, params) => {
          const xScale = params.xscale;
          const viewBox = params.viewBox;

          return {
            x: 0,
            y: viewBox.y2,
            y1: viewBox.y2,
            x1: params.width,
            lineWidth: 1,
            strokeOpacity: 0.3,
            stroke: '#fff'
          };
        }
      }
    },
    {
      type: 'glyph',
      glyphType: 'event',
      from: { data: 'table' },
      animation: {
        enter: [
          {
            loop: true,
            duration: 10000,
            easing: 'linear',
            channel: {
              dx: {
                from: (datum, element, params) => {
                  return 0;
                },
                to: (datum, element, params) => {
                  const xScale = params.view.getScaleById('xscale').output();
                  const bandWidth = xScale.bandwidth();
                  const range = xScale.range();
                  return -Math.abs(range[1] - range[0]);
                }
              }
            }
          }
        ]
      },
      dependency: ['xscale', 'viewBox', 'color'],
      encode: {
        update: (datum, el, params) => {
          const xScale = params.xscale;
          const viewBox = params.viewBox;
          const x = xScale.scale(datum.year) + 0.5 * xScale.bandwidth();
          const offset = datum.index % 2 ? 40 : -40;

          return {
            x: x,
            y1: (viewBox.y1 + viewBox.y2) / 2 + offset,
            y0: viewBox.y2,
            color: params.color.scale(datum.year),
            label: datum.year,
            event: [datum.event, datum.name]
          };
        }
      }
    },
    {
      type: 'glyph',
      glyphType: 'event',
      from: { data: 'table' },
      animation: {
        enter: [
          {
            loop: true,
            duration: 10000,
            easing: 'linear',
            channel: {
              dx: {
                from: (datum, element, params) => {
                  const xScale = params.view.getScaleById('xscale').output();
                  const bandWidth = xScale.bandwidth();
                  const range = xScale.range();
                  return Math.abs(range[1] - range[0]);
                },
                to: (datum, element, params) => {
                  return 0;
                }
              }
            }
          }
        ]
      },
      dependency: ['xscale', 'viewBox', 'color'],
      encode: {
        update: (datum, el, params) => {
          const xScale = params.xscale;
          const viewBox = params.viewBox;
          const x = xScale.scale(datum.year) + 0.5 * xScale.bandwidth();
          const offset = datum.index % 2 ? 40 : -40;

          return {
            x: x,
            y1: (viewBox.y1 + viewBox.y2) / 2 + offset,
            y0: viewBox.y2,
            color: params.color.scale(datum.year),
            label: datum.year,
            event: [datum.event, datum.name]
          };
        }
      }
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

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## Related Tutorials
