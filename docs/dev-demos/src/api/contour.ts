/* eslint-disable no-console */
import type { View, AnimationEvent } from '@visactor/vgrammar';
import type { IBandLikeScale } from '@visactor/vscale';

export const runner = (view: View) => {
  // console.log(
  //   new Array(20)
  //     .fill(1)
  //     .map((v, i) => ({ x: Math.round(Math.random() * 100), y: Math.round(Math.random() * 100), index: i }))
  //     .reduce((str, v) => str + `{ x: ${v.x}, y: ${v.y}, index: ${v.index} },\n`, '')
  // );
  const originData = [
    { x: 62, y: 95, index: 0 },
    { x: 84, y: 63, index: 1 },
    { x: 94, y: 31, index: 2 },
    { x: 42, y: 56, index: 3 },
    { x: 22, y: 83, index: 4 },
    { x: 76, y: 39, index: 5 },
    { x: 17, y: 89, index: 6 },
    { x: 29, y: 21, index: 7 },
    { x: 31, y: 16, index: 8 },
    { x: 38, y: 72, index: 9 },
    { x: 59, y: 96, index: 10 },
    { x: 17, y: 77, index: 11 },
    { x: 83, y: 78, index: 12 },
    { x: 83, y: 48, index: 13 },
    { x: 2, y: 5, index: 14 },
    { x: 75, y: 84, index: 15 },
    { x: 29, y: 11, index: 16 },
    { x: 50, y: 27, index: 17 },
    { x: 31, y: 1, index: 18 },
    { x: 75, y: 89, index: 19 },
  ];

  const data = view.data(originData);
  const kdeData = view.data(originData).transform([
    {
      type: 'kde',
      dimension: '2d',
      field: ['x', 'y'],
      extent: [{ x: 0, y: 0 }, { x: 100, y: 100 }],
      bandwidth: 3,
      as: ['x', 'y', 'kde']
    }
  ]);
  const contourData = view.data(originData).source(kdeData).transform([
    {
      type: 'contour',
      field: 'kde',
      row: 256,
      column: 256,
      levels: 5,
    }
  ]);

  const xScale = view.scale('linear').domain([0, 100]).range([0, 270]);
  const yScale = view.scale('linear').domain([100, 0]).range([0, 270]);
  const intensityScale = view.scale('linear').domain({ data: kdeData, field: 'kde' }).range([0, 0.01]);
  const xAxis = view
    .axis(view.rootMark)
    .id('xAxis')
    .scale(xScale)
    .encode({
      x: 40,
      y: 310,
      start: { x: 0, y: 0 },
      end: { x: 270, y: 0 },
      grid: { visible: true, length: 270 }
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

  const point = view
    .mark('symbol', container)
    .id('point')
    .join(data)
    .encode({
      x: { scale: xScale, field: 'x' },
      y: { scale: yScale, field: 'y' },
      size: 10,
      fill: 'lightGreen'
    });
  const kdePoint = view
    .mark('symbol', container)
    .id('point')
    .join(kdeData)
    .encode({
      x: { scale: xScale, field: 'x' },
      y: { scale: yScale, field: 'y' },
      fillOpacity: { scale: intensityScale, field: 'kde' },
      shape: 'square',
      fill: 'red'
    });
  const contour = view
    .mark('line', container)
    .id('contour')
    .join(contourData, undefined, undefined, 'points')
    .depend([xScale, yScale])
    .encode({
      points: (datum: any) => {
        return datum.points.map(point => {
          return {
            x: xScale.getScale().scale(point.x * 100),
            y: yScale.getScale().scale(point.y * 100)
          }
        });
      },
      stroke: 'purple',
      curveType: 'monotone'
    });
  // const contour = view
  //   .mark('polygon', container)
  //   .id('contour')
  //   .join(contourData)
  //   .depend([xScale, yScale])
  //   .encode({
  //     points: (datum: any) => {
  //       return datum.points.map(point => {
  //         return {
  //           x: xScale.getScale().scale(point.x * 100),
  //           y: yScale.getScale().scale(point.y * 100)
  //         }
  //       });
  //     },
  //     stroke: 'purple',
  //     curveType: 'monotone'
  //   });
};

export const callback = (chartInstance: any) => {
  // do nothing
};
