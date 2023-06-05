export const spec = {
  
  width: 400,
  height: 400,
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
      type: 'image',
      // animationState: { signal: 'animationState' },
      // animation: {
      //   // enter: {
      //   //   type: 'fadeIn',
      //   //   delay: 0,
      //   //   time: 1000
      //   // },
      //   enter: {
      //     type: 'growPointsIn',
      //     duration: 1000,
      //     easing: 'linear'
      //   },
      //   exit: {
      //     type: 'fadeOut',
      //     duration: 1000
      //   },
      //   update: {
      //     duration: 1000
      //     // ease: "linear"
      //   }
      // },
      encode: {
        enter: {},
        update: {
          stroke: '#652c90',
          scaleX: 0.5,
          scaleY: 0.5,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          image:
            // eslint-disable-next-line
            'data:image/png;base64,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'
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
