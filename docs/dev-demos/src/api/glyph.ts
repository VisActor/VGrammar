/* eslint-disable no-console */
import type { View, ISignal } from '@visactor/vgrammar';
import { Factory } from '@visactor/vgrammar';

export const runner = (view: View) => {
  const originData = [
    { category: 'A', amount: 28, index: 0 },
    { category: 'B', amount: 55, index: 1 },
    { category: 'C', amount: 43, index: 2 },
    { category: 'D', amount: 91, index: 3 },
    { category: 'E', amount: 81, index: 4 },
    { category: 'F', amount: 53, index: 5 },
    { category: 'G', amount: 19, index: 6 },
    { category: 'H', amount: 87, index: 7 }
  ];

  const markAnimation = {
    appear: {
      type: 'fadeIn',
      // options: { direction: 'y', orient: 'negative' },
      duration: 1000,
      easing: 'linear'
    },
    disappear: {
      type: 'moveOut',
      options: (...args) => {
        // console.log(args);
        return { direction: 'y', orient: 'negative' };
      },
      // options: { direction: 'y', orient: 'negative' },
      duration: 1000
    },
    enter: {
      type: 'fadeIn',
      options: { orient: 'negative' },
      duration: 1000
    },
    exit: {
      type: 'fadeOut',
      duration: 1000
    },
    update: {
      type: 'update',
      duration: 1000
    },
    state: {
      duration: 1000
    }
  };

  // const glyphMeta = registerGlyph('testGlyph', { rect: 'rect', rule: 'rule' })
  //   .registerDefaultEncoder(() => {
  //     return {
  //       rule: { lineWidth: 4 },
  //       rect: { lineWidth: 4, borderRadius: 5 }
  //     };
  //   })
  //   .registerEncoder('color', (channel: string, encodeValue: any) => {
  //     return {
  //       rule: { fill: encodeValue, stroke: encodeValue },
  //       rect: { fill: encodeValue, stroke: encodeValue }
  //     };
  //   })
  //   .registerEncoder('width', (channel: string, encodeValue: any, encodeValues: any) => {
  //     return {
  //       rule: { x1: encodeValues.x + encodeValue }
  //     };
  //   })
  //   .registerEncoder('y', (channel: string, encodeValue: any, encodeValues: any) => {
  //     const yCenter = (encodeValues.y + encodeValues.y1) / 2;
  //     return {
  //       rule: { y: yCenter, y1: yCenter }
  //     };
  //   });

  const glyphMeta = Factory.registerGlyph(
    'testGlyph',
    { rect: 'rect', rule: 'rule' },
    {
      color: (channel: string, encodeValue: any) => {
        return {
          rule: { fill: encodeValue, stroke: encodeValue },
          rect: { fill: encodeValue, stroke: encodeValue }
        };
      },
      width: (channel: string, encodeValue: any, encodeValues: any) => {
        return {
          rule: { x1: encodeValues.x + encodeValue }
        };
      },
      y: (channel: string, encodeValue: any, encodeValues: any) => {
        const yCenter = (encodeValues.y + encodeValues.y1) / 2;
        return {
          rule: { y: yCenter, y1: yCenter }
        };
      }
    },
    () => {
      return {
        rule: { lineWidth: 4 },
        rect: { lineWidth: 4, borderRadius: 5 }
      };
    }
  );

  const animationStateSignal = view.signal('appear').id('animationState');
  const filterSignal = view.signal(0).id('filterSignal');
  const data = view.data(originData).transform([
    {
      type: 'filter',
      callback: datum => {
        return datum.index >= filterSignal.output();
      },
      dependency: filterSignal
    }
  ]);
  const xScale = view
    .scale('band')
    .domain({ data: data, field: 'category' })
    .range({
      callback: (scale, params) => {
        return [0, params.viewWidth];
      },
      dependency: view.getSignalById('viewWidth') as ISignal<number>
    });
  const yScale = view
    .scale('linear')
    .domain({ data: data, field: 'amount' })
    .range({
      callback: (scale, params) => {
        return [params.viewHeight, 0];
      },
      dependency: view.getSignalById('viewHeight') as ISignal<number>
    });
  const glyph = view
    .glyph('testGlyph', view.rootMark)
    .id('customGlyph')
    // .mark('rect', view.rootMark)
    .join(data)
    .encode({
      x: { scale: xScale, field: 'category' },
      width: 40,
      // height: 40,
      // x1: {
      //   callback: (datum: any, el: any, params: any) => {
      //     return xScale.output().scale(datum.category) + 40;
      //   },
      //   dependency: xScale
      // },
      y: { scale: yScale, field: 'amount' },
      y1: { signal: view.getSignalById('viewHeight') },
      fill: 'lightgreen',
      // fillOpacity: 0.2,
      stroke: 'black'
      // lineWidth: 2
      // color: 'lightgreen'
    })
    .encodeState('hover', {
      fill: 'red'
      // width: 60,
      // x: { scale: xScale, field: 'category' },
      // y: { scale: yScale, field: 'amount' },
      // y1: { signal: view.getSignalById('viewHeight') }
      // x1: {
      //   callback: (datum: any, el: any, params: any) => {
      //     return xScale.output().scale(datum.category) + 60;
      //   },
      //   dependency: xScale
      // }
      // stroke: 'blue'
    })
    .animationState({ signal: animationStateSignal })
    .animation(markAnimation);
};

export const callback = (chartInstance: any) => {
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
      chartInstance.getSignalById('animationState').value(null);
    }
  });
  chartInstance.addEventListener('animationEnd', (state: string) => {
    console.log('animationEnd: ', state);
  });
  increaseButton.addEventListener('click', () => {
    const signal = chartInstance.getSignalById('filterSignal');
    signal.value(signal.output() + 1);
    chartInstance.runAsync();
  });
  decreaseButton.addEventListener('click', () => {
    const signal = chartInstance.getSignalById('filterSignal').value();
    signal.value(signal.output() - 1);
    chartInstance.runAsync();
  });
  disappearButton.addEventListener('click', () => {
    chartInstance.getSignalById('animationState').value('disappear');
    chartInstance.run();
  });
};
