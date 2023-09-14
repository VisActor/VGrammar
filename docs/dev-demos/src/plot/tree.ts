/* eslint-disable no-console */
import { type IView, type IPlot, registerTreePathGlyph, ThemeManager } from '@visactor/vgrammar';
import data from '../data/coffee.json';
import { registerTreeTransforms } from '@visactor/vgrammar-hierarchy';

registerTreeTransforms();
registerTreePathGlyph()


export const runner = (plot: IPlot) => {
  // plot.coordinate('polar', { transpose: false })

  plot.tree()
    .data({ children: data, itemStyle: { color: '#000' } })
    .encode('color', 'name')
    .scale('color', { range: ThemeManager.getDefaultTheme().palette?.default })
    .label('name', { textStyle: { fill: '#333' } });
};

export const callback = (view: IView) => {
  // do nothing
};
