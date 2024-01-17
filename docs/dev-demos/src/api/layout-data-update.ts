/* eslint-disable no-console */
import type { IGroupMark, ISignal, IView } from '@visactor/vgrammar';

export const runner = (view: IView) => {
  const originData0 = [
    { category: 'A', amount: 28, index: 0 },
    { category: 'B', amount: 55, index: 1 },
    { category: 'C', amount: 43, index: 2 },
    { category: 'D', amount: 91, index: 3 },
    { category: 'E', amount: 81, index: 4 },
    { category: 'F', amount: 53, index: 5 },
    { category: 'G', amount: 19, index: 6 },
    { category: 'H', amount: 87, index: 7 }
  ];
  const originData1 = [{ category: 'A', amount: 28, index: 0 }];

  const data0 = view.data(originData0).id('data0');
  const data1 = view.data(originData1).id('data1');
  const xScale = view
    .scale('band')
    .domain({ data: data0, field: 'category' })
    .range({
      callback: (scale, params) => {
        return [0, params.viewWidth];
      },
      dependency: view.getSignalById('viewWidth') as ISignal
    });
  const yScale = view
    .scale('linear')
    .domain({ data: data0, field: 'amount' })
    .range({
      callback: (scale, params) => {
        return [params.viewHeight, 0];
      },
      dependency: view.getSignalById('viewHeight') as ISignal
    });

  const container = view
    .mark('group', view.rootMark)
    .id('container')
    .layout((...args) => {
      yScale.range([view.viewHeight() / 2, 0]);
      data1.values([
        { category: 'A', amount: 28, index: 0 },
        { category: 'B', amount: 55, index: 1 },
        { category: 'C', amount: 43, index: 2 }
      ]);
    })
    .encode({
      width: 400,
      height: 200
    }) as IGroupMark;
  const scaleBar = view
    .mark('rect', container)
    .join(data0)
    .encode({
      x: { scale: xScale, field: 'category' },
      width: 40,
      y: { scale: yScale, field: 'amount' },
      y1: 0,
      fill: 'lightgreen'
    });
  const dataBar = view
    .mark('rect', container)
    .id('dataBar')
    .join(data1, 'category')
    .encode({
      x: datum => (datum.index + 1) * 50,
      y: {
        callback: (datum: any, el: any, params: any) => {
          return params.viewHeight / 2;
        },
        dependency: 'viewHeight'
      },
      width: 40,
      height: 60,
      fill: 'blue'
    });
};

export const callback = (view: IView) => {
  const data1 = view.getDataById('data1');
  const container = view.getMarkById('container');
  const dataBar = view.getMarkById('dataBar');

  function logStates() {
    console.log(
      ` -- result: ${Array.from(dataBar.elementMap.values()).map(
        element => `${element.getDatum().category}:${element.diffState}`
      )}`
    );
  }

  console.log('First dataflow:');
  console.log(` -- data1: last(null) -> update([A]) -> layout([A, B, C])`);
  console.log(` -- expect state: last(null) -> update([A:enter]) -> layout([A:enter, B:enter, C:enter])`);
  setTimeout(() => {
    logStates();
  }, 500);

  const triggerButton = document.createElement('button');
  triggerButton.innerText = 'trigger';
  document.getElementById('footer')?.appendChild(triggerButton);
  triggerButton.addEventListener('click', () => {
    data1.values([
      // { category: 'B', amount: 55, index: 1 },
      { category: 'C', amount: 43, index: 2 },
      { category: 'D', amount: 91, index: 3 },
      { category: 'E', amount: 81, index: 4 }
    ]);
    container.layout(() => {
      data1.values([
        { category: 'B', amount: 55, index: 1 },
        // { category: 'C', amount: 43, index: 2 },
        { category: 'D', amount: 91, index: 3 },
        // { category: 'E', amount: 81, index: 4 },
        { category: 'F', amount: 53, index: 5 }
      ]);
    });
    view.updateLayoutTag();
    view.run();

    console.log('Trigger dataflow:');
    console.log(` -- data1: last([A, B, C]) -> update([C, D, E]) -> layout([B, D, F])`);
    console.log(
      // eslint-disable-next-line
      ` -- expect state: last([A:enter, B:enter, C:enter]) -> update([A:exit, B:exit, C:update, D:enter, E:enter]) -> layout([A:exit, B:update, C:exit, D:enter, F:enter])`
    );
    setTimeout(() => {
      logStates();
    }, 500);
  });

  const logButton = document.createElement('button');
  logButton.innerText = 'log states';
  document.getElementById('footer')?.appendChild(logButton);
  logButton.addEventListener('click', () => {
    logStates();
  });
};
