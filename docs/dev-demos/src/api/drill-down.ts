/* eslint-disable no-console */
import type { View } from '@visactor/vgrammar';

export const runner = (view: View) => {
  const originData = [
    {
      category: 'A',
      amount: 28,
      index: 0,
      children: [
        { category: 'A-1', amount: 12 },
        { category: 'A-2', amount: 16 }
      ]
    },
    {
      category: 'B',
      amount: 55,
      index: 1,
      children: [
        { category: 'B-1', amount: 30 },
        { category: 'B-2', amount: 25 }
      ]
    },
    {
      category: 'C',
      amount: 43,
      index: 2,
      children: [
        { category: 'C-1', amount: 20 },
        { category: 'C-2', amount: 23 }
      ]
    },
    {
      category: 'D',
      amount: 91,
      index: 3,
      children: [
        { category: 'C-1', amount: 70 },
        { category: 'C-2', amount: 21 }
      ]
    }
  ];

  const data = view.data(originData);
  const xScale = view.scale('band').domain({ data: data, field: 'category' }).range([0, 270]).configure({ paddingInner: 0.1, paddingOuter: 0.1 });
  const yScale = view.scale('linear').domain([100, 0]).range([0, 270]);
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

  const bar = view
    .mark('rect', container)
    .join(data)
    .encode({
      x: { scale: xScale, field: 'category' },
      width: { scale: xScale, band: 1 },
      y: { scale: yScale, field: 'amount' },
      y1: 270,
      fill: 'lightgreen'
    })
    .encodeState('hover', { fill: 'red' })
    .animation({
      enter: {
        type: 'growHeightIn',
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
  const label = view
    .label(container)
    .target(bar)
    .labelStyle({
      textStyle: {
        fontSize: 14
      }
    })
    .encode({
      text: (datum: any) => `${datum.category}-${datum.amount}`
    });
  view.interaction('drill-down', {
    selector: bar,
    target: {
      data: data,
      transform: (data: any[], filterValue: any[]) => {
        if (!filterValue || filterValue.length === 0 || !filterValue[0].children) {
          return data;
        }
        return filterValue.reduce((result, datum) => {
          return result.concat(datum.children);
        }, []);
      }
    }
  });

  // const rollupContainer = view
  //   .group(view.rootMark)
  //   .encode({
  //     x: 340,
  //     y: 20,
  //     width: 70,
  //     height: 40,
  //     fill: '#11a41a'
  //   })
  // const rollup = view
  //   .mark('text', rollupContainer)
  //   .encode({
  //     text: 'Roll-Up',
  //     fontSize: 16
  //   });
  // view.interaction('roll-up', {
  //   source: rollupContainer,
  //   target: {
  //     data: data,
  //     transform: (data: any[], filterValue: any[]) => {
  //       return originData;
  //     }
  //   }
  // });
};

export const callback = (chartInstance: any) => {
  // do nothing
};
