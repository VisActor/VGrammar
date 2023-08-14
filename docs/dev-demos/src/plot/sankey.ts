/* eslint-disable no-console */
import { type IView, type IPlot, registerLinkPathGlyph, ThemeManager } from '@visactor/vgrammar';
import data from '../data/hierarchy.json';
import { registerSankeyTransforms } from '@visactor/vgrammar-sankey';

registerSankeyTransforms();
registerLinkPathGlyph();


export const runner = (plot: IPlot) => {
  // plot.coordinate('polar', { transpose: false })

  plot.sankey()
    .data({ nodes: data })
    .encode('node', 'name')
    .encode('color', 'name')
    .scale('color', { range: ThemeManager.getDefaultTheme().palette?.default })
    .label('name', { textStyle: { fill: '#333' }, position: 'left' });
};

export const callback = (view: IView) => {
  // do nothing
};
