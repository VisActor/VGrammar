/* eslint-disable no-console */
import type { IView } from '@visactor/vgrammar';
// eslint-disable-next-line no-duplicate-imports
import { registerBoxplotGlyph, registerBarBoxplotGlyph } from '@visactor/vgrammar';
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
  }
];

registerBoxplotGlyph();
registerBarBoxplotGlyph();

export const runner = (view: IView) => {
  view.resize(400, 600);

  const data = view.data(originData).id('data');
  const pointScale = view.scale('point').domain({ data: data, field: 'x' }).range([20, 180]);
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
    width: 200,
    height: 200,
    lineWidth: 1,
    stroke: '#aaa'
  });
  const group1 = view.group(view.rootMark).encode({
    x: 200,
    y: 0,
    width: 200,
    height: 200,
    lineWidth: 1,
    stroke: '#aaa'
  });
  const group2 = view.group(view.rootMark).encode({
    x: 0,
    y: 200,
    width: 200,
    height: 200,
    lineWidth: 1,
    stroke: '#aaa'
  });
  const group3 = view.group(view.rootMark).encode({
    x: 200,
    y: 200,
    width: 200,
    height: 200,
    lineWidth: 1,
    stroke: '#aaa'
  });
  const group4 = view.group(view.rootMark).encode({
    x: 0,
    y: 400,
    width: 200,
    height: 200,
    lineWidth: 1,
    stroke: '#aaa'
  });
  const group5 = view.group(view.rootMark).encode({
    x: 200,
    y: 400,
    width: 200,
    height: 200,
    lineWidth: 1,
    stroke: '#aaa'
  });

  const boxplot = view
    .glyph('boxplot', group0)
    .id('boxplot')
    .join(data)
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
      update: {
        type: 'update',
        duration: 1000,
      },
      state: {
        duration: 1000
      }
    });
  const barBoxplot = view
    .glyph('barBoxplot', group1)
    .id('barBoxplot')
    .join(data)
    .encode({
      x: { scale: pointScale, field: 'x' },
      max: { scale: linearScale, field: 'y1' },
      q3: { scale: linearScale, field: 'y2' },
      median: { scale: linearScale, field: 'y3' },
      q1: { scale: linearScale, field: 'y4' },
      min: { scale: linearScale, field: 'y5' },
      // width: 30,
      q1q3Width: 30,
      minMaxWidth: 20,
      fill: { scale: colorScale, field: 'x' },
      stroke: 'black',
      lineWidth: 2,
      minMaxFillOpacity: 0.5
    })
    .encodeState('hover', {
      opacity: 0.7
    })
    .animation({
      enter: {
        type: 'barBoxplotScaleIn',
        duration: 2000
      },
      exit: {
        type: 'barBoxplotScaleOut',
        duration: 2000
      },
      update: {
        type: 'update',
        duration: 1000,
      },
      state: {
        duration: 1000
      }
    });

  const horizontalBoxplot = view
    .glyph('boxplot', group2)
    .id('horizontalBoxplot')
    .join(data)
    // .coordinate(coordinate)
    .configureGlyph({ direction: 'horizontal' })
    .encode({
      y: { scale: pointScale, field: 'x' },
      max: { scale: linearScale, field: 'y1' },
      q3: { scale: linearScale, field: 'y2' },
      median: { scale: linearScale, field: 'y3' },
      q1: { scale: linearScale, field: 'y4' },
      min: { scale: linearScale, field: 'y5' },
      // height: 30,
      boxHeight: 30,
      ruleHeight: 20,
      stroke: { scale: colorScale, field: 'x' },
      fill: '#aaa'
    })
    .encodeState('hover', {
      opacity: 0.7
    })
    .animation({
      enter: {
        type: 'boxplotScaleIn',
        options: { direction: 'horizontal' },
        duration: 2000
      },
      exit: {
        type: 'boxplotScaleOut',
        duration: 2000
      },
      update: {
        type: 'update',
        duration: 1000,
      },
      state: {
        duration: 1000
      }
    });
  const horizontalBarBoxplot = view
    .glyph('barBoxplot', group3)
    .id('horizontalBarBoxplot')
    .join(data)
    .configureGlyph({ direction: 'horizontal' })
    .encode({
      y: { scale: pointScale, field: 'x' },
      max: { scale: linearScale, field: 'y1' },
      q3: { scale: linearScale, field: 'y2' },
      median: { scale: linearScale, field: 'y3' },
      q1: { scale: linearScale, field: 'y4' },
      min: { scale: linearScale, field: 'y5' },
      // height: 30,
      q1q3Height: 30,
      minMaxHeight: 20,
      fill: { scale: colorScale, field: 'x' },
      stroke: 'black',
      lineWidth: 2,
      minMaxFillOpacity: 0.5
    })
    .encodeState('hover', {
      opacity: 0.7
    })
    .animation({
      enter: {
        type: 'barBoxplotScaleIn',
        duration: 2000
      },
      exit: {
        type: 'barBoxplotScaleOut',
        duration: 2000
      },
      update: {
        type: 'update',
        duration: 1000,
      },
      state: {
        duration: 1000
      }
    });

  const polarBoxplot = view
    .glyph('boxplot', group4)
    .id('polarBoxplot')
    .join(data)
    .configureGlyph({ direction: 'horizontal' })
    .encode({
      y: 100,
      max: { scale: polarLinearScale, field: 'y1' },
      q3: { scale: polarLinearScale, field: 'y2' },
      median: { scale: polarLinearScale, field: 'y3' },
      q1: { scale: polarLinearScale, field: 'y4' },
      min: { scale: polarLinearScale, field: 'y5' },
      // height: 30,
      boxHeight: 20,
      ruleHeight: 10,
      stroke: { scale: colorScale, field: 'x' },
      fill: '#aaa',
      angle: { scale: angleScale, field: 'x' },
      anchor: [100, 100]
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
      update: {
        type: 'update',
        duration: 1000,
      },
      state: {
        duration: 1000
      }
    });
  const polarBarBoxplot = view
    .glyph('barBoxplot', group5)
    .id('polarBarBoxplot')
    .join(data)
    .configureGlyph({ direction: 'horizontal' })
    .encode({
      y: 100,
      max: { scale: polarLinearScale, field: 'y1' },
      q3: { scale: polarLinearScale, field: 'y2' },
      median: { scale: polarLinearScale, field: 'y3' },
      q1: { scale: polarLinearScale, field: 'y4' },
      min: { scale: polarLinearScale, field: 'y5' },
      // height: 30,
      q1q3Height: 20,
      minMaxHeight: 10,
      fill: { scale: colorScale, field: 'x' },
      stroke: 'black',
      lineWidth: 2,
      minMaxFillOpacity: 0.5,
      angle: { scale: angleScale, field: 'x' },
      anchor: [100, 100]
    })
    .encodeState('hover', {
      opacity: 0.7
    })
    .animation({
      enter: {
        type: 'barBoxplotScaleIn',
        duration: 2000
      },
      exit: {
        type: 'barBoxplotScaleOut',
        duration: 2000
      },
      update: {
        type: 'update',
        duration: 1000,
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

  const updateButton = document.createElement('button');
  updateButton.innerText = 'update data';
  updateButton.style.marginTop = '220px';
  document.getElementById('footer')?.appendChild(updateButton);

  exitButton.addEventListener('click', () => {
    view.getDataById('data')?.values([]);
    view.runAsync();
  });
  enterButton.addEventListener('click', () => {
    view.getDataById('data')?.values(originData);
    view.runAsync();
  });
  updateButton.addEventListener('click', () => {
    view.getDataById('data')?.values([
      {
        x: '0',
        y1: 1500,
        y2: 1100,
        y3: 600,
        y4: 500,
        y5: 300
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
      }
    ]);
    view.runAsync();
  });
};
