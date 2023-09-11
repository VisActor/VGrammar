---
category: examples
group: animate
title: 事件轴&动画
order: 60-5
cover: /vgrammar/preview/animate-timeline_0.6.5.png
---

# 事件轴&动画

我们通过自定义`glyph`实现了事件点的展示，然后通过循环动画展示时间轴的播放

## 代码演示

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
        fontSize: 12,
        fontStyle: 'normal',
        lineHeight: 24,
        fillOpacity: 0.6,
        fill: '#000'
      },
      event: { textAlign: 'center', fontSize: 20, fontStyle: 'bold', lineHeight: 16 },
      dot: { shape: 'circle', size: 10, fillOpacity: 0.5 },
      line: { lineWidth: 1, strokeOpacity: 0.3, stroke: '#000' }
    };
  });

const spec = {
  padding: { top: 0, right: 0, bottom: 60, left: 0 },

  data: [
    {
      id: 'source',
      values: [
        {
          year: '1896',
          event: 'April 6-15',
          name: 'Athens'
        },
        {
          year: '1900',
          event: 'May 20-October 28',
          name: 'Paris'
        },
        {
          year: '1904',
          event: 'July 1-November 23',
          name: 'St. Louis'
        },
        {
          year: '1908',
          event: 'April 27-October 31',
          name: 'London'
        },
        {
          year: '1912',
          event: 'May 5-July 22',
          name: 'Stockholm'
        },
        {
          year: '1916',
          event: 'Canceled',
          name: 'Berlin'
        },
        {
          year: '1920',
          event: 'April 20-September 12',
          name: 'Antwerp'
        },
        {
          year: '1924',
          event: 'May 4-July 27',
          name: 'Paris'
        },
        {
          year: '1928',
          event: 'May 17-August 12',
          name: 'Amsterdam'
        },
        {
          year: '1932',
          event: 'July 30-August 14',
          name: 'Los Angeles'
        },
        {
          year: '1936',
          event: 'August 1-16',
          name: 'Berlin'
        },
        {
          year: '1940',
          event: 'Canceled',
          name: 'Tokyo'
        },
        {
          year: '1944',
          event: 'Canceled',
          name: 'London'
        },
        {
          year: '1948',
          event: 'July 29-August 14',
          name: 'London'
        },
        {
          year: '1952',
          event: 'July 19-August 3',
          name: 'Helsinki'
        },
        {
          year: '1956',
          event: 'November 22-December 8',
          name: 'Melbourne'
        },
        {
          year: '1960',
          event: 'August 25-September 11',
          name: 'Rome'
        },
        {
          year: '1964',
          event: 'October 10-24',
          name: 'Tokyo'
        },
        {
          year: '1968',
          event: 'October 12-27',
          name: 'Mexico City'
        },
        {
          year: '1972',
          event: 'August 26-September 10',
          name: 'Munich'
        },
        {
          year: '1976',
          event: 'July 17-August 1',
          name: 'Montreal'
        },
        {
          year: '1980',
          event: 'July 19-August 3',
          name: 'Moscow'
        },
        {
          year: '1984',
          event: 'July 28-August 12',
          name: 'Los Angeles'
        },
        {
          year: '1988',
          event: 'September 17-October 2',
          name: 'Seoul'
        },
        {
          year: '1992',
          event: 'July 25-August 9',
          name: 'Barcelona'
        },
        {
          year: '1996',
          event: 'July 19-August 9',
          name: 'Atlanta'
        },
        {
          year: '2000',
          event: 'September 15-October 1',
          name: 'Sydney'
        },
        {
          year: '2004',
          event: 'August 13-29',
          name: 'Athens'
        },
        {
          year: '2008',
          event: 'August 8-24',
          name: 'Beijing'
        },
        {
          year: '2012',
          event: 'July 27-August 12',
          name: 'London'
        },
        {
          year: '2016',
          event: 'August 5-21',
          name: 'Rio'
        },
        {
          year: '2021',
          event: 'July 23-August 8',
          name: 'Tokyo'
        }
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
        '#6690F2',
        '#70D6A3',
        '#B4E6E2',
        '#63B5FC',
        '#FF8F62',
        '#FFDC83',
        '#BCC5FD',
        '#A29BFE',
        '#63C4C7',
        '#F68484'
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
            stroke: '#000'
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
            duration: 20000,
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
            duration: 20000,
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

## 相关教程
