import { registerTransform } from '../src/transforms/register';
import { transforms } from '../src/transforms/index';

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
