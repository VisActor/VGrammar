/* eslint-disable no-console */
import type { View, IGroupMark, IMark } from '@visactor/vgrammar-simple';

export const runner = (view: View) => {
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
};

export const callback = (chartInstance: any) => {
  const runButton = document.createElement('button');
  runButton.innerText = 'run';
  document.getElementById('footer')?.appendChild(runButton);

  chartInstance.addListener('allAnimationStart', () => console.log('allAnimationStart'));
  chartInstance.addListener('allAnimationEnd', () => console.log('allAnimationEnd'));

  runButton.addEventListener('click', () => {
    const leftBar = chartInstance.getMarkById('leftBar') as IMark;
    const bottomBar = chartInstance.getMarkById('bottomBar') as IMark;
    const dataBar = chartInstance.getMarkById('dataBar') as IMark;
    const dataLabel = chartInstance.getMarkById('dataLabel') as IMark;

    const a0 = leftBar.animate.run({
      type: 'growHeightIn',
      duration: 2000,
      easing: 'linear',
      options: { orient: 'negative' }
    });
    const a1 = bottomBar.animate
      .run({
        type: 'growWidthIn',
        duration: 1000,
        easing: 'linear'
      })
      .parallel(a0);
    const a2 = dataBar.animate
      .run({
        type: 'fadeIn',
        duration: 2000,
        easing: 'linear'
      })
      .after(a1);
    const a3 = dataLabel.animate
      .run({
        type: 'moveIn',
        duration: 2000,
        easing: 'linear',
        options: { direction: 'y' }
      })
      .parallel(a2);
  });
};
