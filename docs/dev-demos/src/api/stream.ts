/* eslint-disable no-console */
import type { IView } from '@visactor/vgrammar-simple';
import { category10 } from '../color-utils';

const originData = [
  { category: 'A', amount: 28, index: 0, type: 'First' },
  { category: 'B', amount: 55, index: 1, type: 'First' },
  { category: 'C', amount: 43, index: 2, type: 'First' },
  { category: 'D', amount: 91, index: 3, type: 'First' },

  { category: 'A', amount: 81, index: 4, type: 'Second' },
  { category: 'B', amount: 53, index: 5, type: 'Second' },
  { category: 'C', amount: -19, index: 6, type: 'Second' },
  { category: 'D', amount: -87, index: 7, type: 'Second' },

  { category: 'A', amount: -81, index: 8, type: 'Third' },
  { category: 'B', amount: -53, index: 9, type: 'Third' },
  { category: 'C', amount: -19, index: 10, type: 'Third' },
  { category: 'D', amount: -87, index: 11, type: 'Third' },
];

export const runner = (view: IView) => {
  const data = view.data(originData).transform([
    {
      type: 'stack',
      dimensionField: 'category',
      stackField: 'amount',
      asStack: 'amount',
      asPrevStack: 'lastAmount',
      // offset: 'silhouette',
      // offset: 'wiggle',
      // offset: 'diverging',
      offset: 'none',
    }
  ]);
  const xScale = view.scale('point').domain({ data: data, field: 'category' }).range([0, 270]);
  const yScale = view.scale('linear').domain([200, -200]).range([0, 270]);
  const colorScale = view.scale('ordinal').domain({ data: data, field: 'type' }).range(category10);
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

  const area = view
    .mark('area', container)
    .join(data, undefined, undefined, 'type')
    .encode({
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'lastAmount' },
      y1: { scale: yScale, field: 'amount' },
      fill: { scale: colorScale, field: 'type' },
      curveType: 'monotoneX'
    })
    .encodeState('hover', { fill: 'red' })
};

export const callback = (view: IView) => {
  // do nothing
};
