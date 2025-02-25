/* eslint-disable no-console */
import { type IView, type IPlot, ThemeManager } from '@visactor/vgrammar';
import data from '../data/wordcloud/fewData.json';
import { registerWordCloudShapeTransforms } from '@visactor/vgrammar-wordcloud-shape';

registerWordCloudShapeTransforms();


export const runner = (plot: IPlot) => {
  // plot.coordinate('polar', { transpose: false })

  plot.wordcloudShape()
    .data(data)
    .transform([{
      type: 'wordcloudShape',
      // shape: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg',
  shape: `https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_logo.png`,
    }])
    .encode('text', 'challenge_name')
    .encode('color', 'challenge_name')
    .scale('color', { range: ThemeManager.getDefaultTheme().palette?.default });
};

export const callback = (view: IView) => {
  // do nothing
};
