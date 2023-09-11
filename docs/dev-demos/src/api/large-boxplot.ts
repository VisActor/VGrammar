/* eslint-disable no-console */
import type { IView } from '@visactor/vgrammar-simple';
// eslint-disable-next-line no-duplicate-imports
import { registerBoxplotGlyph, registerBarBoxplotGlyph } from '@visactor/vgrammar-simple';
import { category20 } from '../color-utils';

const originData = [
  {
    x: '0',
    y1: 1600,
    y2: 1200,
    y3: 800,
    y4: 700,
    y5: 500
  },
  {
    x: '1',
    y1: 1900,
    // y2: 1000,
    y3: 400,
    y4: 300,
    y5: 100
  },
  {
    x: '2',
    y1: 1300,
    y2: 1200,
    // y3: 200,
    y4: -100,
    y5: -500
  },
  {
    x: '3',
    // y1: 1400,
    y2: 1000,
    y3: 900,
    y4: 800,
    y5: 500
  },
  {
    x: '4',
    // y1: 1400,
    y2: 1000,
    y3: 900,
    y4: 800,
    y5: 500
  },
  {
    x: '5',
    // y1: 1400,
    y2: 1000,
    y3: 900,
    y4: 800,
    y5: 500
  },
  {
    x: '6',
    // y1: 1400,
    y2: 1000,
    y3: 900,
    y4: 800,
    y5: 500
  },
  {
    x: '7',
    // y1: 1400,
    y2: 1000,
    y3: 900,
    y4: 800,
    y5: 500
  },
  {
    x: '8',
    // y1: 1400,
    y2: 1000,
    y3: 900,
    y4: 800,
    y5: 500
  },
  {
    x: '9',
    // y1: 1400,
    y2: 1000,
    y3: 900,
    y4: 800,
    y5: 500
  },
  {
    x: '10',
    // y1: 1400,
    y2: 1000,
    y3: 900,
    y4: 800,
    y5: 500
  }
];

registerBoxplotGlyph();
registerBarBoxplotGlyph();

export const runner = (view: IView) => {
  view.resize(1000, 400);

  const data = view.data(originData).name('data');
  const pointScale = view.scale('point').domain({ data: data, field: 'x' }).range([20, 980]);
  const linearScale = view.scale('linear').domain([-500, 2000]).range([180, 20]);
  const angleScale = view
    .scale('point')
    .domain({ data: data, field: 'x' })
    .range([0, Math.PI * 2])
    .configure({
      padding: 0.5
    });
  const polarLinearScale = view.scale('linear').domain([-500, 2000]).range([190, 110]);
  const colorScale = view.scale('ordinal').domain({ data: data, field: 'x' }).range(category20);
  // const coordinate = view
  //   .coordinate('cartesian')
  //   .translate([0, -200])
  //   .rotate(Math.PI / 2);
  const group0 = view.group(view.rootMark).encode({
    x: 0,
    y: 0,
    width: 1000,
    height: 400,
    lineWidth: 1,
    stroke: '#aaa'
  });

  const boxplot = view
    .glyph('boxplot', group0)
    .name('boxplot')
    .join(data)
    .configure({
      progressiveStep: 2,
      progressiveThreshold: 4
    })
    .encode({
      x: { scale: pointScale, field: 'x' },
      max: { scale: linearScale, field: 'y1' },
      q3: { scale: linearScale, field: 'y2' },
      median: { scale: linearScale, field: 'y3' },
      q1: { scale: linearScale, field: 'y4' },
      min: { scale: linearScale, field: 'y5' },
       // width: 30,
      boxWidth: 30,
      ruleWidth: 20,
      stroke: { scale: colorScale, field: 'x' },
      fill: '#aaa',
      opacity: 1
    })
    .encodeState('hover', {
      opacity: 0.7
    })
    .animation({
      enter: {
        type: 'boxplotScaleIn',
        duration: 2000
      },
      exit: {
        type: 'boxplotScaleOut',
        duration: 2000
      },
      state: {
        duration: 1000
      }
    });
};

export const callback = (view: IView) => {
  // do nothing
  const exitButton = document.createElement('button');
  exitButton.innerText = 'exit data';
  exitButton.style.marginTop = '220px';
  document.getElementById('footer')?.appendChild(exitButton);

  const enterButton = document.createElement('button');
  enterButton.innerText = 'enter data';
  enterButton.style.marginTop = '220px';
  document.getElementById('footer')?.appendChild(enterButton);

  exitButton.addEventListener('click', () => {
    view.lookupData('data')?.values([]);
    view.runAsync();
  });
  enterButton.addEventListener('click', () => {
    view.lookupData('data')?.values(originData);
    view.runAsync();
  });
};
