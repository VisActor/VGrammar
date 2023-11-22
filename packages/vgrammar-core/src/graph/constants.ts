import type { IAnimationControlOptions } from '../types/animate';
import { GrammarMarkType } from './enums';

export const BridgeElementKey = '__vgrammar_scene_item__';

export const CollectionMarkType = [GrammarMarkType.line, GrammarMarkType.area];

export const Mark3DType = [GrammarMarkType.arc3d, GrammarMarkType.rect3d, GrammarMarkType.pyramid3d];

export const DefaultKey = 'key';

export const DefaultMarkData = [{}];

export const DefaultGroupKeys = [DefaultKey];

export const DefaultReuse = true;
export const DefaultMorph = true;
export const DefaultMorphAll = false;
export const DefaultSplitPath: null | 'clone' = null;
export const DefaultEnableExitAnimation = true;

export const ImmediateAnimationState = 'VGRAMMAR_IMMEDIATE_ANIMATION';

/** default animation configs */
export const DefaultAnimationStartTime = 0;
export const DefaultAnimationDuration = 1000;
export const DefaultAnimationDelay = 0;
export const DefaultAnimationDelayAfter = 0;
export const DefaultAnimationLoop = false;
export const DefaultAnimationOneByOne = false;
export const DefaultAnimationEasing = 'quintInOut';
export const DefaultAnimationControlOptions: IAnimationControlOptions = {
  stopWhenStateChange: false,
  immediatelyApply: true
};
export const DefaultAnimationParameters = 'VGRAMMAR_ANIMATION_PARAMETERS';
