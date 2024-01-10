/* eslint-disable no-console */
import type { IView } from '@visactor/vgrammar';
import { category10 } from '../color-utils';

const originData = [
  { category: 'A', amount: 28, index: 0, type: 'A' },
  { category: 'B', amount: 55, index: 1, type: 'A' },
  { category: 'C', amount: 43, index: 2, type: 'A' },
  { category: 'D', amount: 91, index: 3, type: 'A' },
  { category: 'E', amount: 81, index: 4, type: 'A' },
  { category: 'F', amount: 53, index: 5, type: 'A' },
  { category: 'G', amount: 19, index: 6, type: 'A' },
  { category: 'H', amount: 87, index: 7, type: 'A' },

  { category: 'A', amount: 18, index: 0, type: 'B' },
  { category: 'B', amount: 35, index: 1, type: 'B' },
  { category: 'C', amount: 23, index: 2, type: 'B' },
  { category: 'D', amount: 71, index: 3, type: 'B' },
  { category: 'E', amount: 71, index: 4, type: 'B' },
  { category: 'F', amount: 33, index: 5, type: 'B' },
  { category: 'G', amount: 10, index: 6, type: 'B' },
  { category: 'H', amount: 47, index: 7, type: 'B' }
];

export const runner = (view: IView) => {
  const data = view.data(originData);
  const markData = view.data().source(data);
  const xScale = view.scale('point').domain({ data: data, field: 'category' }).range([0, 270]).configure({
    padding: 0.5
  });
  const yScale = view.scale('linear').domain([100, 0]).range([0, 270]);
  const colorScale = view.scale('ordinal').domain({ data: data, field: 'type' }).range(category10);

  const windowGroup = view.group(view.rootMark).encode({
    stroke: '#000000',
    lineWidth: 1,
    width: 200,
    height: 200,
    x: 0,
    y: 0,
    clip: true
  });

  // const clipXScrollbar = view.scrollbar(windowGroup).configure({ 'zIndex': 10 }).encode({
  //   x: 0,
  //   y: 200 - 12,
  //   width: 200,
  //   height: 12,
  //   padding: [2, 0],
  //   railStyle: {
  //     fill: 'rgba(0, 0, 0, .1)'
  //   },
  //   range: [0, 200 / 350],
  // });
  // const clipYScrollbar = view.scrollbar(windowGroup).configure({ 'zIndex': 10 }).encode({
  //   direction: 'vertical',
  //   x: 200 - 12,
  //   y: 0,
  //   width: 12,
  //   height: 200,
  //   padding: [0, 2],
  //   railStyle: {
  //     fill: 'rgba(0, 0, 0, .1)'
  //   },
  //   range: [0, 200 / 350],
  // });
  const clipXScrollbar = view
    .scrollbar(windowGroup)
    .direction('horizontal')
    .position('bottom')
    // .position('top')
    .configure({ 'zIndex': 10 })
    .encode({
      range: [0, (200/ 350)]
    });
  const clipYScrollbar = view
    .scrollbar(windowGroup)
    .direction('vertical')
    .position('right')
    // .position('left')
    .configure({ 'zIndex': 10 })
    .encode({
      range: [0, (200/ 350)]
    });

  const clipXSignal = view.signal([0, 200 / 350]);
  const clipYSignal = view.signal([0, 200 / 350]);

  clipXScrollbar.addEventListener('scroll', (e: any) => {
    // console.log('clipXScrollBar', e.detail.value);
    const range = e.detail.value;
    clipXSignal.value(range);
    view.run();
  });
  clipYScrollbar.addEventListener('scroll', (e: any) => {
    // console.log('clipYScrollBar', e.detail.value);
    const range = e.detail.value;
    clipYSignal.value(range);
    view.run();
  });

  const containerGroup = view.group(windowGroup).encode({
    stroke: 'blue',
    lineWidth: 2,
    width: 350,
    height: 350,
    x: () => -clipXSignal.getValue()[0] * 350,
    y: () => -clipYSignal.getValue()[0] * 350,
  }).depend([clipXSignal, clipYSignal]);

  const xAxis = view
    .axis(containerGroup)
    .id('xAxis')
    .scale(xScale)
    // .tickCount(3)
    .encode({
      x: 40,
      y: 310,
      start: { x: 0, y: 0 },
      end: { x: 270, y: 0 }
    });
  const yAxis = view
    .axis(containerGroup)
    .id('yAxis')
    .scale(yScale)
    .encode({
      x: 40,
      y: 40,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 270 },
    });
  const yGrid = view
    .grid(containerGroup)
    .id('yGrid')
    .target(yAxis);
  const container = view.group(containerGroup).id('container').encode({ x: 40, y: 40, width: 270, height: 270 });

  const line = view
    .mark('line', container)
    .id('line')
    .join(markData, 'category', undefined, 'type')
    .encode({
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      stroke: { scale: colorScale, field: 'type' },
      lineWidth: 2
    })
    .animation({
      enter: {
        type: 'growPointsYIn',
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
    });
  const symbol = view
    .mark('symbol', container)
    .id('symbol')
    .join(markData, (datum: any) => `${datum.category}_${datum.type}`)
    .encode({
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      fill: { scale: colorScale, field: 'type' },
      stroke: 'grey',
      lineWidth: 1
    })
    .encodeState('hover', { fill: 'red' })
    .animation({
      enter: {
        type: 'moveIn',
        duration: 1000,
        options: { direction: 'y', orient: 'negative' }
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
    });
  const label = view
    .label(container)
    .id('label')
    .target(symbol)
    .labelStyle({
      textStyle: {
        fillColor: '#666'
      }
    })
    .encode({
      text: (datum: any) => `${datum.amount}`
    });
};

export const callback = (view: IView) => {
  // do nothing
};
