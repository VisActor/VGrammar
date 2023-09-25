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
  const datazoomData = view
    .data()
    .id('datazoomData')
    .source(data)
    .transform([
      {
        type: 'aggregate',
        groupBy: ['category'],
        fields: ['amount'],
        ops: ['sum'],
        as: ['amount']
      }
    ]);
  const markData = view.data().id('markData').source(data);
  const datazoomXScale = view.scale('point').domain({ data: data, field: 'category' }).range([0, 270]).configure({
    padding: 0.5
  });
  const datazoomYScale = view.scale('linear').domain({ data: datazoomData, field: 'amount' }).range([40, 0]);
  const colorScale = view.scale('ordinal').domain({ data: data, field: 'type' }).range(category10);
  const rightLegend = view
    .legend(view.rootMark)
    .id('rightLegend')
    .scale(colorScale)
    // .target(markData, 'type')
    .encode({ x: 340, y: 120 });
  view.interaction('legend-filter', {
    source: rightLegend,
    target: {
      data: markData,
      filter: 'type'
    }
  });
  const datazoom = view
    .datazoom(view.rootMark)
    .preview(
      datazoomData,
      { scale: datazoomXScale, field: 'category' },
      { scale: datazoomYScale, field: 'amount' },
      { scale: datazoomXScale, field: 'category' },
      () => 40
    )
    .target(markData, 'category')
    .encode({
      x: 40,
      y: 340,
      size: {
        width: 270,
        height: 40
      }
    });
  const slider = view.slider(view.rootMark).target(markData, 'amount').min(0).max(100).encode({
    layout: 'vertical',
    railWidth: 10,
    railHeight: 100,
    x: 350,
    y: 200
  });

  const xScale = view.scale('point').domain({ data: markData, field: 'category' }).range([0, 270]).configure({
    padding: 0.5
  });
  const yScale = view.scale('linear').domain([100, 0]).range([0, 270]);
  const xAxis = view
    .axis(view.rootMark)
    .id('xAxis')
    .scale(xScale)
    .encode({
      x: 30,
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
  const xLineCrosshair = view.crosshair(container).id('xLineCrosshair').scale(xScale).crosshairType('x');
  const yLineCrosshair = view.crosshair(container).id('yLineCrosshair').scale(yScale).crosshairType('y');

  const line = view
    .mark('line', container)
    .id('line')
    .join(markData, 'category', undefined, 'type', (datumA, datumB) => datumA.index - datumB.index)
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
};

export const callback = (view: IView) => {
  // do nothing
};
