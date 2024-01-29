import { array } from '@visactor/vutils';
import { isEqual } from '@visactor/vgrammar-util';
import type { IElement } from '../../../types';
import type { IAnimationParameters, TypeAnimation } from '../../../types/animate';

export interface IUpdateAnimationOptions {
  excludeChannels: string[];
}

const BUILT_IN_EXCLUDE_CHANNELS = {
  symbol: ['_mo_hide_', 'visible']
};

export const update: TypeAnimation<IElement> = (
  element: IElement,
  options: IUpdateAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const from = Object.assign({}, element.getPrevGraphicAttributes());
  const to = Object.assign({}, element.getNextGraphicAttributes());
  if (options) {
    array(options.excludeChannels).forEach(key => {
      delete from[key];
      delete to[key];
    });
  }
  let excludeChannels: string[];
  if (element.mark && element.mark.markType && (excludeChannels = BUILT_IN_EXCLUDE_CHANNELS[element.mark.markType])) {
    excludeChannels.forEach(key => {
      delete from[key];
      delete to[key];
    });
  }

  Object.keys(to).forEach(key => {
    if (isEqual(key, from, to)) {
      delete from[key];
      delete to[key];
    }
  });
  return { from, to };
};
