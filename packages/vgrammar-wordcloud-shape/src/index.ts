import { Factory } from '@visactor/vgrammar-core';

import { transform } from './wordcloud-shape';

export { WORDCLOUD_SHAPE_HOOK_EVENT } from './util';

export const registerWordCloudShapeTransforms = () => {
  Factory.registerTransform('wordcloudShape', { transform, markPhase: 'beforeJoin' }, true);
};

export const wordcloudShapeTransform = transform;
