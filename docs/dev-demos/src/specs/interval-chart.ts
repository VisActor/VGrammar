/* eslint-disable no-console */
import { schemePiYG } from 'd3-scale-chromatic';
import type { IView } from '@visactor/vgrammar-simple';
export const spec = {
  description: 'A basic bar chart example, with value labels shown upon mouse hover.',
  width: 800,
  height: 400,
  padding: 5,
  events: [
    {
      type: 'rect:click',
      callback: (e: any) => {
        console.log(e.element, e.element.getDatum().imdb_rating);
      }
    }
  ],

  signals: [
    {
      id: 'animationState',
      value: 'enter'
    }
  ],

  data: [
    {
      id: 'table',
      values: [
        { category: 'A', amount: 28, index: 0, group: '00' },
        { category: 'B', amount: 55, index: 1, group: '00' },
        { category: 'C', amount: -43, index: 2, group: '00' },
        { category: 'D', amount: 91, index: 3, group: '00' },
        { category: 'E', amount: 81, index: 4, group: '00' },
        { category: 'F', amount: 53, index: 5, group: '00' },
        { category: 'G', amount: 19, index: 6, group: '00' },
        { category: 'H', amount: 87, index: 7, group: '00' },

        { category: 'A', amount: 28, index: 0, group: '11' },
        { category: 'B', amount: 65, index: 1, group: '11' },
        { category: 'C', amount: 43, index: 2, group: '11' },
        { category: 'D', amount: 41, index: 3, group: '11' },
        { category: 'E', amount: 61, index: 4, group: '11' },
        { category: 'F', amount: 23, index: 5, group: '11' },
        { category: 'G', amount: 39, index: 6, group: '11' },
        { category: 'H', amount: 47, index: 7, group: '11' }
      ]
    },
    {
      id: 'markData',
      source: 'table'
    }
  ],
  coordinates: [
    {
      id: 'rect',
      type: 'polar',
      start: {
        callback: (scale: any, params: any) => {
          return [params.padding.left, params.padding.top];
        },
        dependency: ['viewWidth', 'viewHeight', 'padding']
      },
      end: {
        callback: (scale: any, params: any) => {
          return [params.padding.left + params.viewWidth, params.padding.top + params.viewHeight];
        },
        dependency: ['viewWidth', 'viewHeight', 'padding']
      },
      transpose: true
      // origin: {
      //   callback: (scale: any, params: any) => {
      //     return [params.padding.left, params.padding.top + params.viewHeight];
      //   },
      //   dependency: ['viewWidth', 'viewHeight', 'padding']
      // }
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'markData', field: 'category' },
      padding: 0.05,
      // round: true,
      // range: {
      //   callback: (scale: any, params: any) => {
      //     return [params.padding.left, params.padding.left + params.viewWidth];
      //   },
      //   dependency: ['viewWidth', 'padding']
      // }

      range: { coordinate: 'rect', dimension: 'x', isSubshaft: false, reversed: false }
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'markData', field: 'amount' },
      nice: true,
      // range: {
      //   callback: (scale: any, params: any) => {
      //     return [params.padding.top + params.viewHeight, params.padding.top];
      //   },
      //   dependency: ['viewHeight', 'padding']
      // }

      range: { coordinate: 'rect', dimension: 'y', isSubshaft: false, reversed: false }
    },
    {
      id: 'colorScale',
      type: 'linear',
      domain: { data: 'table', field: 'amount' },
      config: {
        // interpolate: interpolateNumber,
        clamp: true
      },
      range: schemePiYG[schemePiYG.length - 1]
    }
  ],

  marks: [
    {
      type: 'group',
      layout: {
        display: 'relative',
        updateViewSignals: true
      },
      encode: {
        enter: {
          callback: (datum: any, el: any, params: any) => {
            return {
              // dx: params.padding.left,
              // dy: params.padding.top,
              width: params.viewWidth,
              height: params.viewHeight,
              fill: 'pink'
            };
          },
          dependency: ['viewWidth', 'viewHeight', 'padding']
        }
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
          coordinate: 'rect',
          from: { data: 'markData' },
          transform: [
            {
              type: 'dodge'
            }
          ],
          animationState: { signal: 'animationState' },
          animation: {
            appear: {
              type: 'fadeIn',
              duration: 2000
            },
            disappear: {
              type: 'growIntervalOut',
              duration: 2000
            },
            enter: {
              type: 'growIntervalIn',
              duration: 1000
            },
            exit: {
              type: 'fadeOut',
              duration: 1000
            },
            update: {
              type: 'update',
              duration: 1000
            }
          },
          encode: {
            enter: {},
            update: {
              x: { scale: 'xscale', field: 'category' },
              y: { scale: 'yscale', field: 'amount' },
              fill: { scale: 'colorScale', field: 'amount' }
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
          coordinate: 'rect',
          interactive: false,
          from: { data: 'markData' },
          groupBy: 'group',
          transform: [
            {
              type: 'dodge'
            }
          ],
          encode: {
            update: {
              // dx: { coordinate: '',  },
              textAlign: 'center',
              textBaseline: 'middle',
              fontSize: 10,
              x: { scale: 'xscale', field: 'category' },
              y: { scale: 'yscale', field: 'amount' },
              text: (d: any) => {
                return d.amount;
              },
              fill: '#333'
            }
          }
        },
        {
          type: 'component',
          layout: {
            position: 'auto'
          },

          componentType: 'axis',
          inside: true,
          scale: 'xscale',
          baseValue: {
            callback: (datum: any, element: any, params: any) => {
              return params.yscale.scale(0);
            },
            dependency: ['yscale']
          }
          // encode: {
          //   update: {
          //     callback: (datum: any, el: any, params: any) => {
          //       return {
          //         x: params.padding.left,
          //         y: params.padding.top,
          //         start: { x: 0, y: 0 },
          //         end: { x: params.viewWidth, y: 0 },
          //         verticalFactor: -1
          //       };
          //     },
          //     dependency: ['padding', 'viewHeight', 'viewWidth']
          //   }
          // }
        },
        {
          type: 'component',
          layout: {
            position: 'auto'
          },
          componentType: 'axis',
          inside: false,
          tickCount: () => 5,
          scale: 'yscale'
          // encode: {
          //   update: {
          //     callback: (datum: any, el: any, params: any) => {
          //       return {
          //         verticalFactor: -1,
          //         x: params.padding.left,
          //         y: params.padding.top,
          //         start: { x: 0, y: params.viewHeight },
          //         end: { x: 0, y: 0 }
          //       };
          //     },
          //     dependency: ['padding', 'viewHeight']
          //   }
          // }
        },
        {
          type: 'component',
          layout: {
            position: 'top'
          },
          componentType: 'legend',
          scale: 'colorScale',
          legendType: 'color',
          target: {
            data: 'markData',
            filter: 'amount'
          },

          encode: {
            update: {
              // "chartWidth + chartPad"
              callback: (datum: any, el: any, params: any) => {
                return {
                  x: params.padding.left,
                  y: 0,
                  layout: 'horizontal',
                  handlerText: {
                    precision: 1
                  }
                };
              },
              dependency: ['padding', 'viewHeight']
            }
          }
        },
        {
          type: 'component',
          layout: {
            position: 'right'
          },
          componentType: 'legend',
          scale: 'xscale',
          encode: {
            update: {
              callback: (datum: any, el: any, params: any) => {
                return {
                  x: params.padding.left + params.viewWidth,
                  y: params.padding.top
                };
              },
              dependency: ['padding', 'viewWidth']
            }
          }
        }
      ]
    }
  ]
};

export const callback = (view: IView) => {
  const disappearButton = document.createElement('button');
  disappearButton.innerText = 'disappear';
  document.getElementById('footer')?.appendChild(disappearButton);

  view.addEventListener('animationStart', (state: string) => {
    console.log('animationStart: ', state);
    if (state === 'appear') {
      view.getSignalById('animationState').value(null);
    }
  });
  view.addEventListener('animationEnd', (state: string) => {
    console.log('animationEnd: ', state);
  });
  disappearButton.addEventListener('click', () => {
    view.getSignalById('animationState').value('disappear');
    view.runAsync();
  });

  (window as any).animate = () => {
    const area = view.getMarkById('area');
    area.animate.run({
      channel: {
        // y1: { from: 168.75, to: 140 }
        y1: { to: 150 },
        fill: { to: 'pink' }
      },
      duration: 2000
    });
  };
};
