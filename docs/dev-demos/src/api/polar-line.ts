/* eslint-disable no-console */
import type { IView } from '@visactor/vgrammar';

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
  const data = view.data(originData);
  const xScale = view.scale('band').id('xScale').domain({ data: data, field: 'category' }).range([50, 350]);
  const yScale = view.scale('linear').id('yScale').domain({ data: data, field: 'amount' }).range([50, 350]);
  const thetaScale = view
    .scale('point')
    .id('thetaScale')
    .domain({ data: data, field: 'category' })
    .range([0, Math.PI * 2])
    .configure({ padding: 0.5 });
  const radiusScale = view.scale('linear').id('radiusScale').domain([0, 100]).range([0, 160]);
  const polar = view.coordinate('polar').id('polar').origin([200, 200]);

  const radiusAxis = view
    .axis(view.rootMark)
    .id('radiusAxis')
    .scale(radiusScale)
    .encode({
      x: 200,
      y: 200,
      start: { x: 0, y: 0 },
      end: { x: 160, y: 0 },
      grid: { visible: true, center: { x: 0, y: 0 }, type: 'circle', closed: true, sides: 10 }
    });
  const radiusGrid = view
    .grid(view.rootMark)
    .id('radiusGrid')
    .target(radiusAxis)
    // .gridShape('polygon');
    .gridShape('circle');
  const angleAxis = view
    .axis(view.rootMark)
    .id('angleAxis')
    .scale(thetaScale)
    .axisType('circle')
    .encode({
      center: { x: 200, y: 200 },
      radius: 160,
      grid: { visible: true }
    });
  const angleGrid = view
    .grid(view.rootMark)
    .id('angleGrid')
    .target(angleAxis);
  const angleLineCrosshair = view
    .crosshair(view.rootMark)
    .scale(thetaScale)
    .crosshairType('angle')
    .configureComponent({ radius: 160, center: { x: 200, y: 200 } });
  const angleSectorCrosshair = view
    .crosshair(view.rootMark)
    .scale(thetaScale)
    .crosshairShape('rect')
    .crosshairType('angle')
    .configureComponent({ radius: 160, center: { x: 200, y: 200 } });
  const radiusCircleCrosshair = view
    .crosshair(view.rootMark)
    .scale(radiusScale)
    .crosshairType('radius')
    .configureComponent({ radius: 160, center: { x: 200, y: 200 } });
  const radiusPolygonCrosshair = view
    .crosshair(view.rootMark)
    .scale(radiusScale)
    .crosshairType('radius-polygon')
    .configureComponent({ radius: 160, center: { x: 200, y: 200 } });
  const line = view
    .mark('line', view.rootMark)
    .id('line')
    .join(data)
    .coordinate(polar)
    .encode({
      theta: { scale: thetaScale, field: 'category' },
      r: { scale: radiusScale, field: 'amount' },
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      lineWidth: 4,
      stroke: 'lightgreen'
    })
    .animation({
      update: {
        type: 'update',
        duration: 2000
      }
    });
  const symbol = view
    .mark('symbol', view.rootMark)
    .id('symbol')
    .join(data)
    .coordinate(polar)
    .encode({
      theta: { scale: thetaScale, field: 'category' },
      r: { scale: radiusScale, field: 'amount' },
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      size: 10,
      stroke: 'black',
      lineWidth: 1,
      fill: 'lightgreen'
    })
    .encodeState('hover', { fill: 'red', width: 60 })
    .animation({
      update: {
        type: 'update',
        duration: 2000
      }
    });
  const dimensionTooltip = view.dimensionTooltip(view.rootMark)
    .id('dimensionTooltip')
    .scale(xScale)
    .target(data, 'category')
    .tooltipType('angle')
    // .avoidMark([symbol, line])
    .title('Sales Statistics On Category')
    .encode({ offsetX: 10, offsetY: 10 })
    .content([
      {
        key: 'category',
        value: { field: 'category' },
        symbol: { fill: 'lightGreen' }
      },
      {
        key: { text: 'amount' },
        value: datum => datum.amount,
        symbol: { fill: 'lightGreen', symbolType: 'square' }
      }
    ]);
};

export const callback = (view: IView) => {
  // do nothing
};
