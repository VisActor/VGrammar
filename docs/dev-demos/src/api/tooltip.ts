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
  const rightLegend = view
    .legend(view.rootMark)
    .id('rightLegend')
    .scale(colorScale)
    .target(markData, 'type')
    .encode({ x: 340, y: 160 });
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
    .crosshairShape('rect');
  const yRectCrosshair = view
    .crosshair(container)
    .id('yRectCrosshair')
    .scale(yScale)
    .crosshairType('y')
    .crosshairShape('rect');

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
<<<<<<< HEAD
        // options: { orient: 'negative' },
        options: (...args) => { console.log(args) },
=======
        options: { orient: 'negative' },
>>>>>>> f5abe08 (feat: support group tooltip)
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
  
  const groupTooltip = view.tooltip(container)
    .id('groupTooltip')
    .target(line)
    .title('Total Sales Statistics')
    .encode({ offsetX: 10, offsetY: 10 })
    .content([
      {
        key: { text: 'amount' },
        value: datum => datum.amount,
        symbol: { fill: 'lightGreen', symbolType: 'square' }
      }
    ]);
  const dimensionTooltip = view.dimensionTooltip(container)
    .id('dimensionTooltip')
    .scale(xScale)
    .target(data, 'category')
    .avoidMark([symbol, line])
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
