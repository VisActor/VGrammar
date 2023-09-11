/* eslint-disable no-console */
import type { IView } from '@visactor/vgrammar-simple';
import type { IBandLikeScale } from '@visactor/vscale';
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
  { category: 'D', amount: -87, index: 11, type: 'Third' }
];

export const runner = (view: IView) => {
  const data = view.data(originData).transform([
    {
      type: 'stack',
      dimensionField: 'category',
      stackField: 'amount',
      asStack: 'amount',
      asPrevStack: 'lastAmount'
    }
  ]);
  const xScale = view.scale('band').domain({ data: data, field: 'category' }).range([0, 270]);
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

  const bar = view
    .mark('rect', container)
    .join(data)
    .encode({
      // x: { scale: xScale, field: 'category' },
      x: {
        callback: (datum: any) => {
          const width = 20;
          const scale = xScale.getScale() as IBandLikeScale;
          return scale.scale(datum.category) + scale.bandwidth() / 2 - width / 2;
        },
        dependency: xScale
      },
      width: 20,
      y: { scale: yScale, field: 'lastAmount' },
      y1: { scale: yScale, field: 'amount' },
      fill: { scale: colorScale, field: 'type' }
    })
    .encodeState('hover', { fill: 'red' })
    .animation({
      enter: {
        type: 'growHeightIn',
        // options: { overall: true, orient: 'negative' },
        options: (...args: any[]) => {
          return { overall: yScale.getScale().scale(0), orient: 'negative' };
        },
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
  const label = view
    .label(container)
    .target(bar)
    .labelStyle({
      textStyle: {
        fontSize: 20
      }
    })
    .encode({
      text: (datum: any) => `${datum.amount}`
    });
};

export const callback = (view: IView) => {
  // do nothing
};
