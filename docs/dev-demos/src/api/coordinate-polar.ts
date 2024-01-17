/* eslint-disable no-console */
import type { IView } from '@visactor/vgrammar';

export const runner = (view: IView) => {
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
  const xScale = view.scale('band').id('xScale').domain({ data: data, field: 'category' }).range([50, 350]);
  const yScale = view.scale('linear').id('yScale').domain({ data: data, field: 'amount' }).range([50, 350]);
  const thetaScale = view
    .scale('point')
    .id('thetaScale')
    .domain({ data: data, field: 'category' })
    .range([0, Math.PI * 2]);
  const radiusScale = view.scale('linear').id('radiusScale').domain([0, 100]).range([0, 200]);
  const polar = view.coordinate('polar').id('polar').origin([200, 200]).scale([0.5, 0.5]);

  const group = view.group(view.rootMark).id('container').encode({
    x: 0,
    y: 0,
    width: 400,
    height: 400,
    fillOpacity: 0.2
  });
  const rule = view
    .mark('rule', group)
    .id('rule')
    .join(data)
    .coordinate(polar)
    .encode({
      theta: { scale: thetaScale, field: 'category' },
      r: { scale: radiusScale, field: 'amount' },
      theta1: 0,
      r1: 0,
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      x2: { scale: xScale, field: 'category' },
      y2: 400,
      stroke: 'black',
      lineWidth: 2
    })
    .animation({
      update: {
        type: 'update',
        duration: 2000
      }
    });
  const line = view
    .mark('line', group)
    .id('line')
    .join(data)
    .coordinate(polar)
    .encode({
      theta: { scale: thetaScale, field: 'category' },
      r: { scale: radiusScale, field: 'amount' },
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      lineWidth: 4,
      stroke: 'lightgreen'
    })
    .encodeState('hover', { stroke: 'red', width: 60 })
    .animation({
      update: {
        type: 'update',
        duration: 2000
      }
    });
  const symbol = view
    .mark('symbol', group)
    .id('symbol')
    .join(data)
    .coordinate(polar)
    .encode({
      theta: { scale: thetaScale, field: 'category' },
      r: { scale: radiusScale, field: 'amount' },
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      size: 10,
      stroke: 'black',
      lineWidth: 1,
      fill: 'lightgreen'
    })
    .encodeState('hover', { fill: 'red', width: 60 })
    .animation({
      update: {
        type: 'update',
        duration: 2000
      }
    });
  const text = view
    .mark('text', group)
    .id('text')
    .join(data)
    .coordinate(polar)
    .encode({
      theta: { scale: thetaScale, field: 'category' },
      r: { scale: radiusScale, field: 'amount' },
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      text: { field: 'category' },
      fontSize: 13,
      fill: 'black'
    })
    .animation({
      update: {
        type: 'update',
        duration: 2000
      }
    });
  const area = view
    .mark('area', group)
    .id('area')
    .join(data)
    .coordinate(polar)
    .encode({
      theta: { scale: thetaScale, field: 'category' },
      r: { scale: radiusScale, field: 'amount' },
      theta1: 0,
      r1: 0,
      x: { scale: xScale, field: 'category' },
      y: { scale: yScale, field: 'amount' },
      x2: { scale: xScale, field: 'category' },
      y2: 400,
      fill: 'pink',
      fillOpacity: 0.3
    })
    .animation({
      update: {
        type: 'update',
        duration: 2000
      }
    });
};

export const callback = (view: IView) => {
  const cartesianButton = document.createElement('button');
  cartesianButton.innerText = 'cartesian';
  cartesianButton.style.marginTop = '220px';
  document.getElementById('footer')?.appendChild(cartesianButton);

  const polarButton = document.createElement('button');
  polarButton.innerText = 'polar';
  polarButton.style.marginTop = '220px';
  document.getElementById('footer')?.appendChild(polarButton);

  cartesianButton.addEventListener('click', () => {
    const rule = view.getMarkById('rule');
    const line = view.getMarkById('line');
    const symbol = view.getMarkById('symbol');
    const text = view.getMarkById('text');
    const area = view.getMarkById('area');

    rule.coordinate(undefined);
    line.coordinate(undefined);
    symbol.coordinate(undefined);
    text.coordinate(undefined);
    area.coordinate(undefined);

    view.run();
  });

  polarButton.addEventListener('click', () => {
    const polar = view.getCoordinateById('polar');

    const rule = view.getMarkById('rule');
    const line = view.getMarkById('line');
    const symbol = view.getMarkById('symbol');
    const text = view.getMarkById('text');
    const area = view.getMarkById('area');

    rule.coordinate(polar);
    line.coordinate(polar);
    symbol.coordinate(polar);
    text.coordinate(polar);
    area.coordinate(polar);

    view.run();
  });
};
