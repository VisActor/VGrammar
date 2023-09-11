/* eslint-disable no-console */
import type { IView } from '@visactor/vgrammar-simple';
import { category10 } from '../color-utils';

export const runner = (view: IView) => {
  const discreteColorScale = view.scale('ordinal').domain(['A', 'B', 'C', 'D']).range(category10);
  const linearColorScale = view.scale('linear').domain([0, 100]).range([category10[0], category10[1], category10[2]]);
  const linearSizeScale = view.scale('linear').domain([50, 80]).range([12, 32]);

  const verticalDiscreteLegend = view
    .legend(view.rootMark)
    .id('verticalDiscreteLegend')
    .scale(discreteColorScale)
    .encode({ x: 20, y: 20 });
  const horizontalDiscreteLegend = view
    .legend(view.rootMark)
    .id('horizontalDiscreteLegend')
    .scale(discreteColorScale)
    .encode({ layout: 'horizontal', x: 20, y: 180 });
  const colorLegend = view.legend(view.rootMark).id('colorLegend').scale(linearColorScale).encode({ x: 100, y: 20 });
  const sizeLegend = view.legend(view.rootMark).id('sizeLegend').scale(linearSizeScale).encode({ x: 100, y: 100 });
};

export const callback = (view: IView) => {
  // do nothing
};
