import type { IGrammarBase } from './grammar';

export type IDataflowCallback = (df: IDataflow) => void;

/**
 * Dataflow定义，
 */
export interface IDataflow {
  logger: any;
  add: (grammar: IGrammarBase) => boolean | undefined;
  remove: (grammar: IGrammarBase) => void;
  hasCommitted: () => boolean;
  commit: (grammar: IGrammarBase) => this;
  evaluate: () => Promise<boolean>;
  evaluateSync: () => boolean;
  runBefore: (callback?: IDataflowCallback) => void;
  runAfter: (callback?: IDataflowCallback) => void;
}
