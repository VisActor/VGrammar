/* eslint-disable no-console */
import { category10 } from '../color-utils';

export const spec = {
  description: 'A basic bar chart example, with value labels shown upon mouse hover.',
  width: 400,
  height: 400,
  padding: 5,
  // config: {
  //   events: {
  //     view: ['mousedown'],
  //     window: false
  //   }
  // },
  events: [
    {
      type: '@bar:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'rect:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'view:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'view:mousedown',
      target: [
        {
          target: 'signalB',
          callback: (evt: any) => {
            return { text: 'changed!' };
          }
        },
        {
          target: 'signalC',
          callback: (evt: any) => {
            return {};
          }
        }
      ]
    },
    {
      type: 'view:mousedown',
      callback: (evt: any) => {
        return { text: 'changed!' };
      }
    },
    {
      type: 'window:mousedown',
      callback: (evt: any) => {
        return { text: 'changed!' };
      }
    }
  ],
  signals: [
    {
      id: 'signalA',
      value: true
    },
    {
      id: 'signalAA',
      value: true
    },
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
      id: 'filterSignal',
      value: 0
    },
    {
      id: 'animationState',
      value: 'appear'
    }
  ],

  data: [
    {
      id: 'table',
      values: [
        { category: 'A', amount: 28, index: 0 },
        { category: 'B', amount: 55, index: 1 },
        { category: 'C', amount: 43, index: 2 },
        { category: 'D', amount: 91, index: 3 },
        { category: 'E', amount: 81, index: 4 },
        { category: 'F', amount: 53, index: 5 },
        { category: 'G', amount: 19, index: 6 },
        { category: 'H', amount: 87, index: 7 }
      ],
      transform: [
        {
          type: 'filter',
          callback: (datum: any, params: any) => {
            return datum.index >= params.filterSignal;
          },
          dependency: ['filterSignal']
        }
      ]
    },
    {
      id: 'markData',
      source: 'table'
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'category' },
      range: [0, 320],
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      domain: [100, 0],
      nice: true,
      range: [0, 320]
    },
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'category' },
      range: category10
    }
  ],

  marks: [
    {
      type: 'group',
      encode: {
        enter: { x: 40, y: 40, width: 320, height: 320 }
      },
      marks: [
        // {
        //   type: 'component',
        //   componentType: 'crosshair',
        //   scale: 'xscale',
        //   crosshairType: 'x',
        //   crosshairShape: 'line'
        // },
        // {
        //   type: 'component',
        //   componentType: 'crosshair',
        //   scale: 'yscale',
        //   crosshairType: 'y',
        //   crosshairShape: 'line'
        // },
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'xscale',
          crosshairType: 'x',
          crosshairShape: 'rect'
        },
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'yscale',
          crosshairType: 'y',
          crosshairShape: 'rect'
        },
        {
          type: 'rect',
          id: 'bar',
          from: { data: 'markData' },
          animationState: { signal: 'animationState' },
          animation: {
            appear: {
              // type: 'growHeight',
              // channel: ['width'],
              type: 'fadeIn',
              duration: 2000
              // loop: 5
              // oneByOne: true
            },
            disappear: {
              type: 'growHeightOut',
              duration: 2000
            },
            enter: {
              type: 'growHeightIn',
              duration: 1000
            },
            exit: {
              type: 'fadeOut',
              duration: 1000
            },
            update: {
              type: 'update',
              duration: 1000
            }
          },
          encode: {
            enter: {},
            update: {
              x: { scale: 'xscale', field: 'category' },
              width: { scale: 'xscale', band: 1 },
              y: { scale: 'yscale', field: 'amount' },
              y1: { scale: 'yscale', value: 0 },
              fill: { scale: 'colorScale', field: 'category' }
              // fill: {
              //   callback: (datum: any, el: any, params: any) => {
              //     // console.log(ctx);
              //     return datum.amount < 60 ? 'red' : 'lightgreen';
              //   },
              //   dependency: ['xscale']
              // }
            },
            hover: {
              fill: 'red',
              width: { scale: 'xscale', band: 1.5 }
            }
          }
        },
        {
          type: 'component',
          componentType: 'label',
          target: 'bar',
          encode: {
            update: {
              text: (datum: any) => `${datum.amount}`
            }
          }
        },
        {
          type: 'component',
          componentType: 'tooltip',
          target: 'bar',
          encode: { update: { offsetX: 40 } },
          title: { value: 'HEY!HEY!HEY!' },
          content: {
            key: { text: 'amount', fillColor: 'red' },
            value: datum => datum.amount,
            symbol: { fillColor: 'red', symbolType: 'square' }
          }
        }
      ]
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      encode: {
        update: {
          x: 40,
          y: 360,
          start: { x: 0, y: 0 },
          end: { x: 320, y: 0 }
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yscale',
      encode: {
        update: {
          x: 40,
          y: 40,
          start: { x: 0, y: 0 },
          end: { x: 0, y: 320 }
        }
      }
    },
    {
      type: 'component',
      componentType: 'legend',
      scale: 'colorScale',
      target: {
        data: 'markData',
        filter: 'category'
      },
      encode: {
        update: {
          x: 40,
          y: 0,
          layout: 'horizontal'
        }
      }
    },
    {
      type: 'component',
      componentType: 'legend',
      scale: 'yscale',
      encode: {
        update: {
          x: 100,
          y: 30
        }
      }
    }
  ]
};

export const callback = (chartInstance: any) => {
  const removeButton = document.getElementById('remove');
  const resetButton = document.getElementById('reset');

  removeButton?.addEventListener('click', () => {
    if (chartInstance) {
      chartInstance.data('table', []);
      chartInstance.run();
    }
  });

  resetButton?.addEventListener('click', () => {
    if (chartInstance) {
      chartInstance.data('table', [
        { category: 'A', amount: 28 },
        { category: 'B', amount: 55 },
        { category: 'C', amount: 43 },
        { category: 'D', amount: 91 },
        { category: 'E', amount: 81 },
        { category: 'F', amount: 53 },
        { category: 'G', amount: 19 },
        { category: 'H', amount: 87 }
      ]);
      chartInstance.run();
    }
  });

  const increaseButton = document.createElement('button');
  increaseButton.innerText = 'increase filter';
  document.getElementById('footer')?.appendChild(increaseButton);
  const decreaseButton = document.createElement('button');
  decreaseButton.innerText = 'decrease filter';
  document.getElementById('footer')?.appendChild(decreaseButton);
  const disappearButton = document.createElement('button');
  disappearButton.innerText = 'disappear';
  document.getElementById('footer')?.appendChild(disappearButton);

  chartInstance.addEventListener('animationStart', (state: string) => {
    console.log('animationStart: ', state);
    if (state === 'appear') {
      chartInstance.signal('animationState', null);
    }
  });
  chartInstance.addEventListener('animationEnd', (state: string) => {
    console.log('animationEnd: ', state);
  });
  increaseButton.addEventListener('click', () => {
    chartInstance.signal('filterSignal', chartInstance.signal('filterSignal') + 1);
    chartInstance.runAsync();
  });
  decreaseButton.addEventListener('click', () => {
    chartInstance.signal('filterSignal', chartInstance.signal('filterSignal') - 1);
    chartInstance.runAsync();
  });
  disappearButton.addEventListener('click', () => {
    chartInstance.signal('animationState', 'disappear');
    chartInstance.runAsync();
  });
};
