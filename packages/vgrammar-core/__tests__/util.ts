import * as transforms from '../src/transforms/index';
import { createGlyphGraphicItem, createGraphicItem } from '../src/graph/util/graphic';
import { createElement } from '../src/graph/util/element';
import { transformsByType } from '../src/graph/attributes';
import type { IGlyphElement, IGlyphMeta, IParsedAnimationConfig } from '../src';
import CanvasRenderer from '../src/graph/canvas-renderer';
import { defaultTheme } from '../src/theme/default';

export function registerDefaultTransforms() {
  Object.keys(transforms).forEach(key => {
    transforms[key]();
  });
}

export const emptyFunction = () => {
  return;
};

export const getMockedView = () => {
  const grammars = {
    unrecord: emptyFunction,
    record: emptyFunction
  };
  const lookup = (id: string) => {
    if (grammars[id]) {
      return grammars[id];
    }
    return (grammars[id] = { id: () => id, targets: [], output: () => ({}) });
  };
  const view = {
    emit: emptyFunction,
    grammars: grammars,
    getGrammarById: lookup,
    getDataById: lookup,
    getScaleById: lookup,
    getCoordinateById: lookup,
    getMarkById: lookup,
    commit: emptyFunction,
    background: () => 'white',
    getCurrentTheme: () => defaultTheme
  };
  (view as any).renderer = new CanvasRenderer(view as any);
  (view as any).renderer.initialize(500, 500, {}, {});

  return view;
};

export function createSimpleElement(
  markType: string = 'rect',
  options?: {
    transformType?: string;
    markSpec?: any;
  }
) {
  const mark = {
    markType,
    animate: { getAnimationConfigs: () => [] as IParsedAnimationConfig[] },
    isLargeMode: () => false,
    isCollectionMark: () => markType === 'line' || markType === 'area',
    needAnimate: () => false,
    getSpec: () => options?.markSpec ?? {},
    parameters: () => ({}),
    graphicParent: { appendChild: emptyFunction, insertInto: emptyFunction },
    emit: () => false,
    view: getMockedView(),
    isProgressive: () => false,
    getAttributeTransforms: () => transformsByType[options?.transformType ?? markType]
  } as any;
  mark.addGraphicItem = () => {
    return (createGraphicItem as any)(mark, markType, {});
  };
  return createElement(mark);
}

export function createSimpleGlyphElement(
  glyphMeta: IGlyphMeta,
  options?: {
    transformType?: string;
    markSpec?: any;
  }
) {
  const mark = {
    markType: 'glyph',
    animate: { getAnimationConfigs: () => [] as IParsedAnimationConfig[] },
    isLargeMode: () => false,
    isCollectionMark: () => false,
    needAnimate: () => false,
    graphicParent: { appendChild: emptyFunction, insertInto: emptyFunction },
    getSpec: () => ({}),
    parameters: () => ({}),
    glyphMeta,
    getGlyphMeta: () => glyphMeta,
    emit: () => false,
    view: getMockedView(),
    isProgressive: () => false,
    getGlyphConfig: () => null as any,
    getAttributeTransforms: () => transformsByType[options?.transformType ?? 'glyph']
  } as any;
  mark.addGraphicItem = () => {
    return (createGlyphGraphicItem as any)(mark, glyphMeta, {});
  };
  const element = createElement(mark) as IGlyphElement;
  element.updateData('key', [{ key: 0 }], 'key', {} as any);
  return element;
}
