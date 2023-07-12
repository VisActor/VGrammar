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
