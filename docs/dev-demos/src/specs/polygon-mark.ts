export const spec = {
  width: 400,
  height: 200,
  padding: 5,

  signals: [
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
  ],

  marks: [
    {
      type: 'polygon',
      // animationState: { signal: 'animationState' },
      animation: {
        // enter: {
        //   type: 'fadeIn',
        //   delay: 0,
        //   time: 1000
        // },
        enter: {
          type: 'growPointsIn',
          duration: 1000,
          easing: 'linear'
        },
        exit: {
          type: 'fadeOut',
          duration: 1000
        },
        update: {
          duration: 1000
          // ease: "linear"
        }
      },
      encode: {
        enter: {
          stroke: '#652c90'
        },
        update: {
          x: 100,
          y: 100,
          scaleX: 0.5,
          scaleY: 0.5,
          points: {
            callback: (scale: any, params: any) => {
              return [
                { x: -100, y: -200 * Math.cos(Math.PI / 6) },
                { x: 100, y: -200 * Math.cos(Math.PI / 6) },
                { x: 100 + 200 * Math.sin(Math.PI / 6), y: 0 },
                { x: 100, y: 200 * Math.cos(Math.PI / 6) },
                { x: -100, y: 200 * Math.cos(Math.PI / 6) },
                { x: -100 - 200 * Math.sin(Math.PI / 6), y: 0 }
              ];
            }
          },
          lineWidth: { signal: 'lineWidth' },
          lineCap: { signal: 'lineCap' },
          lineDash: { signal: 'lineDash' },
          lineDashOffset: { signal: 'lineDashOffset' },
          lineJoin: { signal: 'lineJoin' },
          borderRadius: 50,
          miterLimitin: { signal: 'miterLimitin' },
          opacity: 1,
          fill: 'pink'
        },
        hover: {
          opacity: 0.5
        }
      }
    }
  ]
};

export const binds = [
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
  { id: 'miterLimitin', value: 0, bind: { input: 'range', min: 0, max: 50, step: 1 } }
  // {
  //   id: 'animationState',
  //   value: 'enter',
  //   bind: { input: 'radio', options: ['enter', 'exit', 'change', 'none'] }
  // }
];
