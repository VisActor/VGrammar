import type { IView } from '@visactor/vgrammar';
/* eslint-disable no-console */
import { category20 } from '../color-utils';

const originData = [
  {
    id: 'AAA',
    value: 4,
  },
  {
    id: 'BBB',
    value: 6,
  },
  {
    id: 'CCC',
    value: 10,
  },
  {
    id: 'DDD',
    value: 3,
  }
];

export const runner = (view: IView) => {
  const data = view.data(originData);
  const colorScale = view.scale('ordinal').domain({ data: data, field: 'id' }).range(category20);
  const markData = view.data().source(data).transform([        {
    type: 'pie',
    field: 'value',
    asStartAngle: 'startAngle',
    asEndAngle: 'endAngle'
  }]);

  const rightLegend = view
    .legend(view.rootMark)
    .id('rightLegend')
    .scale(colorScale)
    .target(markData, 'id')
    .encode({ x: 340, y: 60 });

  const container = view.group(view.rootMark).encode({ x: 0, y: 0, width: 200, height: 200});

  const arc = view
    .mark('arc', container)
    .id('pie')
    .join(markData, 'id')
    .encode({
      fill: { scale: colorScale, field: 'id' },
      x: 100,
      y: 100,
      startAngle: { field: 'startAngle' },
      endAngle: { field: 'endAngle' },
      // innerRadius: 20,
      innerRadius: 0,
      outerRadius: 80,
      fillOpacity: 1
    })
    .encodeState('hover', {
      outerRadius: 100,
      fillOpacity: 0.5
    });
  
  const label = view
    .label(container)
    .id('label')
    .target(arc)
    .labelStyle({
      // textStyle: {
      //   fillColor: '#666'
      // }
    })
    .encode({
      // fill: '#000',
      text: (datum: any) => `${datum.id}`
    });
};

export const callback = (chartInstance: any) => {
  // do nothing
};
