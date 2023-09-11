/* eslint-disable no-console */
import type { View, IGroupMark } from '@visactor/vgrammar-simple';

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
  const xScale = view
    .scale('band')
    .domain({ data: data, field: 'category' })
    .range({
      callback: (scale, params) => {
        return [0, params.viewWidth];
      },
      dependency: view.getSignalById('viewWidth')
    });
  const yScale = view
    .scale('linear')
    .domain({ data: data, field: 'amount' })
    .range({
      callback: (scale, params) => {
        return [params.viewHeight, 0];
      },
      dependency: view.getSignalById('viewHeight')
    });
  const container = view
    .mark('group', view.rootMark)
    .layout({
      display: 'grid',
      gridTemplateColumns: [200, 100],
      gridTemplateRows: [100, 100],
      gridColumnGap: 50
    })
    .encode({
      width: 400,
      height: 200
    }) as IGroupMark;
  const cell11 = view
    .mark('rect', container)
    .layout({ gridRowStart: 1, gridRowEnd: 2, gridColumnStart: 1, gridColumnEnd: 2 })
    .encode({
      x: () => {
        return cell11.layoutBounds?.x1;
      },
      y: () => {
        return cell11.layoutBounds?.y1;
      },
      width: () => {
        return cell11.layoutBounds?.width();
      },
      height: () => {
        return cell11.layoutBounds?.height();
      },
      fill: 'lightgreen'
    });
  const cell12 = view
    .mark('rect', container)
    .layout({ gridRowStart: 1, gridRowEnd: 2, gridColumnStart: 2, gridColumnEnd: -1 })
    .encode({
      x: () => {
        return cell12.layoutBounds?.x1;
      },
      y: () => {
        return cell12.layoutBounds?.y1;
      },
      width: () => {
        return cell12.layoutBounds?.width();
      },
      height: () => {
        return cell12.layoutBounds?.height();
      },
      fill: 'blue'
    });
  const cell21 = view
    .mark('rect', container)
    .layout({ gridRowStart: 2, gridRowEnd: 3, gridColumnStart: 1, gridColumnEnd: 2 })
    .encode({
      x: () => {
        return cell21.layoutBounds?.x1;
      },
      y: () => {
        return cell21.layoutBounds?.y1;
      },
      width: () => {
        return cell21.layoutBounds?.width();
      },
      height: () => {
        return cell21.layoutBounds?.height();
      },
      fill: 'red'
    });
  const cell22 = view
    .mark('rect', container)
    .layout({ gridRowStart: 2, gridRowEnd: 3, gridColumnStart: 2, gridColumnEnd: 3 })
    .encode({
      x: () => {
        return cell22.layoutBounds?.x1;
      },
      y: () => {
        return cell22.layoutBounds?.y1;
      },
      width: () => {
        return cell22.layoutBounds?.width();
      },
      height: () => {
        return cell22.layoutBounds?.height();
      },
      fill: 'grey'
    });
  console.log(cell11, cell12, cell21, cell22);
};

export const callback = (chartInstance: any) => {
  // do nothing
};
