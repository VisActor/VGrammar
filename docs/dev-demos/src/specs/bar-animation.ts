/* eslint-disable no-console */
import type { IAnimationEvent, IView } from '@visactor/vgrammar';

export const spec = {
  description: 'A basic bar chart example, with value labels shown upon mouse hover.',
  width: 400,
  height: 200,
  padding: 5,

  signals: [
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
        { category: 'A', amount: 68, index: 0 },
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
          dependency: 'filterSignal'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'category' },
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.viewWidth];
        },
        dependency: ['viewWidth']
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'amount' },
      range: {
        callback: (scale, params) => {
          return [params.viewHeight, 0];
        },
        dependency: ['viewHeight']
      },
      nice: true
    }
  ],

  marks: [
    {
      type: 'rect',
      id: 'bar',
      from: { data: 'table' },
      key: 'category',
      sort: (datumA, datumB) => datumA.index - datumB.index,
      animationState: { signal: 'animationState' },
      animation: {
        // appear: {
        //   channel: {
        //     fill: { from: 'red', to: 'lightgreen' },
        //     duration: 2000
        //   }
        // },
        appear: {
          type: 'growHeightIn',
          // type: 'fadeIn',
          options: { orient: 'negative' },
          delay: (...args) => {
            // return args[0].index * 2000;
            // return args[0].index * 100;
          },
          duration: (...args) => {
            return 500;
          },
          // loop: 2,
          // totalTime: 5000,
          easing: 'linear'
          // oneByOne: () => {
          //   return 1000;
          // }
        },
        // appear: {
        //   channel: {
        //     fill: { from: 'red', to: 'lightgreen' }
        //   },
        //   easing: 'linear',
        //   duration: 2000
        // },
        disappear: {
          type: 'growHeightOut',
          options: (...args) => {
            console.log(args);
            return { orient: 'negative' };
          },
          // options: { direction: 'y', orient: 'negative' },
          duration: 2000
        },
        enter: {
          type: 'growHeightIn',
          options: { orient: 'negative' },
          duration: 1000
        },
        exit: {
          type: 'fadeOut',
          duration: 1000,
          controlOptions: {
            stopWhenStateChange: true
          }
        },
        update: {
          type: 'update',
          duration: 1000
        },
        state: {
          duration: 1000
        },
        // loop: [
        //   {
        //     channel: ['fillOpacity'],
        //     custom: (ratio: number, from: number, to: number, nextAttributes: any, datum: any, element: IElement) => {
        //       const changedOpacity = 0.3;
        //       const gap = 0.3;
        //       if (ratio <= gap) {
        //         nextAttributes.fillOpacity = (ratio / gap) * (changedOpacity - 1) + 1;
        //       } else if (ratio > gap && ratio < 1 - gap) {
        //         nextAttributes.fillOpacity = changedOpacity;
        //       } else {
        //         nextAttributes.fillOpacity = ((ratio - (1 - gap)) / gap) * (1 - changedOpacity) + changedOpacity;
        //       }
        //     },
        //     easing: 'linear',
        //     duration: 2000,
        //     oneByOne: 300,
        //     loop: true
        //   }
        // ]
        loop: {
          // startTime: 0,
          // totalTime: 2000,
          loop: true,
          oneByOne: 300,
          timeSlices: [
            {
              effects: {
                channel: {
                  fillOpacity: { to: 0.3 }
                },
                easing: 'linear'
              },
              duration: 500
            },
            {
              effects: {
                channel: {
                  fillOpacity: { to: 0.3 }
                },
                easing: 'linear'
              },
              duration: 1000
            },
            {
              effects: {
                channel: {
                  fillOpacity: { to: 1 }
                },
                easing: 'linear'
              },
              duration: 500
            }
          ]
          // timeSlices: [
          //   {
          //     effects: [
          //       {
          //         channel: {
          //           fillOpacity: { to: 0.3 }
          //         },
          //         easing: 'linear'
          //       },
          //       {
          //         channel: {
          //           lineWidth: { to: 5 }
          //         },
          //         easing: 'linear'
          //       }
          //     ],
          //     duration: 500
          //   },
          //   {
          //     effects: [
          //       {
          //         channel: {
          //           fillOpacity: { to: 0.3 }
          //         },
          //         easing: 'linear'
          //       },
          //       {
          //         channel: {
          //           lineWidth: { to: 5 }
          //         },
          //         easing: 'linear'
          //       }
          //     ],
          //     duration: 1000
          //   },
          //   {
          //     effects: [
          //       {
          //         channel: {
          //           fillOpacity: { to: 1 }
          //         },
          //         easing: 'linear'
          //       },
          //       {
          //         channel: {
          //           lineWidth: { to: 2 }
          //         },
          //         easing: 'linear'
          //       }
          //     ],
          //     duration: 500
          //   }
          // ]
        }
      },
      encode: {
        enter: {
          lineWidth: 2,
          stroke: 'black'
        },
        update: {
          x: { scale: 'xscale', field: 'category' },
          // width: { scale: 'xscale', band: 1 },
          width: 40,
          y: { scale: 'yscale', field: 'amount' },
          y1: { signal: 'viewHeight' },
          fill: 'lightgreen'
        },
        hover: {
          fill: 'red'
          // width: 60
          // width: { scale: 'xscale', band: 1.5 }
        }
      }
    }
  ]
};

