/* eslint-disable no-console */
import type { View, ISignal, IElement } from '@visactor/vgrammar';

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
      duration: 3000
    }
  };

  const data = view.data(originData);
  const xScale = view
    .scale('band')
    .domain({ data: data, field: 'category' })
    .range({
      callback: (scale, params) => {
        return [0, params.viewWidth];
      },
      dependency: view.getSignalById('viewWidth') as ISignal
    });
  const yScale = view
    .scale('linear')
    .domain({ data: data, field: 'amount' })
    .range({
      callback: (scale, params) => {
        return [params.viewHeight, 0];
      },
      dependency: view.getSignalById('viewHeight') as ISignal
    });
  const bar = view
    .mark('rect', view.rootMark)
    .join(data)
    .encode({
      x: { scale: xScale, field: 'category' },
      width: 40,
      y: { scale: yScale, field: 'amount' },
      y2: { signal: view.getSignalById('viewHeight') },
      fill: 'lightgreen'
    })
    // .encodeState('hover', { fill: 'red', width: 60 })
    .encodeState('custom', { fill: 'red' })
    .animation(markAnimation);
};

export const callback = (chartInstance: any) => {
  let lastElement: IElement;

  chartInstance.addEventListener('mousedown', (event: any, element: IElement) => {
    lastElement?.removeState('custom');
    if (element) {
      element.addState('custom');
      lastElement = element;
    }
  });
};
