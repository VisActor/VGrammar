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
    { category: 'H', amount: 87, index: 7 },
  ];

  const data = view.data(originData);
  const binData = view.data(originData).transform([{
    type: 'bin',
    field: 'amount',
    extent: [0, 100],
    step: 10,
    as: ['binStart', 'binEnd']
  }])
  const kdeData = view.data(originData).transform([
    {
      type: 'kde',
      field: "amount",
      extent: [0, 100],
      bandwidth: 5,
      as: ['value', 'kde']
    }
  ]);

  const xScale = view.scale('linear').domain([0, 100]).range([0, 270]);
  const binYScale = view.scale('linear').domain([3, 0]).range([0, 270]);
  const kdeYScale = view.scale('linear').domain([0.05, 0]).range([0, 270]);
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
    .scale(binYScale)
    .tickCount(3)
    .encode({
      x: 40,
      y: 40,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 270 },
      grid: { visible: true, length: 270 }
    });
  const y2Axis = view
    .axis(view.rootMark)
    .id('y2Axis')
    .scale(kdeYScale)
    .encode({
      x: 310,
      y: 40,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 270 },
      verticalFactor: -1
    });
  const container = view.group(view.rootMark).id('container').encode({ x: 40, y: 40, width: 270, height: 270 });

  const bar = view
    .mark('rect', container)
    .join(binData, 'binStart')
    .encode({
      x: { scale: xScale, field: 'binStart' },
      width: 26,
      y: {
        callback: (datum: any, element: any) => {
          const count = element.data.length;
          return binYScale.scale.scale(count);
        },
        dependency: binYScale
      },
      y1: 270,
      fill: 'lightgreen'
    });
  const line = view
    .mark('line', container)
    .join(kdeData)
    .encode({
      x: { scale: xScale, field: 'value' },
      y: { scale: kdeYScale, field: 'kde' },
      stroke: 'blue',
    })
};

export const callback = (chartInstance: any) => {
  // do nothing
};
