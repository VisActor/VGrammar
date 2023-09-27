export const spec = {
  description: 'A basic grouped bar chart example.',
  width: 300,
  height: 240,
  padding: 5,

  interactions: [
    {
      type: 'brush-active',
      selector: ['rect', 'text']
    }
  ],

  data: [
    {
      id: 'table',
      values: [
        { category: 'A', position: 0, value: 0.1 },
        { category: 'A', position: 1, value: 0.6 },
        { category: 'A', position: 2, value: 0.9 },
        { category: 'A', position: 3, value: 0.4 },

        { category: 'B', position: 0, value: 0.7 },
        { category: 'B', position: 1, value: 0.2 },
        { category: 'B', position: 2, value: 1.1 },
        { category: 'B', position: 3, value: 0.8 },

        { category: 'C', position: 0, value: 0.6 },
        { category: 'C', position: 1, value: 0.1 },
        { category: 'C', position: 2, value: 0.2 },
        { category: 'C', position: 3, value: 0.7 }
      ]
    }
  ],

  scales: [
    {
      id: 'yscale',
      type: 'band',
      domain: { data: 'table', field: 'category' },
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.height];
        },
        dependency: ['height']
      },
      padding: 0.2
    },
    {
      id: 'xscale',
      type: 'linear',
      // domain: { data: 'table', field: 'value' },
      // domain: [0, 1.5],
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.width];
        },
        dependency: ['width']
      },
      // round: true,
      zero: true
      //nice: true
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'position' },
      // range: { scheme: 'category20' }
      range: ['red', 'green', 'yellow', 'pink']
    },
    {
      id: 'pos',
      type: 'band',
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.yscale.bandwidth()];
        },
        dependency: ['yscale']
      },
      domain: { data: 'table', field: 'position' }
    }
  ],

  axes: [
    {
      orient: 'left',
      scale: 'yscale',
      tickSize: 0,
      labelPadding: 4,
      zIndex: 1
    },
    { orient: 'bottom', scale: 'xscale' }
  ],

  marks: [
    {
      type: 'group',
      encode: {
        enter: {
          // y: { scale: 'yscale', field: 'category' },
        }
      },
      marks: [
        {
          id: 'bars',
          from: { data: 'table' },
          type: 'rect',
          groupBy: 'position',
          encode: {
            enter: {
              y: { scale: 'yscale', field: 'category' },
              height: { scale: 'yscale', band: 1 },
              // y: {
              //   callback: (datum: any, el: any, params: any) => {
              //     const groupOffset = params.yscale.scale(datum.category);
              //     return params.pos.scale(datum.position) + groupOffset;
              //   },
              //   dependency: ['yscale', 'pos']
              // },
              // height: { scale: 'pos', band: 1 },
              x: { scale: 'xscale', field: 'value' },
              x1: { scale: 'xscale', value: 0 },
              fill: { scale: 'color', field: 'position' }
            },
            active: {
              stroke: 'black'
            }
          },
          transform: [{ type: 'dodge', minWidth: 20 }]
        },
        {
          type: 'text',
          from: { data: 'table' },
          id: 'label',
          groupBy: 'position',
          encode: {
            enter: {
              x: { scale: 'xscale', field: 'value', offset: -5 },
              y: { scale: 'yscale', field: 'category' },
              // y: {
              //   callback: (datum: any, el: any, params: any) => {
              //     const groupOffset = params.yscale.scale(datum.category);
              //     const heightOffset = params.pos.bandwidth() / 2;
              //     return params.pos.scale(datum.position) + groupOffset + heightOffset;
              //   },
              //   dependency: ['yscale', 'pos']
              // },
              // x: { field: 'x1', offset: -5 },
              // y: { field: 'y', offset: { field: 'height', mult: 0.5 } },
              fill: {
                callback: (datum: any, el: any, params: any) => {
                  const fill = params.color.scale(datum.position);
                  // return contrast('white', fill) > contrast('black', fill) ? 'white' : 'black';

                  return 'black';
                },
                dependency: ['color']
              },
              textAlign: 'right',
              textBaseline: 'middle',
              text: { field: 'value' },
              fontFamily: 'sans-serif',
              fontSize: 11
            },
            active: {
              fontSize: 20
            }
          },
          transform: [{ type: 'dodge', minWidth: 20 }]
        }
      ]
    }
  ]
};
