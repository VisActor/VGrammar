/* eslint-disable no-console */
import type { View, IGroupMark } from '@visactor/vgrammar';
import { IMark } from '@visactor/vgrammar';

function init(view: View) {
  const originData = [
    { category: 'A', amount: 28, index: 0 },
    { category: 'B', amount: 75, index: 1 },
    { category: 'C', amount: 43, index: 2 }
  ];

  const leftBar = view.mark('rect', view.rootMark).id('leftBar').encode({
    x: 0,
    y: 0,
    width: 50,
    height: 150,
    fill: 'purple'
  });
  const bottomBar = view.mark('rect', view.rootMark).id('bottomBar').encode({
    x: 50,
    y: 150,
    width: 150,
    height: 50,
    fill: 'blue'
  });
  const dataGroup = view.mark('group', view.rootMark).encode({
    x: 50,
    y: 0,
    width: 150,
    height: 150,
    stroke: 'black',
    strokeWidth: 1
  }) as IGroupMark;
  const data = view.data(originData);
  const dataBar = view
    .mark('rect', dataGroup)
    .id('dataBar')
    .join(data)
    .encode({
      x: datum => datum.index * 50 + 10,
      y: datum => ((100 - datum.amount) / 100) * 150,
      width: 30,
      height: datum => (datum.amount / 100) * 150,
      fill: 'lightGreen'
    });
  const dataLabel = view
    .mark('text', dataGroup)
    .id('dataLabel')
    .join(data)
    .encode({
      x: datum => datum.index * 50 + 25,
      y: datum => ((100 - datum.amount) / 100) * 150 - 10,
      text: datum => datum.category,
      textAlign: 'center',
      fontSize: 12,
      fill: 'black'
    });
}

export const runner = (view: View) => {
  init(view);
};

export const callback = (chartInstance: any) => {
  const refreshButton = document.createElement('button');
  refreshButton.innerText = 'refresh';
  document.getElementById('footer')?.appendChild(refreshButton);

  const initButton = document.createElement('button');
  initButton.innerText = 'init';
  document.getElementById('footer')?.appendChild(initButton);

  refreshButton.addEventListener('click', () => {
    chartInstance.refresh();
  });

  initButton.addEventListener('click', () => {
    init(chartInstance);
    chartInstance.runAsync();
  });
};
