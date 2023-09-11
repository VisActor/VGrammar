/* eslint-disable no-console */
import { type IView, type IPlot, ThemeManager } from '@visactor/vgrammar-simple';
import data from '../data/coffee.json';
import { registerSunburstTransforms } from '@visactor/vgrammar-hierarchy';

registerSunburstTransforms();


export const runner = (plot: IPlot) => {
  // plot.coordinate('polar', { transpose: false })

  plot.sunburst()
    .data(data, [{
      type: 'sunburst',
      innerRadius: '15%',
      outerRadius: ['35%', '70%', '72%', '80%'],
      label: [
        {
          align: 'center',
          rotate: 'tangential'
        },
        { rotate: 'radial', align: 'end' },
        { rotate: 'radial', align: 'start', offset: 10 }
      ]
    }])
    .encode('color', 'itemStyle.color')
    .scale('color', { range: ThemeManager.getDefaultTheme().palette?.default })
    .label('name', { textStyle: { fill: '#333' } });
};

export const callback = (view: IView) => {
  // do nothing
};
