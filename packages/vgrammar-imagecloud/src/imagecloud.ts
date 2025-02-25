import type { IProgressiveTransformResult, IView } from '@visactor/vgrammar-core';
import { Logger, isFunction, isNil } from '@visactor/vutils';
import { error } from '@visactor/vgrammar-util';
import { SpiralLayout } from './layout/spiral';
import { IMAGECLOUD_HOOK_EVENT } from './util';
import type { ImageCloudOptions } from './interface';
import { GridLayout } from './layout/grid/grid';
import { StackLayout } from './layout/stack';

export const transform = (
  options: ImageCloudOptions,
  upstreamData: any[],
  parameters?: any,
  view?: IView
): any[] | IProgressiveTransformResult<any[]> => {
  const size: [number, number] = isFunction(options.size) ? options.size() : options.size;
  options.size = size;
  /** options 配置错误提示 */
  if (!size || isNil(size[0]) || isNil(size[1]) || size[0] <= 0 || size[1] <= 0) {
    const logger = Logger.getInstance();
    logger.info('Wordcloud size dimensions must be greater than 0');
    return [];
  }

  options.size = [Math.ceil(size[0]), Math.ceil(size[1])];

  if (!options.image) {
    error('Imagecloud: image source must be specified.');
  }

  view?.emit && view.emit(IMAGECLOUD_HOOK_EVENT.BEFORE_IMAGECLOUD_LAYOUT);

  // 第一次数据流到这里data为空，如果不做判断，走到布局算法会报错
  if (!upstreamData || upstreamData.length === 0) {
    return [];
  }

  let layoutConstructor;

  const layoutMode = options.layoutConfig?.layoutMode ?? 'spiral';

  switch (layoutMode) {
    case 'grid':
      layoutConstructor = GridLayout;
      break;
    case 'stack':
      layoutConstructor = StackLayout;
      break;
    case 'spiral':
    default:
      layoutConstructor = SpiralLayout;
      break;
  }

  const layout = new layoutConstructor(options, view);
  layout.layout(upstreamData);

  if (layout.unfinished()) {
    return {
      progressive: layout
    } as unknown as IProgressiveTransformResult<any[]>;
  }

  return layout.output();
};
