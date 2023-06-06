/* eslint-disable no-console */
export const spec = {
  description: 'A basic bar chart example, with value labels shown upon mouse hover.',
  width: 400,
  height: 200,
  padding: 5,
  events: [
    {
      type: 'view:mousedown',
      target: [
        {
          target: 'signalC',
          callback: ctx => {
            return { text: 'changed!' };
          }
        },
        {
          target: 'signalC',
          callback: ctx => {
            return { text: 'changed!' };
          }
        }
      ]
    }
  ],
  signals: [
    // {
    //   id: 'signalA',
    //   value: true,
    //   bind: { input: 'radio', options: [true, false] },
    // },
    {
      id: 'signalB',
      value: true
    },
    {
      id: 'signalC',
      value: { text: 'balabala' }
    },
    {
      id: 'signalD',
      update: {
        callback: () => 666777
      }
    },
    {
      id: 'signalE',
      value: 123
    },
    {
      id: 'symbolClick',
      value: null
    }
  ],

  data: [
    {
      id: 'table',
      values: [
        { key: 12, amount: 28 },
        { key: 41, amount: 55 },
        { key: 40, amount: 53 },
        { key: 7, amount: 43 },
        { key: 20, amount: 91 },
        { key: 36, amount: 81 },
        { key: 17, amount: 19 },
        { key: 50, amount: 87 }
      ]
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
      transform: [
        {
          type: 'markoverlap',
          direction: 1
        }
      ],
      encode: {
        enter: {
          x: { scale: 'xscale', field: 'key' },
          y: { scale: 'yscale', field: 'amount' },
          size: 10
        },
        update: {
          fill: {
            callback: (datum: any, el: any, params: any) => {
              return datum.amount < 60 ? 'red' : 'lightGreen';
            },
            dependency: ['xscale']
          }
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ],

  preRenderTransform: [
    {
      type: 'filter',
      callback: ctx => {
        console.log('preRender filter: ', ctx);
        return true;
      }
    }
  ]
};
