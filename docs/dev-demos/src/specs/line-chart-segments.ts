export const spec = {
  width: 500,
  height: 200,
  padding: 5,

  data: [
    {
      id: 'table',
      values: [
        { x: 0, y: 28, c: 0 },
        { x: 0, y: 20, c: 1 },
        { x: 1, y: 43, c: 0 },
        { x: 1, y: 35, c: 1 },
        { x: 2, y: 81, c: 0 },
        { x: 2, y: 10, c: 1 },
        { x: 3, y: 19, c: 0 },
        { x: 3, y: 15, c: 1 },
        { x: 4, y: 52, c: 0 },
        { x: 4, y: 48, c: 1 },
        { x: 5, y: 24, c: 0 },
        { x: 5, y: 28, c: 1 },
        { x: 6, y: 87, c: 0 },
        { x: 6, y: 66, c: 1 },
        { x: 7, y: 17, c: 0 },
        { x: 7, y: 27, c: 1 },
        { x: 8, y: 68, c: 0 },
        { x: 8, y: 16, c: 1 },
        { x: 9, y: 49, c: 0 },
        { x: 9, y: 25, c: 1 }
      ]
    }
  ],

  scales: [
    {
      id: 'x',
      type: 'point',
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.width];
        },
        dependency: ['width']
      },
      domain: { data: 'table', field: 'x' }
    },
    {
      id: 'y',
      type: 'linear',
      range: {
        callback: (scale: any, params: any) => {
          return [params.height, 0];
        },
        dependency: ['height']
      },
      nice: true,
      zero: true,
      domain: { data: 'table', field: 'y' }
    },
    {
      id: 'color',
      type: 'ordinal',
      range: ['red', 'green'],
      domain: { data: 'table', field: 'c' }
    }
  ],

  axes: [
    { orient: 'bottom', scale: 'x' },
    { orient: 'left', scale: 'y' }
  ],

  marks: [
    {
      type: 'group',
      marks: [
        {
          type: 'line',
          id: 'line',
          // animationState: 'appear',
          animation: {
            enter: {
              type: 'clipIn',
              duration: 2000
            },
            update: {
              type: 'update',
              duration: 1000
            },
            exit: {
              type: 'clipOut',
              duration: 2000
            }
          },
          from: {
            data: 'table'
          },
          groupBy: 'c',
          encode: {
            enter: {
              x: { scale: 'x', field: 'x' },
              y: { scale: 'y', field: 'y' },
              stroke: { scale: 'color', field: 'c' },
              lineDash: (datum: any) => {
                if (datum.x >= 3) {
                  return [1, 1];
                }

                return [];
              },
              lineWidth: 2,
              enableSegments: true
            },
            update: {
              // interpolate: { signal: 'interpolate' },
              strokeOpacity: 1
            },
            hover: {
              stroke: 'red',
              strokeOpacity: 0.5,
              lineWidth: 4
            }
          }
        },

        {
          type: 'symbol',
          from: {
            data: 'table'
          },
          transform: [
            {
              type: 'markoverlap',
              direction: 1,
              delta: 50,
              deltaMul: 1,
              groupBy: 'c',
              params: {
                max: 1
              }
            }
          ],
          encode: {
            enter: {
              x: { scale: 'x', field: 'x' },
              y: { scale: 'y', field: 'y' },
              size: 10,
              stroke: { scale: 'color', field: 'c' },
              fill: 'white',
              lineWidth: 2
            },
            update: {
              strokeOpacity: 1
            },
            hover: {
              strokeOpacity: 0.5
            }
          }
        }
      ]
    }
  ]
};
