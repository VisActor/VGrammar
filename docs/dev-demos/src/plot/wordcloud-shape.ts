/* eslint-disable no-console */
import { type IView, type IPlot, getPalette } from '@visactor/vgrammar';
import data from '../data/wordcloud/fewData.json';
import { registerWordCloudShapeTransforms } from '@visactor/vgrammar-wordcloud-shape';

registerWordCloudShapeTransforms();


export const runner = (plot: IPlot) => {
  // plot.coordinate('polar', { transpose: false })

  plot.wordcloudShape()
    .data(data, [{
      type: 'wordcloudShape',
      shape: `${window.location.origin}/src/image/shape_logo.png`,
    }])
    .encode('text', 'challenge_name')
    .encode('color', 'challenge_name')
    .scale('color', { range: getPalette() });
};

export const callback = (view: IView) => {
  // do nothing
};
