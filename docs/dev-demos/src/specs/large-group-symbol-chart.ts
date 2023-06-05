import { category10 } from '../color-utils';

const getValues = (size: number) => {
  return new Array(size * 2).fill(0).map((_, i) => {
    const index = Math.floor(i / 2);
    if (i % 2 === 0) {
      return { key: Math.random() * 100, amount: Math.random() * 100, c: 0 };
    }

    return { key: Math.random() * 100, amount: Math.random() * 100, c: 1 };
  });
};

export const spec = {
  
  description: 'A basic bar chart example, with value labels shown upon mouse hover.',
  width: 1000,
  height: 200,
  padding: 5,

  data: [
    {
      id: 'table',
      values: getValues(10000)
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      domain: { data: 'table', field: 'key' },
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.width];
        },
        dependency: ['width']
      }
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'amount' },
      nice: true,
      range: {
        callback: (scale: any, params: any) => {
          return [params.height, 0];
        },
        dependency: ['height']
      }
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'c' },
      // range: { scheme: 'category20' }
      range: category10
    }
  ],

  axes: [
    {
      orient: 'bottom',
      scale: 'xscale'
    },
    {
      orient: 'left',
      scale: 'yscale',
      forceTickCount: 5,
      tickMax: true
    }
  ],

  marks: [
    {
      type: 'symbol',
      from: { data: 'table' },
      // transform: [
      //   {
      //     type: 'markoverlap',
      //     direction: 1
      //   }
      // ],
      groupBy: 'c',
      progressiveStep: 20,
      progressiveThreshold: 1000,
      encode: {
        enter: {
          x: { scale: 'xscale', field: 'key' },
          y: { scale: 'yscale', field: 'amount' },
          size: 10
        },
        update: {
          fill: { scale: 'color', field: 'c' }
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ]
};
