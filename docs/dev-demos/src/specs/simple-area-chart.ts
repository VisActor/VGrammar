export const spec = {
  description: 'A basic area chart example.',
  width: 500,
  height: 200,
  padding: 5,

  // signals: [
  //   {
  //     id: 'interpolate',
  //     value: 'monotone',
  //     bind: {
  //       input: 'select',
  //       options: [
  //         'basis',
  //         'cardinal',
  //         'catmull-rom',
  //         'linear',
  //         'monotone',
  //         'natural',
  //         'step',
  //         'step-after',
  //         'step-before',
  //       ],
  //     },
  //   },
  // ],

  data: [
    {
      id: 'table',
      values: [
        { u: 1, v: 28 },
        { u: 2, v: 55 },
        { u: 3, v: 43 },
        { u: 4, v: 91 },
        { u: 5, v: 81 },
        { u: 6, v: 53 },
        { u: 7, v: 19 },
        { u: 8, v: 87 },
        { u: 9, v: 52 },
        { u: 10, v: 48 },
        { u: 11, v: 24 },
        { u: 12, v: 49 },
        { u: 13, v: 87 },
        { u: 14, v: 66 },
        { u: 15, v: -17 },
        { u: 16, v: -27 },
        { u: 17, v: -68 },
        { u: 18, v: -16 },
        { u: 19, v: 49 },
        { u: 20, v: 15 }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.width];
        },
        dependency: ['width']
      },
      zero: false,
      domain: { data: 'table', field: 'u' }
    },
    {
      id: 'yscale',
      type: 'linear',
      range: {
        callback: (scale: any, params: any) => {
          return [params.height, 0];
        },
        dependency: ['height']
      },
      nice: true,
      zero: true,
      domain: [-100, 100]
    }
  ],

  marks: [
    {
      type: 'area',
      id: 'area',
      from: { data: 'table' },
      encode: {
        enter: {
          x: { scale: 'xscale', field: 'u' },
          y: { scale: 'yscale', field: 'v' },
          y1: { scale: 'yscale', value: 0 },
          fill: 'steelblue'
        },
        update: {
          // interpolate: { signal: 'interpolate' },
          fillOpacity: 1
        },
        hover: {
          fillOpacity: 0.5
        }
      }
    }
  ]
};
