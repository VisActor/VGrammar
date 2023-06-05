/* eslint-disable no-console */
import { range, isNumber } from '@visactor/vutils';
import { interpolatePiYG, schemePiYG } from 'd3-scale-chromatic';
import data from '../data/simpsons.json';

console.log(schemePiYG[schemePiYG.length - 1]);

function interpolateNumber(a: number, b: number): (x: number) => number {
  return interpolatePiYG;
}

const getHourData = () => {
  const hours = range(0, 24).map(index => {
    return index < 12 ? `${index}AM` : `${index - 12}PM`;
  });
  const days = ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

  const result: any[] = [];
  hours.forEach((hour, index) => {
    days.forEach((day, dayIndex) => {
      // if (Math.random() > 0.5) {
      // }
      result.push({
        day,
        hour,
        value: Math.random() * 100
      });
    });
  });

  return result;
};

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

  data: [
    {
      id: 'simpsons',
      values: data
      // transform: [
      //   {
      //     type: 'filter',
      //     callback: (datum: any) => {
      //       return isNumber(datum.imdb_rating);
      //     }
      //   }
      // ]
    },
    {
      id: 'markData',
      source: 'simpsons'
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'simpsons', field: 'season', sort: (a: number, b: number) => a - b },
      padding: 0.05,
      round: true,
      range: {
        callback: (scale: any, params: any) => {
          return [params.padding.left, params.padding.left + params.viewWidth];
        },
        dependency: ['viewWidth', 'padding']
      }
    },
    {
      id: 'yscale',
      type: 'band',
      domain: { data: 'simpsons', field: 'number_in_season', sort: (a: number, b: number) => a - b },
      nice: true,
      range: {
        callback: (scale: any, params: any) => {
          return [params.padding.top + params.viewHeight, params.padding.top];
        },
        dependency: ['viewHeight', 'padding']
      }
    },
    {
      id: 'colorScale',
      type: 'linear',
      domain: { data: 'simpsons', field: 'imdb_rating' },
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
      // encode: {
      //   enter: {
      //     callback: (datum: any, el: any, params: any) => {
      //       console.log(params);
      //       return {
      //         x: params.padding.left,
      //         y: params.padding.left,
      //         width: params.viewWidth,
      //         height: params.viewHeight,
      //         fill: 'pink'
      //       };
      //     },
      //     dependency: ['viewWidth', 'viewHeight', 'padding']
      //   }
      // },
      marks: [
        {
          type: 'cell',
          id: 'bar',
          layout: {
            position: 'content',
            skipBeforeLayouted: true
          },
          from: { data: 'markData' },
          // animationState: { signal: 'animationState' },
          // animation: {
          //   appear: {
          //     // type: 'growHeight',
          //     // channel: ['width'],
          //     type: 'fadeIn',
          //     duration: 2000
          //     // loop: 5
          //     // oneByOne: true
          //   },
          //   disappear: {
          //     type: 'growHeightOut',
          //     duration: 2000
          //   },
          //   enter: {
          //     type: 'growHeightIn',
          //     duration: 1000
          //   },
          //   exit: {
          //     type: 'fadeOut',
          //     duration: 1000
          //   },
          //   update: {
          //     type: 'update',
          //     duration: 1000
          //   }
          // },
          encode: {
            enter: {},
            update: {
              x: { scale: 'xscale', field: 'season', band: 0.5 },
              y: { scale: 'yscale', field: 'number_in_season', band: 0.5 },
              // padding: [2, 4],
              // size: {
              //   callback: (datum: any, el: any, params: any) => {
              //     console.log(params.xscale.bandwidth(), params.yscale.bandwidth());
              //     return [params.xscale.bandwidth(), params.yscale.bandwidth()];
              //   },
              //   dependency: ['xscale', 'yscale']
              // },
              // height: { scale: 'yscale', band: 1 },
              // width: { scale: 'xscale', band: 1 },
              fill: { scale: 'colorScale', field: 'imdb_rating' }
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
          interactive: false,
          from: { data: 'markData' },
          // animationState: { signal: 'animationState' },
          // animation: {
          //   appear: {
          //     // type: 'growHeight',
          //     // channel: ['width'],
          //     type: 'fadeIn',
          //     duration: 2000
          //     // loop: 5
          //     // oneByOne: true
          //   },
          //   disappear: {
          //     type: 'growHeightOut',
          //     duration: 2000
          //   },
          //   enter: {
          //     type: 'growHeightIn',
          //     duration: 1000
          //   },
          //   exit: {
          //     type: 'fadeOut',
          //     duration: 1000
          //   },
          //   update: {
          //     type: 'update',
          //     duration: 1000
          //   }
          // },
          encode: {
            update: {
              textAlign: 'center',
              textBaseline: 'middle',
              fontSize: 10,
              x: { scale: 'xscale', field: 'season', band: 0.5 },
              y: { scale: 'yscale', field: 'number_in_season', band: 0.5 },
              text: (d: any) => {
                return d.imdb_rating?.toFixed?.(1);
              },
              fill: '#333'
            }
          }
        },
        {
          type: 'component',
          layout: {
            position: 'top'
          },

          tickCount: -1,
          componentType: 'axis',
          scale: 'xscale',
          encode: {
            update: {
              callback: (datum: any, el: any, params: any) => {
                return {
                  x: params.padding.left,
                  y: params.padding.top,
                  start: { x: 0, y: 0 },
                  end: { x: params.viewWidth, y: 0 },
                  verticalFactor: -1
                };
              },
              dependency: ['padding', 'viewHeight', 'viewWidth']
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
          encode: {
            update: {
              callback: (datum: any, el: any, params: any) => {
                return {
                  x: params.padding.left,
                  y: params.padding.top,
                  start: { x: 0, y: 0 },
                  end: { x: 0, y: params.viewHeight }
                };
              },
              dependency: ['padding', 'viewHeight']
            }
          }
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
            filter: 'imdb_rating'
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
        }
      ]
    }
  ]
};
