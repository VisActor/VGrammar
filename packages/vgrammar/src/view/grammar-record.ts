import { isNil, isString } from '@visactor/vutils';
import type {
  BuiltInGrammarType,
  ICoordinate,
  IData,
  IGrammarBase,
  IMark,
  IScale,
  ISignal,
  IRecordedGrammars
} from '../types';

export class RecordedGrammars implements IRecordedGrammars {
  private _warning: (key: string, grammar: IGrammarBase) => void;
  private _mapKey: (grammar: IGrammarBase) => string;
  private _grammars: Record<BuiltInGrammarType | 'customized', IGrammarBase[]> = {
    signal: [],
    data: [],
    scale: [],
    coordinate: [],
    mark: [],
    customized: []
  };
  // map key might not be unique
  private _grammarMap: Record<BuiltInGrammarType | 'customized', Record<string, IGrammarBase>> = {
    signal: {},
    data: {},
    scale: {},
    coordinate: {},
    mark: {},
    customized: {}
  };
  private _size: number = 0;

  constructor(
    mapKey: string | ((grammar: IGrammarBase) => string),
    warningWhenDuplicated?: (key: string, grammar: IGrammarBase) => void
  ) {
    this._mapKey = isString(mapKey) ? grammar => grammar[mapKey] : mapKey;
    this._warning = warningWhenDuplicated;
  }

  record(grammar: IGrammarBase) {
    const grammarType = grammar.grammarType;
    const key = this._mapKey(grammar);
    if (this._grammarMap[grammarType]) {
      this._grammars[grammarType].push(grammar);
      if (!isNil(key)) {
        // ignore grammar if key is duplicated
        if (this._grammarMap[grammarType][key]) {
          this._warning?.(key, grammar);
        } else {
          this._grammarMap[grammarType][key] = grammar;
        }
      }
    } else {
      this._grammars.customized.push(grammar);
      if (!isNil(key)) {
        // ignore grammar if key is duplicated
        if (this._grammarMap.customized[key]) {
          this._warning?.(key, grammar);
        } else {
          this._grammarMap.customized[key] = grammar;
        }
      }
    }
    this._size += 1;
    return;
  }

  unrecord(grammar: IGrammarBase) {
    const grammarType = grammar.grammarType;
    const key = this._mapKey(grammar);
    if (this._grammarMap[grammarType]) {
      this._grammars[grammarType] = this._grammars[grammarType].filter(
        (storedGrammar: IGrammarBase) => storedGrammar !== grammar
      );
      if (!isNil(key) && this._grammarMap[grammarType][key] === grammar) {
        delete this._grammarMap[grammarType][key];
      }
    } else {
      this._grammars.customized = this._grammars.customized.filter(
        (storedGrammar: IGrammarBase) => storedGrammar !== grammar
      );
      if (!isNil(key) && this._grammarMap.customized[key] === grammar) {
        delete this._grammarMap.customized[key];
      }
    }
    this._size -= 1;
    return this;
  }

  size() {
    return this._size;
  }

  getSignal<T>(key: string): ISignal<T> | null {
    return (this._grammarMap.signal[key] as ISignal<T>) ?? null;
  }
  getData(key: string): IData | null {
    return (this._grammarMap.data[key] as IData) ?? null;
  }
  getScale(key: string): IScale | null {
    return (this._grammarMap.scale[key] as IScale) ?? null;
  }
  getCoordinate(key: string): ICoordinate | null {
    return (this._grammarMap.coordinate[key] as ICoordinate) ?? null;
  }
  getMark(key: string): IMark | null {
    return (this._grammarMap.mark[key] as IMark) ?? null;
  }
  getCustomized(key: string): IGrammarBase | null {
    return this._grammarMap.customized[key] ?? null;
  }
  getGrammar(key: string): IGrammarBase | null {
    if (this._grammarMap.data[key]) {
      return this._grammarMap.data[key];
    } else if (this._grammarMap.signal[key]) {
      return this._grammarMap.signal[key];
    } else if (this._grammarMap.scale[key]) {
      return this._grammarMap.scale[key];
    } else if (this._grammarMap.coordinate[key]) {
      return this._grammarMap.coordinate[key];
    } else if (this._grammarMap.mark[key]) {
      return this._grammarMap.mark[key];
    } else if (this._grammarMap.customized[key]) {
      return this._grammarMap.customized[key];
    }
    return null;
  }

  getAllSignals(): ISignal<any>[] {
    return this._grammars.signal as ISignal<any>[];
  }
  getAllData(): IData[] {
    return this._grammars.data as IData[];
  }
  getAllScales(): IScale[] {
    return this._grammars.scale as IScale[];
  }
  getAllCoordinates(): ICoordinate[] {
    return this._grammars.coordinate as ICoordinate[];
  }
  getAllMarks(): IMark[] {
    return this._grammars.mark as IMark[];
  }
  getAllCustomized(): IGrammarBase[] {
    return this._grammars.customized;
  }

  traverse(func: (grammar: IGrammarBase) => boolean | void) {
    Object.values(this._grammars ?? {}).forEach(grammars =>
      (grammars ?? []).forEach(grammar => {
        // stop traversing when func returns true
        if (func.call(null, grammar)) {
          return;
        }
      })
    );
  }

  find(func: (grammar: IGrammarBase) => boolean) {
    let targetGrammar: IGrammarBase = null;
    this.traverse(grammar => {
      if (func.call(null, grammar) === true) {
        targetGrammar = grammar;
        return true;
      }
      return false;
    });
    return targetGrammar;
  }

  filter(func: (grammar: IGrammarBase) => boolean) {
    const targetGrammars: IGrammarBase[] = [];
    this.traverse(grammar => {
      if (func.call(null, grammar) === true) {
        targetGrammars.push(grammar);
      }
    });
    return targetGrammars;
  }

  clear() {
    this._size = 0;
    this._grammars = { signal: [], data: [], scale: [], coordinate: [], mark: [], customized: [] };
    this._grammarMap = { signal: {}, data: {}, scale: {}, coordinate: {}, mark: {}, customized: {} };
  }

  release() {
    this._size = 0;
    this._grammars = null;
    this._grammarMap = null;
  }
}
