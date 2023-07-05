---
category: examples
group: mark-cell
title: 日历色块图
order: 20-1
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vgrammar/mark-cell-calender-cell.png
---

# 日历色块图

通过`cell`图元，日历色块图

## 代码演示

```javascript livedemo template=vgrammar
const getCalendarData = dayCount => {
  const DAY = 24 * 60 * 60 * 1000;
  const start = +new Date(2022, 0, 1);
  const data = [];

  for (let i = 0; i < dayCount; i++) {
    data.push({
      date: new Date(start + i * DAY),
      value: Math.random() * 10000,
      index: i
    });
  }
  return data;
};

const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'yearData',
      values: getCalendarData(365)
    },
    {
      id: 'formatData',
      source: 'yearData',
      transform: [
        {
          type: 'map',
          callback: entry => {
            return entry.date.getDay();
          },
          as: 'row'
        },
        {
          type: 'map',
          all: true,
          callback: data => {
            let curColumn = 0;

            data.forEach((entry, index) => {
              entry.column = curColumn;
              if (entry.row === 6) {
                curColumn += 1;
              }
            });

            return data;
          }
        }
      ]
    },
    {
      id: 'monthData',
      source: 'formatData',
      transform: [
        {
          type: 'map',
          all: true,
          callback: data => {
            const monthsData = [];
            const lastRows = [];

            data.sort((a, b) => {
              return a.row - b.row;
            });

            data.forEach((entry, index) => {
              const next = data[index + 1];

              if (next && next.row === entry.row && entry.date.getMonth() !== next.date.getMonth()) {
                const month = entry.date.getMonth() + 1;
                const year = entry.date.getFullYear();
                const key = `${year}-${month}`;

                monthsData.push({ monthKey: key, column: entry.column, row: entry.row, date: entry.date });

                if (entry.row === 6) {
                  lastRows.push({ monthKey: key, column: entry.column, row: 7 });
                }
              }
            });

            return monthsData.concat(lastRows);
          }
        }
      ]
    },
    {
      id: 'monthText',
      source: 'formatData',
      transform: [
        {
          type: 'map',
          all: true,
          callback: data => {
            const textData = [];
            const textMap = data.reduce((res, entry) => {
              const monthKey = `${entry.date.getFullYear()}-${entry.date.getMonth() + 1}`;

              if (!res[monthKey]) {
                res[monthKey] = [];
              }

              res[monthKey].push(entry);

              return res;
            }, {});

            Object.keys(textMap).forEach(key => {
              const dates = textMap[key];
              const columns = dates.reduce((res, entry) => {
                return res.includes(entry.column) ? res : res.concat(entry.column);
              }, []);
              const month = dates[0].date.getMonth() + 1;

              textData.push({
                monthKey: `${dates[0].date.getFullYear()}-${month}`,
                columns,
                column: Math.floor(columns.reduce((res, entry) => res + entry, 0) / columns.length)
              });
            });

            return textData;
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'formatData', field: 'column', sort: (a, b) => a - b },
      padding: 0.05,
      round: true,
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      }
    },
    {
      id: 'yscale',
      type: 'band',
      domain: { data: 'formatData', field: 'row', sort: (a, b) => a - b },
      nice: true,
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      }
    },
    {
      id: 'colorScale',
      type: 'linear',
      domain: { data: 'formatData', field: 'value' },
      config: {
        clamp: true
      },
      range: ['#6690F2', '#fff']
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
          type: 'cell',
          id: 'bar',
          layout: {
            position: 'content',
            skipBeforeLayouted: true
          },
          from: { data: 'formatData' },

          encode: {
            update: {
              x: { scale: 'xscale', field: 'column', band: 0.5 },
              y: { scale: 'yscale', field: 'row', band: 0.5 },
              fill: { scale: 'colorScale', field: 'value' }
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
          from: { data: 'formatData' },

          encode: {
            update: {
              x: { scale: 'xscale', field: 'column', band: 0.5 },
              y: { scale: 'yscale', field: 'row', band: 0.5 },
              text: datum => `${datum.date.getMonth() + 1}-${datum.date.getDate()}`,
              fill: '#333',
              fontSize: 8,
              textAlign: 'center'
            }
          }
        },
        {
          type: 'component',
          layout: {
            position: 'left'
          },
          tickCount: -1,
          componentType: 'axis',
          scale: 'yscale',
          dependency: ['viewBox'],
          encode: {
            update: (datum, el, params) => {
              return {
                label: {
                  formatMethod: (a, b, c) => {
                    if (a === 0) {
                      return '周一';
                    } else if (a === 1) {
                      return '周二';
                    } else if (a === 2) {
                      return '周三';
                    } else if (a === 3) {
                      return '周四';
                    } else if (a === 4) {
                      return '周五';
                    } else if (a === 5) {
                      return '周六';
                    }
                    return '周日';
                  }
                },
                line: { visible: false },
                x: params.viewBox.x1,
                y: params.viewBox.y1,
                start: { x: 0, y: 0 },
                end: { x: 0, y: params.viewBox.height() }
              };
            }
          }
        },

        {
          type: 'line',
          layout: {
            position: 'content',
            skipBeforeLayouted: true
          },
          from: { data: 'monthData' },
          groupBy: 'monthKey',
          key: 'row',
          dependency: ['xscale', 'yscale'],
          encode: {
            update: (datum, el, params) => {
              return {
                curveType: 'stepBefore',
                x: params.xscale.scale(datum.column) + params.xscale.bandwidth(),
                y:
                  datum.row === 7
                    ? params.yscale.scale(datum.row - 1) + params.yscale.bandwidth()
                    : params.yscale.scale(datum.row),
                stroke: 'red',
                lineWidth: 2
              };
            }
          }
        },

        {
          type: 'text',
          id: 'text',
          layout: {
            position: 'top'
          },
          from: { data: 'monthText' },

          encode: {
            update: {
              x: { scale: 'xscale', field: 'column', band: 0.5 },
              y: 16,
              text: datum => `${datum.monthKey}`,
              fill: '#333',
              fontSize: 16,
              textAlign: 'center'
            }
          }
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
