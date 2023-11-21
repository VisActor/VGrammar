export const spec = {
  width: 400,
  height: 200,
  padding: 5,

  signals: [
    {
      id: 'defined',
      value: true
    },
    {
      id: 'curveType',
      value: 'basis'
    },
    {
      id: 'tension',
      value: 0
    },
    { id: 'lineWidth', value: 4 },

    { id: 'lineCap', value: 'butt' },
    {
      id: 'lineDash',
      value: [1, 0]
    },
    { id: 'lineDashOffset', value: 0, bind: { input: 'range', min: 0, max: 50, step: 1 } },
    { id: 'lineJoin', value: 'miter', bind: { input: 'radio', options: ['miter', 'round', 'bevel'] } },
    { id: 'miterLimitin', value: 0, bind: { input: 'range', min: 0, max: 50, step: 1 } },
    {
      id: 'animationState',
      value: 'enter',
      bind: { input: 'radio', options: ['enter', 'exit', 'change', 'none'] }
    }
  ],

  data: [
    {
      id: 'table',
      // values: new Array(1000).fill(0).map((entry: number, index: number) => {
      //   return {
      //     u: index,
      //     v: 100 * Math.random()
      //   };
      // })
      values: [
        { u: 1, v: 28 },
        { u: 2, v: 55 },
        { u: 3, v: 42 },
        { u: 4, v: 34 },
        { u: 5, v: 36 },
        { u: 6, v: 48 }
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
      zero: false,
      domain: { data: 'table', field: 'v' }
    }
  ],

  marks: [
    {
      type: 'area',
      from: { data: 'table' },
      animationState: { signal: 'animationState' },
      animation: {
        enter: {
          animations: [
            {
              type: 'clipRange',
              delay: 0,
              time: 1000
            }
          ]
        },
        exit: {
          animations: [
            {
              type: 'fadeOut',
              time: 1000
            }
          ]
        },
        change: {
          time: 1000,
          ease: ['getElasticIn', 10, 0.3]
          // ease: "linear"
        },
        del: {
          type: ['growHeight'],
          time: 1000
          // ease: "linear"
        }
      },
      enableSegments: true,
      encode: {
        enter: {
          // stroke: '#652c90'
        },
        update: {
          x: { scale: 'xscale', field: 'u' },
          y1: { scale: 'yscale', value: 0 },
          y: { scale: 'yscale', field: 'v' },
          defined: {
            callback: (datum: any, element: any, params: any) => {
              return params.defined || datum.u !== 3;
            },
            dependency: ['defined']
          },
          // stroke: ['pink', false, false, false],
          curveType: { signal: 'curveType' },
          tension: { signal: 'tension' },
          lineWidth: { signal: 'lineWidth' },
          lineCap: { signal: 'lineCap' },
          lineDash: { signal: 'lineDash' },
          lineDashOffset: { signal: 'lineDashOffset' },
          lineJoin: { signal: 'lineJoin' },
          fill: {
            callback: (datum: any, element: any, params: any) => {
              return datum.u > 3 ? 'red' : 'green';
            }
          },
          stroke: {
            callback: (datum: any, element: any, params: any) => {
              return datum.u > 3 ? ['pink', false, false, false] : ['dark', false, false, false];
            }
          },
          miterLimitin: { signal: 'miterLimitin' },
          opacity: 1
        },
        hover: {
          opacity: 0.5
        }
      }
    }
  ]
};

export const binds = [
  {
    id: 'defined',
    value: true,
    bind: { input: 'checkbox' }
  },
  {
    id: 'curveType',
    value: 'basis',
    bind: {
      input: 'select',
      options: [
        'basis',
        'bundle',
        'cardinal',
        'catmull-rom',
        'linear',
        'monotone',
        'natural',
        'step',
        'step-after',
        'step-before'
      ]
    }
  },
  {
    id: 'tension',
    value: 0,
    bind: { input: 'range', min: 0, max: 1, step: 0.05 }
  },
  { id: 'lineWidth', value: 4, bind: { input: 'range', min: 0, max: 10, step: 0.5 } },

  { id: 'lineCap', value: 'butt', bind: { input: 'radio', options: ['butt', 'round', 'square'] } },
  {
    id: 'lineDash',
    value: [1, 0],
    bind: {
      input: 'select',
      options: [
        [1, 0],
        [8, 8],
        [8, 4],
        [4, 4],
        [4, 2],
        [2, 1],
        [1, 1]
      ]
    }
  },
  { id: 'lineDashOffset', value: 0, bind: { input: 'range', min: 0, max: 50, step: 1 } },
  { id: 'lineJoin', value: 'miter', bind: { input: 'radio', options: ['miter', 'round', 'bevel'] } },
  { id: 'miterLimitin', value: 0, bind: { input: 'range', min: 0, max: 50, step: 1 } },
  {
    id: 'animationState',
    value: 'enter',
    bind: { input: 'radio', options: ['enter', 'exit', 'change', 'none'] }
  }
];
