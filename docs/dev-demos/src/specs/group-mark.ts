export const spec = {
  width: 500,
  height: 500,
  padding: 0,
  autosize: 'none',

  signals: [
    { id: 'clip', value: true, bind: { input: 'checkbox' } },
    { id: 'foreground', value: false, bind: { input: 'checkbox' } },
    { id: 'x', value: 25, bind: { input: 'range', min: 0, max: 200, step: 1 } },
    { id: 'y', value: 25, bind: { input: 'range', min: 0, max: 200, step: 1 } },
    { id: 'w', value: 150, bind: { input: 'range', min: 0, max: 200, step: 1 } },
    { id: 'h', value: 150, bind: { input: 'range', min: 0, max: 200, step: 1 } },
    { id: 'cornerRadius', value: 50, bind: { input: 'range', min: 0, max: 50, step: 1 } },
    { id: 'lineWidth', value: 4, bind: { input: 'range', min: 0, max: 10 } },
    { id: 'color', value: 'both', bind: { input: 'radio', options: ['fill', 'stroke', 'both'] } }
  ],

  data: [
    {
      id: 'table',
      values: [
        { x: 5, y: 5, w: 100, h: 30 },
        { x: -5, y: 70, w: 40, h: 40 },
        { x: 60, y: 120, w: 100, h: 20 }
      ]
    }
  ],

  marks: [
    {
      type: 'group',
      id: 'test-group',
      encode: {
        update: {
          x: {
            signal: 'x'
          },
          y: {
            signal: 'y'
          },
          width: {
            signal: 'w'
          },
          height: {
            signal: 'h'
          },
          clip: {
            signal: 'clip'
          },

          opacity: 1,

          cornerRadius: {
            signal: 'cornerRadius'
          },
          lineWidth: {
            signal: 'lineWidth'
          },
          strokeForeground: {
            signal: 'foreground'
          },
          fill: {
            callback: (datum: any, el: any, params: any) => {
              return params.color !== 'stroke' ? '#939597' : null;
            },
            dependency: ['color']
          },
          stroke: {
            callback: (datum: any, el: any, params: any) => {
              return params.color !== 'fill' ? '#652c90' : null;
            },
            dependency: ['color']
          }
        },
        hover: {
          opacity: 0.5
        }
      },

      marks: [
        {
          type: 'rect',
          id: 'inner-rect',
          from: { data: 'table' },
          encode: {
            enter: {
              x: { field: 'x' },
              y: { field: 'y' },
              width: { field: 'w' },
              height: { field: 'h' },
              stroke: 'firebrick'
            },
            update: {
              fill: 'aliceblue'
            },
            hover: {
              fill: 'salmon'
            }
          }
        }
      ]
    }
  ]
};
