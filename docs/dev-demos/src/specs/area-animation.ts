/* eslint-disable no-console */
import type { IView } from '@visactor/vgrammar';

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

  signals: [
    {
      id: 'animationState',
      value: 'appear'
    }
  ],

  scales: [
    {
      id: 'x',
      type: 'point',
      range: [0, 400],
      domain: { data: 'table', field: 'x' }
    },
    {
      id: 'y',
      type: 'linear',
      range: [150, 0],
      nice: true,
      zero: true,
      domain: { data: 'table', field: 'y' }
    },
    {
      id: 'color',
      type: 'ordinal',
      range: ['red', 'blue', 'yellow'],
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
      encode: {
        enter: {
          x: 50,
          y: 25,
          width: 400,
          height: 150,
          stroke: 'green'
        }
      },
      marks: [
        {
          type: 'line',
          id: 'line',
          animationState: { signal: 'animationState' },
          animation: {
            appear: {
              type: 'growPointsYIn',
              delay: (...args) => {
                console.log(args);
                return 0;
              },
              duration: 2000,
              options: { orient: 'negative' }
            },
            disappear: {
              type: 'growPointsYOut',
              duration: 2000,
              options: { orient: 'negative' }
            },
            update: {
              type: 'update',
              duration: 1000
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
              lineWidth: 2
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
          type: 'area',
          id: 'area',
          animationState: { signal: 'animationState' },
          animation: {
            appear: {
              type: 'growPointsYIn',
              duration: 2000,
              options: { orient: 'negative' }
            },
            disappear: {
              type: 'growPointsYOut',
              duration: 2000,
              options: { orient: 'negative' }
            },
            update: {
              type: 'update',
              duration: 1000
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
              y1: { scale: 'y', value: 0 },
              fill: { scale: 'color', field: 'c' },
              fillOpacity: 0.6
            },
            update: {
              // interpolate: { signal: 'interpolate' },
              strokeOpacity: 1
            }
          }
        },

        {
          type: 'symbol',
          id: 'point',
          animationState: { signal: 'animationState' },
          animation: {
            appear: {
              type: 'moveIn',
              duration: 2000,
              options: { direction: 'y', orient: 'negative' }
            },
            disappear: {
              type: 'moveOut',
              duration: 2000,
              options: { direction: 'y', orient: 'negative', offset: 0 }
            },
            update: {
              type: 'update',
              duration: 1000
            }
          },
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
              size: 6,
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

export const callback = (view: IView) => {
  const disappearButton = document.createElement('button');
  disappearButton.innerText = 'disappear';
  document.getElementById('footer')?.appendChild(disappearButton);

  view.addEventListener('animationStart', (state: string) => {
    console.log('animationStart: ', state);
    if (state === 'appear') {
      view.getSignalById('animationState').value(null);
    }
  });
  view.addEventListener('animationEnd', (state: string) => {
    console.log('animationEnd: ', state);
  });
  disappearButton.addEventListener('click', () => {
    view.getSignalById('animationState').value('disappear');
    view.runAsync();
  });

  (window as any).animate = () => {
    const area = view.getMarkById('area');
    area.animate.run({
      channel: {
        // y1: { from: 168.75, to: 140 }
        y1: { to: 150 },
        fill: { to: 'pink' }
      },
      duration: 2000
    });
  };
};
