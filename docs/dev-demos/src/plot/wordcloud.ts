/* eslint-disable no-console */
import { type IView, type IPlot, ThemeManager } from '@visactor/vgrammar-simple';
import data from '../data/wordcloud/social-media.json';
import { registerWordCloudTransforms } from '@visactor/vgrammar-wordcloud'

registerWordCloudTransforms();


export const runner = (plot: IPlot) => {
  // plot.coordinate('polar', { transpose: false })

  plot.wordcloud()
    .data(data)
    .encode('text', 'challenge_name')
    .encode('color', 'challenge_name')
    .scale('color', { range: ThemeManager.getDefaultTheme().palette?.default })
    .transform([{
      type: 'wordcloud',
      shape: 'circle',
    }]);
};

export const callback = (view: IView) => {
  // do nothing
};
