/* eslint-disable no-console */
const getData = (size: number) => {
  return new Array(size).fill(0).map((entry: number, index: number) => {
    return {
      category: `cat-${index}`,
      // category: index,
      amount: 100 * Math.random()
    };
  });
};

export const spec = {
  width: 1500,
  height: 200,
  padding: 5,

  data: [
    {
      id: 'table',
      values: getData(100000)
    }
  ],

  events: [
    {
      type: 'rect:mouseout',
      callback: (a, b, c) => {
        console.log(a, b, c, 'mouseout');
        return {};
      }
    },

    {
      callback: (ctx: any) => {
        console.log(ctx, 'merge');
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
      padding: 0.05,
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
    }
  ],

  marks: [
    {
      type: 'rect',
      from: { data: 'table' },
      // key: 'category',
      progressiveStep: 3000,
      progressiveThreshold: 50000,
      encode: {
        update: {
          x: { scale: 'xscale', field: 'category' },
          width: { scale: 'xscale', band: 1 },
          // // width: 20,
          // width: 20,
          y: { scale: 'yscale', field: 'amount' },
          y1: { scale: 'yscale', value: 0 },
          fill: 'steelblue'
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
