/* eslint-disable no-console */
import type { View } from '@visactor/vgrammar-simple';

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
  const data = view.data(originData);
  const container = view.group(view.rootMark).encode({ x: 100, y: 100 });
  const xScale = view.scale('band').domain({ data: data, field: 'category' }).range([160, 240]);
  const yScale = view.scale('linear').domain({ data: data, field: 'amount' }).range([0, 100]);
  const bar = view
    .mark('rect', container)
    .encode({
      x: 10,
      x1: 40,
      // width: 40,
      y: 10,
      y1: 60,
      // height: 60,
      fill: 'lightgreen'
    })
    .encodeState('hover', {
      fill: 'red',
      // width: 60
      // x: 20
      x1: 60,
      y1: 80
    });
  const negativeBar = view
    .mark('rect', container)
    .encode({
      x: 100,
      x1: 70,
      // width: 40,
      y: 60,
      y1: 10,
      // height: 60,
      fill: 'lightgreen'
    })
    .encodeState('hover', {
      fill: 'red',
      // width: 60
      // x: 20
      x: 120,
      y: 80
    });
  const rule = view
    .mark('rule', container)
    .encode({
      stroke: 'black',
      lineWidth: 12,
      x: 10,
      y: 100,
      x1: 100,
      y1: 100
    })
    .encodeState('hover', {
      stroke: 'red',
      x: 40,
      x1: 130
      // x: 0,
      // y: 100,
      // x1: 150,
      // y1: 100
    });
  const area = view
    .mark('area', container)
    .join(data)
    .encode({
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      x1: { scale: xScale, field: 'category' },
      y1: 120,
      fill: 'lightgreen',
      lineWidth: 8
    })
    .encodeState('hover', {
      fill: 'red',
      y1: 160
    });
  const line = view
    .mark('line', container)
    .join(data)
    .encode({
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      stroke: 'green',
      lineWidth: 8
    })
    .encodeState('hover', {
      stroke: 'red',
      lineWidth: 40,
      // x: { scale: xScale, field: 'category' },
      y: 50
    });
};

export const callback = (chartInstance: any) => {
  //
};
