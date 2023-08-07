/* eslint-disable no-console */
import { type IView, type IPlot, registerLinkPathGlyph, getPalette } from '@visactor/vgrammar';
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
    .scale('color', { range: getPalette() });
};

export const callback = (view: IView) => {
  // do nothing
};