export const callback = (view: IView) => {
  const increaseButton = document.createElement('button');
  increaseButton.innerText = 'increase filter';
  document.getElementById('footer')?.appendChild(increaseButton);
  const decreaseButton = document.createElement('button');
  decreaseButton.innerText = 'decrease filter';
  document.getElementById('footer')?.appendChild(decreaseButton);
  const disappearButton = document.createElement('button');
  disappearButton.innerText = 'disappear';
  document.getElementById('footer')?.appendChild(disappearButton);

  const loopRunButton = document.createElement('button');
  loopRunButton.innerText = 'loop run';
  document.getElementById('footer')?.appendChild(loopRunButton);
  const loopStopButton = document.createElement('button');
  loopStopButton.innerText = 'loop stop';
  document.getElementById('footer')?.appendChild(loopStopButton);

  const pauseButton = document.createElement('button');
  pauseButton.innerText = 'pause';
  document.getElementById('footer')?.appendChild(pauseButton);
  const resumeButton = document.createElement('button');
  resumeButton.innerText = 'resume';
  document.getElementById('footer')?.appendChild(resumeButton);

  let isLooping = false;

  view.addEventListener('animationStart', (event: IAnimationEvent) => {
    const state = event.animationState;
    console.log('animationStart: ', state);
    if (state === 'appear') {
      view.getSignalById('animationState').value(null);
    } else if (state === 'enter' || state === 'exit') {
      if (isLooping) {
        view.getMarkById('bar').animate.stopAnimationByState('loop');
      }
    }
  });
  view.addEventListener('animationEnd', (event: IAnimationEvent) => {
    const state = event.animationState;
    console.log('animationEnd: ', state);
    if (state === 'enter' || state === 'exit') {
      if (isLooping) {
        view.getMarkById('bar').animate.runAnimationByState('loop');
      }
    }
  });
  increaseButton.addEventListener('click', () => {
    const filterSignal = view.getSignalById('filterSignal');
    filterSignal.value(filterSignal.output() + 1);
    view.runAsync();
  });
  decreaseButton.addEventListener('click', () => {
    const filterSignal = view.getSignalById('filterSignal');
    filterSignal.value(filterSignal.output() - 1);
    view.runAsync();
  });
  disappearButton.addEventListener('click', () => {
    view.getSignalById('animationState').value('disappear');
    view.runAsync();
  });
  loopRunButton.addEventListener('click', () => {
    if (!isLooping) {
      view.getMarkById('bar').animate.runAnimationByState('loop');
      isLooping = true;
    }
  });
  loopStopButton.addEventListener('click', () => {
    if (isLooping) {
      view.getMarkById('bar').animate.stopAnimationByState('loop');
      isLooping = false;
    }
  });

  pauseButton.addEventListener('click', () => {
    view.getMarkById('bar').animate.pause();
  });
  resumeButton.addEventListener('click', () => {
    view.getMarkById('bar').animate.resume();
  });
};
