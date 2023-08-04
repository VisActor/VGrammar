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
  const kdeData = view.data(originData).transform([{
    type: 'kde',
    field: "amount",
    bandwidth: 10,
    as: 'kde'
  }]);
  console.log(kdeData);

  const xScale = view.scale('linear').domain([0, 100]).range([0, 270]);
  const yScale = view.scale('linear').domain([100, 0]).range([0, 270]);
  const y2Scale = view.scale('linear').domain([1, 0]).range([0, 270]);
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
  const y2Axis = view
    .axis(view.rootMark)
    .id('y2Axis')
    .scale(y2Scale)
    .encode({
      x: 310,
      y: 40,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 270 },
      verticalFactor: -1
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

  // const bar = view
  //   .mark('rect', container)
  //   .join(data)
  //   .encode({
  //     // x: { scale: xScale, field: 'category' },
  //     x: { scale: xScale, field: 'amount'},
  //     width: 32,
  //     y: { scale: yScale, field: 'amount' },
  //     y1: 270,
  //     fill: 'lightgreen'
  //   })
  //   .encodeState('hover', { fill: 'red' });

  const line = view
    .mark('line', container)
    .join(kdeData)
    .encode({
      x: { scale: xScale, field: 'category' },
      y: { scale: y2Scale, field: 'kde' },
      stroke: 'blue',
    })
};

export const callback = (chartInstance: any) => {
  // do nothing
};
