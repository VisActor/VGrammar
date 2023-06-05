import { category10 } from '../color-utils';

const getData = (size: number) => {
  const groupA = new Array(size).fill(0).map((entry: number, index: number) => {
    return {
      group: 'A',
      category: `cat-${index}`,
      amount: 100 * Math.random()
    };
  });
  const groupB = new Array(size).fill(0).map((entry: number, index: number) => {
    return {
      group: 'B',
      category: `cat-${index}`,
      amount: 100 * Math.random()
    };
  });
  const groupC = new Array(size).fill(0).map((entry: number, index: number) => {
    return {
      group: 'C',
      category: `cat-${index}`,
      amount: 100 * Math.random()
    };
  });

  return [...groupA, ...groupB, ...groupC];
};

export const spec = {
  
  width: 1500,
  height: 200,
  padding: 5,
  background: 'pink',

  data: [
    {
      id: 'table',
      values: getData(10000)
    }
  ],

  events: [
    {
      type: 'rect:mouseout',
      callback: (a: any, b: any, c: any) => {
        return {};
      }
    },

    {
      callback: (ctx: any) => {
        return ctx.datum;
      },
      merge: [{ type: 'rect:mouseenter' }, { type: 'rect:mouseover' }]
    }
  ],

  signals: [
    {
      id: 'tooltip',
      value: {}
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'category' },
      // range: [0, 400],
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.width];
        },
        dependency: ['width']
      },
      paddingInner: 0.1,
      round: false
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'amount' },
      // range: [0, 200],
      range: {
        callback: (scale: any, params: any) => {
          return [params.height, 0];
        },
        dependency: ['height']
      },
      nice: true
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'group' },
      // range: { scheme: 'category20' }
      range: category10
    },
    {
      id: 'xOffset',
      type: 'band',
      paddingInner: 0,
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.xscale.bandwidth()];
        },
        dependency: ['xscale']
      },
      domain: { data: 'table', field: 'group' }
    }
  ],

  marks: [
    {
      type: 'rect',
      from: { data: 'table' },
      groupBy: 'group',
      progressiveStep: 2000,
      progressiveThreshold: 5000,
      encode: {
        update: {
          x: {
            // scale: 'xscale', field: 'category'
            callback: (datum: any, el: any, params: any) => {
              const bandWidth = params.xOffset.bandwidth();
              const width = Math.max(Math.min(bandWidth, 10), 1);
              const offsetRatio = bandWidth > 0 ? params.xOffset.scale(datum.group) / bandWidth : 0;
              const count = params.xOffset.domain().length;

              return (
                params.xscale.scale(datum.category) + params.xscale.bandwidth() / 2 + (offsetRatio - count / 2) * width
              );
            },
            dependency: ['xscale', 'xOffset']
          },
          width: {
            // scale: 'xOffset', band: 1
            callback: (datum: any, el: any, params: any) => {
              return Math.max(Math.min(params.xOffset.bandwidth(), 10), 1);
            },
            dependency: ['xOffset']
          },
          // // width: 20,
          // width: 20,
          y: { scale: 'yscale', field: 'amount' },
          y1: { scale: 'yscale', value: 0 },
          fill: { scale: 'color', field: 'group' }
        },
        hover: {
          fill: 'red'
        }
      }
    },
    {
      type: 'text',
      encode: {
        enter: {
          align: 'center',
          baseline: 'bottom',
          fill: '#333'
        },
        update: {
          x: {
            callback: (datum: any, el: any, params: any) => {
              return params.xscale.scale(params.tooltip?.category) + params.xscale.bandwidth() * 0.5;
            },
            dependency: ['tooltip', 'xscale']
          },
          y: {
            callback: (datum: any, el: any, params: any) => {
              return params.yscale.scale(params.tooltip?.amount) - 2;
            },
            dependency: ['tooltip', 'yscale']
          },
          text: {
            callback: (datum: any, el: any, params: any) => {
              return params.tooltip?.amount;
            },
            dependency: ['tooltip']
          },
          fillOpacity: {
            callback: (datum: any, el: any, params: any) => {
              return Number.isNaN(params.tooltip?.amount) ? 0 : 1;
            },
            dependency: ['tooltip']
          }
        }
      }
    }
  ]
};
