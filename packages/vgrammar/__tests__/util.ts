import { registerTransform } from '../src/transforms/register';
import { transforms } from '../src/transforms/index';
import { createGraphicItem } from '../src/graph/util/graphic';
import { createElement } from '../src/graph/util/element';
import { transformsByType } from '../src/graph/attributes';

const use = (...transformMaps: Record<string, any>[]) => {
  transformMaps.forEach(transformMap => {
    Object.keys(transformMap).forEach(key => {
      registerTransform(key, transformMap[key], true);
    });
  });
};

export function registerDefaultTransforms() {
  use(transforms);
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
  return {
    emit: emptyFunction,
    grammars: grammars,
    getGrammarById: lookup,
    getDataById: lookup,
    getScaleById: lookup,
    getCoordinateById: lookup,
    getMarkById: lookup,
    commit: emptyFunction
  };
};

export function createSimpleElement(markType: string = 'rect', transformType?: string) {
  const mark = {
    markType,
    isLargeMode: () => false,
    isCollectionMark: () => markType === 'line' || markType === 'area',
    needAnimate: () => false,
    getSpec: () => ({}),
    parameters: () => ({}),
    graphicParent: { appendChild: emptyFunction, insertInto: emptyFunction },
    emit: () => false,
    view: getMockedView(),
    isProgressive: () => false,
    getAttributeTransforms: () => transformsByType[transformType ?? markType]
  } as any;
  mark.addGraphicItem = () => {
    return (createGraphicItem as any)(mark, markType, {});
  };
  createElement(mark);
  return createElement(mark);
}
