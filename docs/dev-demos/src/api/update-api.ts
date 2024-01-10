/* eslint-disable no-console */
import type { ISignal, IView } from '@visactor/vgrammar';

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

const nextData = [
  { category: 'C', amount: 43, index: 2 },
  { category: 'D', amount: 91, index: 3 },
  { category: 'E', amount: 81, index: 4 },
  { category: 'F', amount: 53, index: 5 },
  { category: 'G', amount: 19, index: 6 },
  { category: 'H', amount: 87, index: 7 },
  { category: 'I', amount: 34, index: 8 }
];

const getMultiPointsData = () => {
  const categories = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  return categories.reduce((data, category) => {
    return data.concat(
      new Array(10).fill(0).map((v, i) => {
        return {
          category,
          key: Math.round(Math.random() * 100),
          value: Math.round(Math.random() * 100),
          index: `${category}-${i}`
        };
      })
    );
  }, [] as any[]);
};

const originExample = (view: IView) => {
  const data = view.data(originData).id('data');
  const xScale = view
    .scale('band')
    .id('xScale')
    .domain({ data: data, field: 'category' })
    .range({
      callback: (scale, params) => {
        return [0, params.viewWidth];
      },
      dependency: view.getSignalById('viewWidth') as ISignal<number>
    });
  const yScale = view
    .scale('linear')
    .id('yScale')
    .domain({ data: data, field: 'amount' })
    .range({
      callback: (scale, params) => {
        return [params.viewHeight, 0];
      },
      dependency: view.getSignalById('viewHeight') as ISignal<number>
    });
  const container = view.group(view.rootMark);
  const bar = view
    .mark('rect', container)
    .id('bar')
    .configure({
      morph: true,
      morphKey: 'MORPH'
    })
    .join(data, 'category', undefined, 'category')
    .encode({
      x: { scale: xScale, field: 'category' },
      width: 40,
      y: { scale: yScale, field: 'amount' },
      y1: { signal: view.getSignalById('viewHeight') },
      fill: 'lightgreen'
    })
    .encodeState('hover', { fill: 'red', width: 60 })
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
  const line = view
    .mark('line', container)
    .id('line')
    .join(data, 'category')
    .encode({
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      stroke: 'blue',
      lineWidth: 2
    })
    .animation({
      enter: {
        type: 'growPointsYIn',
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
};

const morphExample = (view: IView) => {
  const data = view.data(originData).id('data');
  const xScale = view
    .scale('band')
    .id('xScale')
    .domain({ data: data, field: 'category' })
    .range({
      callback: (scale, params) => {
        return [0, params.viewWidth];
      },
      dependency: view.getSignalById('viewWidth') as ISignal<number>
    });
  const yScale = view
    .scale('linear')
    .id('yScale')
    .domain({ data: data, field: 'amount' })
    .range({
      callback: (scale, params) => {
        return [params.viewHeight, 0];
      },
      dependency: view.getSignalById('viewHeight') as ISignal<number>
    });
  const container = view.group(view.rootMark);
  const symbol = view
    .mark('symbol', container)
    .id('symbol')
    .configure({
      morph: true,
      morphKey: 'MORPH'
    })
    .join(data, 'category')
    .encode({
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      fill: 'pink',
      size: 12
    })
    .encodeState('hover', { fill: 'red' })
    .animation({
      enter: {
        type: 'fadeIn',
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
};

const multiMorphExample = (view: IView) => {
  const data = view.data(getMultiPointsData()).id('data');
  const xScale = view
    .scale('linear')
    .id('xScale')
    .domain([0, 100])
    .range({
      callback: (scale, params) => {
        return [0, params.viewWidth];
      },
      dependency: view.getSignalById('viewWidth') as ISignal<number>
    });
  const yScale = view
    .scale('linear')
    .id('yScale')
    .domain([0, 100])
    .range({
      callback: (scale, params) => {
        return [params.viewHeight, 0];
      },
      dependency: view.getSignalById('viewHeight') as ISignal<number>
    });
  const container = view.group(view.rootMark);
  const symbol = view
    .mark('symbol', container)
    .id('symbol')
    .configure({
      morph: true,
      morphKey: 'MORPH'
    })
    .join(data, 'index', undefined, 'category')
    .encode({
      x: { scale: xScale, field: 'key' },
      y: { scale: yScale, field: 'value' },
      fill: 'pink',
      size: 12
    })
    .encodeState('hover', { fill: 'red' })
    .animation({
      enter: {
        type: 'fadeIn',
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
};

const reuseExample = (view: IView) => {
  const data = view.data(nextData).id('data');
  const xScale = view
    .scale('band')
    .id('xScale')
    .domain({ data: data, field: 'category' })
    .range({
      callback: (scale, params) => {
        return [0, params.viewWidth];
      },
      dependency: view.getSignalById('viewWidth') as ISignal<number>
    });
  const yScale = view
    .scale('linear')
    .id('yScale')
    .domain({ data: data, field: 'amount' })
    .range({
      callback: (scale, params) => {
        return [params.viewHeight, 0];
      },
      dependency: view.getSignalById('viewHeight') as ISignal<number>
    });
  const container = view.group(view.rootMark);
  const bar = view
    .mark('rect', container)
    .id('bar')
    .configure({
      morph: true,
      morphKey: 'MORPH'
    })
    .join(data, 'category', undefined, 'category')
    .encode({
      x: { scale: xScale, field: 'category' },
      width: 40,
      y: { scale: yScale, field: 'amount' },
      y1: { signal: view.getSignalById('viewHeight') },
      fill: 'lightgreen'
    })
    .encodeState('hover', { fill: 'red', width: 60 })
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
  const symbol = view
    .mark('symbol', container)
    .id('symbol')
    .join(data, 'category')
    .encode({
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      size: 12,
      fill: 'pink'
    })
    .encodeState('hover', { fill: 'red', width: 60 })
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
      }
    });
};

export const runner = (view: IView) => {
  originExample(view);
};

export const callback = (view: IView) => {
  const updateToMorphButton = document.createElement('button');
  updateToMorphButton.innerText = 'update to single morph api';
  document.getElementById('footer')?.appendChild(updateToMorphButton);

  const updateToMultiMorphButton = document.createElement('button');
  updateToMultiMorphButton.innerText = 'update to multi morph api';
  document.getElementById('footer')?.appendChild(updateToMultiMorphButton);

  const updateToReuseButton = document.createElement('button');
  updateToReuseButton.innerText = 'update to reuse api';
  document.getElementById('footer')?.appendChild(updateToReuseButton);

  const updateToOriginButton = document.createElement('button');
  updateToOriginButton.innerText = 'update to origin api';
  document.getElementById('footer')?.appendChild(updateToOriginButton);

  updateToMorphButton.addEventListener('click', () => {
    view.removeAllGrammars();
    morphExample(view);
    view.run({ morph: true, animation: { duration: 1000, easing: 'linear' } });
  });

  updateToMultiMorphButton.addEventListener('click', () => {
    view.removeAllGrammars();
    multiMorphExample(view);
    view.run({ morph: true, animation: { duration: 1000, easing: 'linear' } });
  });

  updateToReuseButton.addEventListener('click', () => {
    view.removeAllGrammars();
    reuseExample(view);
    view.run();
  });

  updateToOriginButton.addEventListener('click', () => {
    view.removeAllGrammars();
    originExample(view);
    view.run({ morph: true, animation: { delay: 500, duration: 1000, easing: 'linear' } });
  });
};
