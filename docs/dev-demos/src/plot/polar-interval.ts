/* eslint-disable no-console */
import type { IView, IPlot } from '@visactor/vgrammar';

const originData = [
  { category: 'A', amount: 2328, index: 0, type: 'A' },
  { category: 'B', amount: 3455, index: 1, type: 'A' },
  { category: 'C', amount: 3443, index: 2, type: 'A' },
  { category: 'D', amount: 3491, index: 3, type: 'A' },
  { category: 'E', amount: 2181, index: 4, type: 'A' },
  { category: 'F', amount: 5353, index: 5, type: 'A' },
  { category: 'G', amount: 3519, index: 6, type: 'A' },
  { category: 'H', amount: 2387, index: 7, type: 'A' },

  { category: 'A', amount: 3418, index: 0, type: 'B' },
  { category: 'B', amount: 4535, index: 1, type: 'B' },
  { category: 'C', amount: 6323, index: 2, type: 'B' },
  { category: 'D', amount: 4571, index: 3, type: 'B' },
  { category: 'E', amount: 2371, index: 4, type: 'B' },
  { category: 'F', amount: 3433, index: 5, type: 'B' },
  { category: 'G', amount: 2310, index: 6, type: 'B' },
  { category: 'H', amount: 3447, index: 7, type: 'B' }
];

export const runner = (plot: IPlot) => {
  // plot.coordinate('polar', { transpose: false });

  // plot.interval()
  //   .data(originData)
  //   .encode('x', 'category')
  //   .encode('y', 'amount')
  //   .encode('group', 'type')
  //   .axis('x', true)
  //   .axis('y', true)
  //   .legend('group', true, { position: 'top', align: 'middle' })
  //   .slider('y', false)
  //   .datazoom('y', true)
  //   .crosshair('x', true)
  //   .crosshair('y', false)
  //   .label('y', { textStyle: { fill: 'red'} });

  plot.parseSpec({
    coordinate: { type: 'polar',transpose: false  },
    marks: [{
      type: 'interval',
      data: { values: originData },
      encode: {
        x: 'category',
        y: 'amount',
        group: 'type'
      },
      grid: {
        x: true,
        y: { type: 'polygon' }
      },
      title: {
        text: 'This is a title, that may be very long, only for test',
        subtext: 'this is a sub text, which can very very long too, let use just test this kind of case; this is a break line; this is another break line; ',
        // subtextStyle: {
        //   height: 50,
        //   wordBreak: "break-all"
        // }
      },
      axis: {
        x: true,
        y: true,
      },
      legend: { 
        group: { option: true, layout: { position: 'top', align: 'center' } }
      },
      datazoom: {
        y: true
      },
      crosshair: {
        x:true
      },
      label: {
        y: { textStyle: { fill: 'red'} } 
      }
    }]
  })
};

export const callback = (view: IView) => {
  // do nothing
};
