/* eslint-disable no-console */
import type { IView } from '@visactor/vgrammar';
// eslint-disable-next-line no-duplicate-imports
import { registerViolinGlyph } from '@visactor/vgrammar';
import { category20 } from '../color-utils';

const originData = [
  {
    x: '0',
    y1: 1600,
    y2: 1200,
    y3: 800,
    y4: 600,
    y5: 500,
    density: [
      [0, 0],
      [100, 0.00005],
      [200, 0.0001],
      [300, 0.0001],
      [400, 0.0002],
      [500, 0.0003],
      [600, 0.0007],
      [700, 0.0008],
      [800, 0.0009],
      [900, 0.0008],
      [1000, 0.0008],
      [1200, 0.0006],
      [1300, 0.0005],
      [1400, 0.0004],
      [1500, 0.0003],
      [1600, 0.0003],
      [1700, 0.0002],
      [1800, 0.0001],
      [1900, 0.00005],
      [2000, 0]
    ],
  },
  {
    x: '1',
    y1: 1900,
    // y2: 1000,
    y3: 400,
    y4: 300,
    y5: 100,
    density: [
      [-100, 0],
      [0, 0.0001],
      [100, 0.0002],
      [200, 0.0004],
      [300, 0.0006],
      [400, 0.0008],
      [500, 0.0007],
      [600, 0.0007],
      [700, 0.0006],
      [800, 0.0006],
      [900, 0.0005],
      [1000, 0.0005],
      [1200, 0.0004],
      [1300, 0.0003],
      [1400, 0.0002],
      [1500, 0.0002],
      [1600, 0.0003],
      [1700, 0.0004],
      [1800, 0.0003],
      [1900, 0.0002],
      [2000, 0.0001],
      [2100, 0]
    ],
  },
  {
    x: '2',
    y1: 1300,
    y2: 1200,
    // y3: 200,
    y4: -100,
    y5: -500,
    density: [
      [-500, 0],
      [-400, 0.0001],
      [-300, 0.0002],
      [-200, 0.0004],
      [-100, 0.0008],
      [0, 0.0007],
      [100, 0.0003],
      [200, 0.0004],
      [300, 0.0003],
      [400, 0.0003],
      [500, 0.0003],
      [600, 0.0002],
      [700, 0.0002],
      [800, 0.0003],
      [900, 0.0004],
      [1000, 0.0002],
      [1200, 0.0003],
      [1300, 0.0004],
      [1400, 0.0005],
      [1500, 0.0006],
      [1600, 0.0003],
      [1700, 0.0002],
      [1800, 0.0001],
      [1900, 0.0001],
      [2000, 0]
    ],
  },
  {
    x: '3',
    // y1: 1400,
    y2: 1000,
    y3: 900,
    y4: 800,
    y5: 500,
    density: [
      [0, 0],
      [100, 0],
      [200, 0],
      [300, 0.0001],
      [400, 0.0001],
      [500, 0.0002],
      [600, 0.0003],
      [700, 0.0007],
      [800, 0.0006],
      [900, 0.0006],
      [1000, 0.0002],
      [1200, 0.0001],
      [1300, 0]
    ],
  }
];

registerViolinGlyph();

export const runner = (view: IView) => {
  view.resize(400, 600);

  const data = view.data(originData).id('data');
  const pointScale = view.scale('point').domain({ data: data, field: 'x' }).range([80, 320]);
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
    width: 400,
    height: 200,
    lineWidth: 1,
    stroke: '#aaa'
  });
  const group2 = view.group(view.rootMark).encode({
    x: 0,
    y: 200,
    width: 400,
    height: 400,
    lineWidth: 1,
    stroke: '#aaa'
  });

  const violin = view
    .glyph('violin', group0)
    .id('boxplot')
    .join(data)
    .encode({
      x: { scale: pointScale, field: 'x' },
      max: { scale: linearScale, field: 'y1' },
      q3: { scale: linearScale, field: 'y2' },
      median: { scale: linearScale, field: 'y3' },
      q1: { scale: linearScale, field: 'y4' },
      min: { scale: linearScale, field: 'y5' },
      density: { scale: linearScale, field: 'density' },
      densitySize: 20,
      width: 10,
      size: 6,
      opacity: 1
    })
    .encodeState('hover', {
      opacity: 0.7
    })
    .animation({
      enter: {
        type: 'fadeIn',
        duration: 1000
      },
      exit: {
        type: 'fadeOut',
        duration: 1000
      },
      state: {
        duration: 1000
      }
    });

  const horizontalViolin = view
    .glyph('violin', group2)
    .id('horizontalViolin')
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
      density: { scale: linearScale, field: 'density' },
      height: 10,
      size: 6,
      opacity: 1
    })
    .encodeState('hover', {
      opacity: 0.7
    })
    .animation({
      enter: {
        type: 'fadeIn',
        duration: 1000
      },
      exit: {
        type: 'fadeOut',
        duration: 1000
      },
      state: {
        duration: 1000
      }
    });
};

export const callback = (view: IView) => {
  // const exitButton = document.createElement('button');
  // exitButton.innerText = 'exit data';
  // exitButton.style.marginTop = '220px';
  // document.getElementById('footer')?.appendChild(exitButton);

  // const enterButton = document.createElement('button');
  // enterButton.innerText = 'enter data';
  // enterButton.style.marginTop = '220px';
  // document.getElementById('footer')?.appendChild(enterButton);

  // exitButton.addEventListener('click', () => {
  //   view.getDataById('data')?.values([]);
  //   view.runAsync();
  // });
  // enterButton.addEventListener('click', () => {
  //   view.getDataById('data')?.values(originData);
  //   view.runAsync();
  // });
};
