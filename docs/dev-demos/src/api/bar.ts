/* eslint-disable no-console */
import type { View, AnimationEvent } from '@visactor/vgrammar';
import type { IBandLikeScale } from '@visactor/vscale';

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
  const xScale = view.scale('band').domain({ data: data, field: 'category' }).range([0, 270]);
  const yScale = view.scale('linear').domain([100, 0]).range([0, 270]);
  const xAxis = view
    .axis(view.rootMark)
    .id('xAxis')
    .scale(xScale)
    .encode({
      x: 40,
      y: 310,
      start: { x: 0, y: 0 },
      end: { x: 270, y: 0 }
    });
  const yAxis = view
    .axis(view.rootMark)
    .id('yAxis')
    .scale(yScale)
    .encode({
      x: 40,
      y: 40,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 270 },
      grid: { visible: true, length: 270 }
    });
  const container = view.group(view.rootMark).id('container').encode({ x: 40, y: 40, width: 270, height: 270 });
  // const xLineCrosshair = view.crosshair(container).id('xLineCrosshair').scale(xScale).crosshairType('x');
  // const yLineCrosshair = view.crosshair(container).id('yLineCrosshair').scale(yScale).crosshairType('y');
  const xRectCrosshair = view
    .crosshair(container)
    .id('xRectCrosshair')
    .scale(xScale)
    .crosshairType('x')
    .crosshairShape('rect')
    .encode({ rectStyle: { fillColor: 'pink' } });
  const yRectCrosshair = view
    .crosshair(container)
    .id('yRectCrosshair')
    .scale(yScale)
    .crosshairType('y')
    .crosshairShape('rect')
    .encode({ rectStyle: { fillColor: 'pink' } });

  const bar = view
    .mark('rect', container)
    .join(data)
    .encode({
      // x: { scale: xScale, field: 'category' },
      x: {
        callback: (datum: any) => {
          const width = 20;
          const scale = xScale.getScale() as IBandLikeScale;
          return scale.scale(datum.category) + scale.bandwidth() / 2 - width / 2;
        },
        dependency: xScale
      },
      width: 20,
      y: { scale: yScale, field: 'amount' },
      y1: 270,
      fill: 'lightgreen'
    })
    .encodeState('hover', { fill: 'red' })
    .animation({
      appear: {
        type: 'fadeIn',
        // options: { direction: 'y', orient: 'negative' },
        duration: 2000,
        easing: 'linear'
      },
      disappear: {
        type: 'moveOut',
        options: (...args: any[]) => {
          console.log(args);
          return { direction: 'y', orient: 'negative' };
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
        duration: 1000
      },
      update: {
        type: 'update',
        duration: 1000
      },
      state: {
        duration: 1000
      }
    })
    .animationState({ signal: animationStateSignal });
  const label = view
    .label(container)
    .target(bar)
    .labelStyle({
      textStyle: {
        fontSize: 20
      }
    })
    .encode({
      text: (datum: any) => `${datum.amount}`
    });
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

  const darkThemeButton = document.createElement('button');
  darkThemeButton.innerText = 'dark theme';
  document.getElementById('footer')?.appendChild(darkThemeButton);
  const defaultThemeButton = document.createElement('button');
  defaultThemeButton.innerText = 'default theme';
  document.getElementById('footer')?.appendChild(defaultThemeButton);

  chartInstance.addEventListener('animationStart', (event: AnimationEvent) => {
    const state = event.animationState;
    console.log('animationStart: ', state);
    if (state === 'appear') {
      chartInstance.getSignalById('animationState').value(null);
    }
  });
  chartInstance.addEventListener('animationEnd', (event: AnimationEvent) => {
    const state = event.animationState;
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
    chartInstance.runAsync();
  });
  darkThemeButton.addEventListener('click', () => {
    chartInstance.setCurrentTheme('dark');
    chartInstance.runAsync();
  });
  defaultThemeButton.addEventListener('click', () => {
    chartInstance.setCurrentTheme('default');
    chartInstance.runAsync();
  });
};
