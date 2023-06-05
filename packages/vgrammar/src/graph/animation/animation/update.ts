import { array } from '@visactor/vutils';
import { isEqual } from '@visactor/vgrammar-util';
import type { IElement } from '../../../types';
import type { IAnimationParameters, TypeAnimation } from '../../../types/animate';

// FIXME: channels which do not animate should be handled by VRender
const defaultExcludedChannels = [
  'visible',

  // path channel
  'path',

  // text channels
  'text',
  'lineWidth',
  'textBaseline',
  'textAlign'
];

export interface IUpdateAnimationOptions {
  excludeChannels: string[];
}

export const update: TypeAnimation<IElement> = (
  element: IElement,
  options: IUpdateAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const from = Object.assign({}, element.getPrevGraphicAttributes());
  const to = Object.assign({}, element.getNextGraphicAttributes());
  defaultExcludedChannels.forEach(key => {
    delete from[key];
    delete to[key];
  });
  array(options?.excludeChannels).forEach(key => {
    delete from[key];
    delete to[key];
  });
  Object.keys(to).forEach(key => {
    if (isEqual(key, from, to)) {
      delete from[key];
      delete to[key];
    }
  });
  return { from, to };
};
