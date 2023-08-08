export const mergeGrammarSpecs = <T extends { id?: string }>(newSpecs: T[], prevSpecs: T[]) => {
  return newSpecs.reduce((res, entry) => {
    if (entry.id && !res.some(prev => prev.id === entry.id)) {
      res.push(entry);
    }

    return res;
  }, prevSpecs);
};
