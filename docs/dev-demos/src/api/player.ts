/* eslint-disable no-console */
import { TagPointsUpdate } from '@visactor/vrender';
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

const playerOriginData: any[] = [];
for (let i = 0; i < 8; i++) {
  playerOriginData.push(originData.filter(datum => datum.index <= i));
}

console.log(playerOriginData);

export const runner = (view: IView) => {
  const data = view.data(originData);
  const playerData = view.data(playerOriginData);
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
    .encode({ x: 340, y: 70 });
  const discretePlayer = view
    .player(view.rootMark)
    .id('discretePlayer')
    .encode({
      x: 40,
      y: 340,
      size: { width: 300, height: 30 }
      // interval: 2000
    })
    .source(playerOriginData);
  view.interaction('player-filter', {
    source: discretePlayer,
    target: {
      data: markData
    }
  });
  const continuousPlayer = view
    .player(view.rootMark)
    .id('continuousPlayer')
    .encode({
      orient: 'right',
      x: 340,
      y: 140,
      size: { width: 30, height: 200 }
    });
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
        type: 'fadeIn',
        duration: 1000
      },
      exit: {
        type: 'fadeOut',
        duration: 1000
      },
      update: [
        {
          type: 'update',
          options: { excludeChannels: 'points' },
          duration: 1000,
          easing: 'linear'
        },
        {
          channel: ['points'],
          custom: TagPointsUpdate,
          duration: 1000,
          easing: 'linear'
        }
      ],
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
      stroke: 'grey'
      // lineWidth: 1,
      // opacity: 1,
      // fillOpacity: 1,
      // strokeOpacity: 1
    })
    .encodeState('hover', { fill: 'red' })
    .animation({
      enter: {
        type: 'fadeIn',
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
    .id('label')
    .target(symbol)
    .labelStyle({
      textStyle: {
        fill: '#666'
      }
    })
    .encode({
      text: (datum: any) => `${datum.amount}`
    });
};

export const callback = (view: IView) => {
  // do nothing
};
