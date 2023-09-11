/* eslint-disable no-console */
import type { ISignal, IView } from '@visactor/vgrammar-simple';

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

export const runner = (view: IView) => {
  const signal = view
    .signal('hi')
    .id('signal')
    .value(null)
    .value(undefined)
    .value('aaa')
    // .value(123)
    .update(undefined)
    // .update(() => 222)
    .update(() => 'bbb');
  console.log('empty signal spec: ', signal.getSpec());

  const data = view.data(originData).id('data');
  const emptyData = view.data([]).transform([]).transform(null).source('data').source(null);
  console.log('empty data spec: ', emptyData.getSpec());

  const xScale = view
    .scale('band')
    .id('xScale')
    .domain({ data: data, field: 'category' })
    .range({
      callback: (scale, params) => {
        return [0, params.viewWidth];
      },
      dependency: view.getSignalById('viewWidth') as ISignal<number>
    });
  const yScale = view
    .scale('linear')
    .id('yScale')
    .domain({ data: data, field: 'amount' })
    .range({
      callback: (scale, params) => {
        return [params.viewHeight, 0];
      },
      dependency: view.getSignalById('viewHeight') as ISignal<number>
    });

  const emptyScale = view
    .scale('band')
    .domain({ data: data, field: 'category' })
    .domain(null)
    .range([0, 100])
    .range(null)
    .configure({ round: true, padding: 0.1 })
    .configure(null);
  console.log('empty scale spec: ', emptyScale.getSpec());

  const coord = view.coordinate('polar').id('polar').origin([200, 200]).origin(null).scale([0.5, 0.5]).scale(undefined);
  console.log('empty coord spec: ', coord.getSpec());

  const bar = view
    .mark('rect', view.rootMark)
    .join(data)
    .encode({
      x: { scale: xScale, field: 'category' },
      width: 40,
      y: { scale: yScale, field: 'amount' },
      y1: { signal: view.getSignalById('viewHeight') },
      fill: 'lightgreen'
    })
    .encodeState('hover', { fill: 'red', width: 60 });
  const emptyBar = view
    .mark('rect', view.rootMark)
    .id('barEmpty')
    .join(data, 'category')
    .join(null)
    .encode({
      x: { scale: xScale, field: 'category' },
      width: 40,
      y: { scale: yScale, field: 'amount' },
      y1: { signal: view.getSignalById('viewHeight') },
      fill: 'lightgreen'
    })
    .encode({})
    .encodeState('hover', { fill: 'red', width: 60 })
    .animation({
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
      }
    })
    .animation(null)
    .animationState('appear')
    .animationState(null)
    .layout({ gridRowStart: 1, gridRowEnd: 2, gridColumnStart: 1, gridColumnEnd: 2 })
    .layout(null)
    .transform([])
    .transform(null)
    .configure({});

  console.log('bar spec: ', bar.getSpec());
  console.log('empty bar spec: ', emptyBar.getSpec());
};

export const callback = (view: IView) => {
  // do nothing
};
