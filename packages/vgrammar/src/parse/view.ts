import type { IBounds } from '@visactor/vutils';
import { isNumber, Bounds } from '@visactor/vutils';
import {
  DefaultAnimationDelay,
  DefaultAnimationDuration,
  DefaultAnimationEasing,
  DefaultAnimationOneByOne,
  DefaultMorph,
  DefaultMorphAll,
  DefaultReuse,
  DefaultSplitPath
} from '../graph/constants';
import type { GroupMarkSpec, MarkSpec, SignalSpec } from '../types';
import type { IMorphConfig } from '../types/morph';
import type { IViewOptions, IViewThemeConfig, ViewSpec } from '../types/view';
import {
  SIGNAL_AUTOFIT,
  SIGNAL_HEIGHT,
  SIGNAL_PADDING,
  SIGNAL_VIEW_HEIGHT,
  SIGNAL_VIEW_WIDTH,
  SIGNAL_WIDTH,
  SIGNAL_VIEW_BOX
} from '../view/constants';

let markBaseId = -1;

export const BuiltInSignalID = [
  SIGNAL_WIDTH,
  SIGNAL_HEIGHT,
  SIGNAL_PADDING,
  SIGNAL_VIEW_WIDTH,
  SIGNAL_VIEW_HEIGHT,
  SIGNAL_VIEW_BOX,
  SIGNAL_AUTOFIT
];

export const builtInSignals = (spec: IViewOptions, config: IViewThemeConfig): SignalSpec<any>[] => {
  return [
    { id: SIGNAL_WIDTH, value: spec[SIGNAL_WIDTH] ?? 0 },
    { id: SIGNAL_HEIGHT, value: spec[SIGNAL_HEIGHT] ?? 0 },
    { id: SIGNAL_PADDING, value: normalizePadding(spec[SIGNAL_PADDING] ?? config[SIGNAL_PADDING]) },
    {
      id: SIGNAL_VIEW_WIDTH,
      update: {
        callback: (signal: number, params: any) => {
          const padding = normalizePadding(params[SIGNAL_PADDING]);
          return params[SIGNAL_WIDTH] - padding.left - padding.right;
        },
        dependency: [SIGNAL_WIDTH, SIGNAL_PADDING]
      }
    },
    {
      id: SIGNAL_VIEW_HEIGHT,
      update: {
        callback: (signal: number, params: any) => {
          const padding = normalizePadding(params[SIGNAL_PADDING]);
          return params[SIGNAL_HEIGHT] - padding.top - padding.bottom;
        },
        dependency: [SIGNAL_HEIGHT, SIGNAL_PADDING]
      }
    },
    {
      id: SIGNAL_VIEW_BOX,
      update: {
        callback: (signal: IBounds, params: any) => {
          const padding = normalizePadding(params[SIGNAL_PADDING]);
          return (signal ? signal : new Bounds()).setValue(
            padding.left,
            padding.top,
            padding.left + params[SIGNAL_VIEW_WIDTH],
            padding.top + params[SIGNAL_VIEW_HEIGHT]
          );
        },
        dependency: [SIGNAL_VIEW_WIDTH, SIGNAL_VIEW_HEIGHT, SIGNAL_PADDING]
      }
    },
    {
      id: SIGNAL_AUTOFIT,
      value: spec[SIGNAL_AUTOFIT] ?? config[SIGNAL_AUTOFIT]
    }
  ];
};

export const normalizePadding = (
  value: number | { top?: number; left?: number; right?: number; bottom?: number }
): { top: number; left: number; right: number; bottom: number } => {
  if (isNumber(value)) {
    return { top: value, bottom: value, left: value, right: value };
  }
  return { top: value?.top ?? 0, bottom: value?.bottom ?? 0, left: value?.left ?? 0, right: value?.right ?? 0 };
};

export const normalizeMarkTree = (spec: ViewSpec) => {
  const traverse = (spec: MarkSpec, group: string) => {
    spec.group = group;
    const id = spec.id ?? `VGRAMMAR_MARK_${++markBaseId}`;
    spec.id = id;
    ((spec as GroupMarkSpec).marks ?? []).forEach(child => traverse(child, id));
  };
  (spec.marks ?? []).forEach(mark => traverse(mark, 'root'));
  return spec;
};

export const normalizeMorphConfig = (morph: IMorphConfig): IMorphConfig => {
  return {
    reuse: morph?.reuse ?? DefaultReuse,
    morph: morph?.morph ?? DefaultMorph,
    morphAll: morph?.morphAll ?? DefaultMorphAll,
    animation: {
      easing: morph?.animation?.easing ?? DefaultAnimationEasing,
      delay: morph?.animation?.delay ?? DefaultAnimationDelay,
      duration: morph?.animation?.duration ?? DefaultAnimationDuration,
      oneByOne: morph?.animation?.oneByOne ?? DefaultAnimationOneByOne,
      splitPath: morph?.animation?.splitPath ?? DefaultSplitPath
    }
  };
};
