/* eslint-disable no-console */
import { type IView, type IPlot, ThemeManager } from '@visactor/vgrammar';
import data from '../data/hierarchy.json';
import { registerCirclePackingTransforms } from '@visactor/vgrammar-hierarchy';

registerCirclePackingTransforms();


export const runner = (plot: IPlot) => {
  // plot.coordinate('polar', { transpose: false })

  plot.circlePacking()
    .data(data, [{
      type: 'circlePacking',
      padding: [4],
      gapWidth: [8, 4, 2],
      maxDepth: 1
    }])
    .encode('color', 'name')
    .scale('color', { range: ThemeManager.getDefaultTheme().palette?.default })
    .label('name', { textStyle: { fill: '#333' }, position: 'center', overlap: false });
};

export const callback = (view: IView) => {
  // do nothing
};
