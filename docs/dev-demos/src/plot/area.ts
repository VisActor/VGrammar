/* eslint-disable no-console */
import type { IView, IPlot } from '@visactor/vgrammar';

const data = [
  { year: 1700, exports: 35, imports: 70 },
  { year: 1710, exports: 59, imports: 81 },
  { year: 1720, exports: 76, imports: 96 },
  { year: 1730, exports: 65, imports: 97 },
  { year: 1740, exports: 67, imports: 93 },
  { year: 1750, exports: 79, imports: 90 },
  { year: 1753, exports: 87, imports: 87 },
  { year: 1760, exports: 115, imports: 79 },
  { year: 1770, exports: 163, imports: 85 },
  { year: 1780, exports: 185, imports: 93 }
];

export const runner = (plot: IPlot) => {
  // plot.coordinate('polar', { transpose: false })

  plot.area()
    .data(data)
    .encode('x', 'year')
    .encode('y', 'exports' || ['exports', 'imports'])
    .axis('x', { tickCount: 5 })
    .axis('y', true)
    .legend('customized', {
      items: [
        {
          label: '测试一下',
          shape: {
            fill: 'red',
            symbolType: 'circle',
          },
        }
      ] 
    }, { 
      position: 'top', 
      align: 'center', 
    })
    .style({ 'fillOpacity': 0.3})
    .tooltip({
      staticTitle: 'test',
      staticContentKey: ['exports', 'imports']
    });
};

export const callback = (view: IView) => {
  // do nothing
};
