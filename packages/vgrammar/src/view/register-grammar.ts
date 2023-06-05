import type { IGrammarBaseConstructor } from '../types';

const customizedGrammars: Record<
  string,
  {
    grammarClass: IGrammarBaseConstructor;
    specKey: string;
  }
> = {};

export const getGrammar = (type: string) => {
  return customizedGrammars[type];
};

export const getCustomizedGrammars = () => customizedGrammars;

export const registerGrammar = (type: string, grammarClass: IGrammarBaseConstructor, specKey?: string) => {
  customizedGrammars[type] = {
    grammarClass: grammarClass,
    specKey: specKey ?? type
  };
};

export const unregisterGrammar = (type: string) => {
  delete customizedGrammars[type];
};

export const unregisterAllGrammars = () => {
  Object.keys(customizedGrammars).forEach(unregisterGrammar);
};
