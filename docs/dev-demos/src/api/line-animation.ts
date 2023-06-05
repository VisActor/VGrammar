/* eslint-disable no-console */
import { TagPointsUpdate } from '@visactor/vrender';
import type { IView } from '@visactor/vgrammar';

const originData = [
  { category: 'A', amount: 28, index: 0 },
  { category: 'B', amount: 55, index: 1 },
  { category: 'C', amount: 43, index: 2 },
  { category: 'D', amount: 91, index: 3 },
  { category: 'E', amount: 81, index: 4 },
  { category: 'F', amount: 53, index: 5 },
  { category: 'G', amount: 19, index: 6 },
  { category: 'H', amount: 87, index: 7 },
  { category: 'I', amount: 21, index: 8 },
  { category: 'J', amount: 46, index: 9 }
];

export const runner = (view: IView) => {
  const data = view.data(originData).id('data');
  const xScale = view.scale('point').domain({ data: data, field: 'category' }).range([50, 350]);
  const yScale = view.scale('linear').domain([0, 100]).range([50, 350]);
  const line = view
    .mark('line', view.rootMark)
    .id('line')
    .join(data, 'category')
    .encode({
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      // stroke: 'pink',
      stroke: (datum, element) => (element.data.length > 10 ? 'red' : 'pink'),
      lineWidth: 2
    })
    .animation({
      enter: {
        type: 'clipIn',
        duration: 1000,
        easing: 'linear'
      },
      exit: {
        type: 'clipOut',
        duration: 1000,
        easing: 'linear'
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
      ]
    });
  // line.animate.disableAnimationState('enter');
  const symbol = view
    .mark('symbol', view.rootMark)
    .join(data, 'category')
    .encode({
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      y1: { signal: view.getSignalById('viewHeight') },
      fill: 'blue',
      size: 12
    })
    .animation({
      enter: {
        type: 'fadeIn',
        duration: 1000,
        easing: 'linear'
      },
      exit: {
        type: 'fadeOut',
        duration: 1000,
        easing: 'linear'
      },
      update: {
        type: 'update',
        duration: 1000,
        easing: 'linear'
      }
    });
  const refLine = view.mark('rule', view.rootMark).id('refLine').encode({
    x: 50,
    x1: 350,
    y: 350,
    y1: 350,
    stroke: 'purple',
    lineWidth: 2
  });
};

export const callback = (view: IView) => {
  const updateButton0 = document.createElement('button');
  updateButton0.innerText = 'push data';
  document.getElementById('footer')?.appendChild(updateButton0);

  const updateButton1 = document.createElement('button');
  updateButton1.innerText = 'unshift data';
  document.getElementById('footer')?.appendChild(updateButton1);

  const updateButton2 = document.createElement('button');
  updateButton2.innerText = 'pop data';
  document.getElementById('footer')?.appendChild(updateButton2);

  const updateButton3 = document.createElement('button');
  updateButton3.innerText = 'shift data';
  document.getElementById('footer')?.appendChild(updateButton3);

  const updateButton4 = document.createElement('button');
  updateButton4.innerText = 'unshift & push data';
  document.getElementById('footer')?.appendChild(updateButton4);

  const updateButton5 = document.createElement('button');
  updateButton5.innerText = 'shift & pop data';
  document.getElementById('footer')?.appendChild(updateButton5);

  const updateButton6 = document.createElement('button');
  updateButton6.innerText = 'all new data';
  document.getElementById('footer')?.appendChild(updateButton6);

  const restoreButton = document.createElement('button');
  restoreButton.innerText = 'restore data';
  document.getElementById('footer')?.appendChild(restoreButton);

  const clipXButton = document.createElement('button');
  clipXButton.innerText = 'clip x';
  document.getElementById('footer')?.appendChild(clipXButton);

  updateButton0.addEventListener('click', () => {
    // push
    const data = originData.slice();
    data.push({ category: 'K', amount: 37, index: 10 });
    data.push({ category: 'L', amount: 12, index: 11 });
    data.push({ category: 'M', amount: 59, index: 12 });
    view.getDataById('data')?.values(data);
    view.runAsync();
  });
  updateButton1.addEventListener('click', () => {
    // unshift
    const data = originData.slice();
    data.unshift({ category: 'Z', amount: 59, index: -1 });
    data.unshift({ category: 'Y', amount: 12, index: -2 });
    data.unshift({ category: 'X', amount: 37, index: -3 });
    view.getDataById('data')?.values(data);
    view.runAsync();
  });
  updateButton2.addEventListener('click', () => {
    // pop
    const data = originData.slice();
    data.pop();
    data.pop();
    data.pop();
    view.getDataById('data')?.values(data);
    view.runAsync();
  });
  updateButton3.addEventListener('click', () => {
    // shift
    const data = originData.slice();
    data.shift();
    data.shift();
    data.shift();
    view.getDataById('data')?.values(data);
    view.runAsync();
  });
  updateButton4.addEventListener('click', () => {
    // unshift & push
    const data = originData.slice();
    data.unshift({ category: 'Z', amount: 59, index: -1 });
    data.unshift({ category: 'Y', amount: 12, index: -2 });
    data.unshift({ category: 'X', amount: 37, index: -3 });
    data.push({ category: 'K', amount: 37, index: 10 });
    data.push({ category: 'L', amount: 12, index: 11 });
    data.push({ category: 'M', amount: 59, index: 12 });
    view.getDataById('data')?.values(data);
    view.runAsync();
  });
  updateButton5.addEventListener('click', () => {
    // shift & pop
    const data = originData.slice();
    data.shift();
    data.shift();
    data.shift();
    data.pop();
    data.pop();
    data.pop();
    view.getDataById('data')?.values(data);
    view.runAsync();
  });
  updateButton6.addEventListener('click', () => {
    // all new data
    const data = [
      { category: 'A-1', amount: 42, index: 0 },
      { category: 'B-1', amount: 80, index: 1 },
      { category: 'C-1', amount: 51, index: 2 },
      { category: 'D-1', amount: 27, index: 3 },
      { category: 'E-1', amount: 63, index: 4 },
      { category: 'F-1', amount: 27, index: 5 },
      { category: 'G-1', amount: 15, index: 6 },
      { category: 'H-1', amount: 30, index: 7 },
      { category: 'I-1', amount: 53, index: 8 },
      { category: 'J-1', amount: 37, index: 9 }
    ];
    view.getDataById('data')?.values(data);
    view.runAsync();
  });
  restoreButton.addEventListener('click', () => {
    view.getDataById('data')?.values(originData.slice());
    view.runAsync();
  });
  clipXButton.addEventListener('click', () => {
    view.getMarkById('line')?.animate.run({
      type: 'clipIn',
      options: { clipDimension: 'x' },
      duration: 10000,
      easing: 'linear'
    });
    view.getMarkById('refLine')?.animate.run({
      type: 'clipIn',
      duration: 10000,
      easing: 'linear'
    });
  });
};
