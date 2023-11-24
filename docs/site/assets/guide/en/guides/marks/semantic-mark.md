# Semantic marks

Semantic marks in VGrammar describe a specific type of data semantics.

## Interval

Interval mark is used to represent a range of data sets, presented in bar intervals. In different coordinate systems, interval graphics can be used to create bar charts, histograms, rose charts, and other visualization effects.

Developers can choose either a cartesian or polar coordinate system to meet different visualization needs. In a cartesian coordinate system, interval mark is presented as rectangles; in a polar coordinate system, interval mark is presented as arcs.

The interval type is declared as `'interval'`.

Interval graphic rendering example:

<div class="examples-ref-container" id="examples-ref-interval" data-path="mark-interval/polar-interval">
</div>

```javascript livedemo template=vgrammar
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
      type: 'polar',
      dependency: ['viewBox'],
      start: (coord, params) => {
        return [params.viewBox.x1, params.viewBox.y1];
      },
      end: (coord, params) => {
        return [params.viewBox.x2, params.viewBox.y2];
      }
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
      type: 'group',
      layout: {
        display: 'relative',
        updateViewSignals: true
      },

      marks: [
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
        },

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
## Cell

Cell mark is commonly used to represent the numerical proportion within a given data set's unit range and can be used to create heat maps and other visualization effects. The cell graphic type is declared as `'cell'`.

Cell graphic rendering example:

<div class="examples-ref-container" id="examples-ref-cell" data-path="mark-cell/calender-cell">
</div>

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