/* eslint-disable no-console */
import type { IGrammarBase, IView } from '@visactor/vgrammar';

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
  const bar = view.mark('rect', view.rootMark).id('bar');

  const data = view.data(originData).id('data');

  const xScale = view.scale('band').id('xScale');
  const yScale = view.scale('linear').id('yScale');

  bar
    .join(data)
    .encode({
      x: { scale: xScale, field: 'category' },
      width: 10,
      y: { scale: yScale, field: 'amount' },
      y1: { signal: view.getSignalById('viewHeight') },
      fill: 'lightgreen'
    })
    .encodeState('hover', { fill: 'red', width: 20 })
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
      }
    });

  const customWidth = view.signal(200).id('customWidth');
  const customHeight = view.signal(200).id('customHeight');

  xScale.domain({ data: data, field: 'category' }).range({
    callback: (scale, params) => {
      return [0, customWidth.output()];
    },
    dependency: customWidth
  });
  yScale.domain({ data: data, field: 'amount' }).range({
    callback: (scale, params) => {
      return [customHeight.output(), 0];
    },
    dependency: customHeight
  });

  console.log(`
  API order:
      1. bar -> data & xScale & yScale
      2. data
      3. xScale -> customWidth
      4. yScale -> customHeight
      5. customWidth
      6. customHeight
  `);
};

export const callback = (view: IView) => {
  const logButton = document.createElement('button');
  logButton.innerText = 'log rank';
  document.getElementById('footer')?.appendChild(logButton);

  logButton.addEventListener('click', () => {
    console.log('    Grammar rank:');
    view.grammars.traverse(grammar => {
      console.log(`      ${grammar.id}: ${grammar.rank}`);
    });
  });
};
