import { registerTransform } from '@visactor/vgrammar';

import { transform } from './wordcloud-shape';

export { WORDCLOUD_SHAPE_HOOK_EVENT } from './util';

export const registerWordCloudShapeTransforms = () => {
  registerTransform('wordcloudShape', { transform, markPhase: 'beforeJoin' }, true);
};
