import type { IView } from '@visactor/vgrammar';
import { category10, category20 } from '../color-utils';

const getValues = (size: number) => {
  return new Array(size * 2).fill(0).map((_, i) => {
    const index = Math.floor(i / 2);
    if (i % 2 === 0) {
      return {
        x: index,
        y: Math.random() * 100,
        c: 0
      };
    }

    return {
      x: index,
      y: Math.random() * 100,
      c: 1
    };
  });
};
export const spec = {
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
      range: category10,
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
          from: {
            data: 'table'
          },
          groupBy: 'c',
          encode: {
            group: {
              stroke: { scale: 'color', field: 'c' },
              lineWidth: 2,
              strokeOpacity: 1
            },
            update: {
              
              x: { scale: 'x', field: 'x' },
              y: { scale: 'y', field: 'y' },
              // stroke: { scale: 'color', field: 'c' },
              // lineWidth: 2,
              // strokeOpacity: 1
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
          groupBy: 'c',
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
            group: {
              size: 10,
              stroke: { scale: 'color', field: 'c' },
              fill: 'white',
              lineWidth: 2,
              strokeOpacity: 1
            },
            update: {
              x: { scale: 'x', field: 'x' },
              y: { scale: 'y', field: 'y' },
              // size: 10,
              // stroke: { scale: 'color', field: 'c' },
              // fill: 'white',
              // lineWidth: 2,
              // strokeOpacity: 1
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

export const callback = (chartInstance: IView) => {
  const button = document.createElement('button');
  button.innerText = 'update data';
  document.getElementById('footer')?.appendChild(button);

  button.addEventListener('click', () => {
    const prevCount = parseInt(button.getAttribute('count') ?? '1000', 10);
    const newCount = prevCount === 1000 ? 10 : 1000;
    const newValues = getValues(newCount);

    button.setAttribute('count', newCount + '');

    chartInstance.getDataById('table').update(newValues);

    chartInstance.runAsync();
  });
};
