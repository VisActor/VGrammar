// -- Exports -----
export const version = __VERSION__;

export * from './graph';

export * from './interactions';

export { View } from './view';
export { Scale, registerScale } from './view/scale';
export { Coordinate, registerCoordinate } from './view/coordinate';
export { parseFunctionType, invokeFunctionType } from './parse/util';
export { GrammarBase } from './view/grammar-base';
export * from './util/text';
export * from './types';
export { Factory } from './core/factory';
export {
  SIGNAL_AUTOFIT,
  SIGNAL_HEIGHT,
  SIGNAL_PADDING,
  SIGNAL_VIEW_HEIGHT,
  SIGNAL_VIEW_WIDTH,
  SIGNAL_WIDTH,
  SIGNAL_VIEW_BOX
} from './view/constants';
export { registerViewEventsAPI } from './view/view-event-mixin';

export { ThemeManager } from './theme/theme-manager';

export * from './glyph';
export * from './component';
export * from './transforms';
export * from './graph/animation/animation';

export { vglobal } from '@visactor/vrender-core';
export * from './env';
export * from './interactions';
export * from './semantic-marks/cell';
export * from './semantic-marks/interval';
export * from './graph/mark/graphic';
export { registerDefaultLayout, defaultDoLayout } from './graph/layout/layout';
export { registerGlyphMark, GlyphMark } from './view/glyph';

import { DragNDrop, Gesture } from '@visactor/vrender-kits';
import { Factory } from './core/factory';

export const registerDragPlugin = () => {
  Factory.registerStageEventPlugin('drag', DragNDrop);
};

export const registerGesturePlugin = () => {
  Factory.registerStageEventPlugin('gesture', Gesture);
};
