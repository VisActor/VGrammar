import { isNil } from '@visactor/vutils';
import type { DiffResult } from '../../types/base';
import { parseField } from '../../parse/util';
import { DefaultKey, DefaultGroupKeys } from '../constants';

export type GroupedData<T> = {
  // iterating over array is faster than set
  keys: (symbol | string)[];
  // operation on map is faster than object
  data: Map<symbol | string, T[]>;
};

export function groupData<T>(
  data: T[],
  key: ((datum: T) => symbol | string) | string,
  sort?: (a: T, b: T) => number
): GroupedData<T> {
  const groupedData = new Map();
  if (!data || data.length === 0) {
    return { keys: [], data: groupedData };
  }
  if (!key) {
    groupedData.set(DefaultKey, sort ? data.slice().sort(sort) : data.slice());
    return { keys: DefaultGroupKeys, data: groupedData };
  }
  const keyGetter = parseField(key);
  const keys = new Set<string>();
  data.forEach(entry => {
    const key = keyGetter(entry);
    const lastData = groupedData.get(key) ?? [];
    lastData.push(entry);
    groupedData.set(key, lastData);
    keys.add(key);
  });
  if (sort) {
    keys.forEach(key => {
      groupedData.get(key).sort(sort);
    });
  }
  return { keys: Array.from(keys), data: groupedData };
}

export class Differ<T> {
  private prevData: GroupedData<T>;
  private currentData: GroupedData<T>;

  private callback: (key: symbol | string, data: T[] | null, prevData: T[] | null) => void;

  constructor(data?: T[], key?: ((datum: T) => symbol | string) | string, sort?: (a: T, b: T) => number) {
    this.prevData = groupData(data ?? [], key ?? null, sort);
  }

  setCurrentData(currentData: GroupedData<T>) {
    this.currentData = currentData;
  }

  doDiff() {
    if (this.callback) {
      const prevMap = new Map(this.prevData.data);
      const currentKeys = this.currentData.keys;
      currentKeys.forEach(key => {
        this.callback(key, this.currentData.data.get(key), prevMap.get(key));
        prevMap.delete(key);
      });

      this.prevData.keys.forEach(key => {
        if (prevMap.has(key)) {
          this.callback(key, null, prevMap.get(key));
        }
      });
    }
  }

  setCallback(callback: (key: symbol | string, data: T[], prevData: T[]) => void) {
    this.callback = callback;
  }

  updateToCurrent() {
    this.prevData = this.currentData ?? { keys: [], data: new Map() };
    this.currentData = null;
  }

  reset() {
    this.prevData = { keys: [], data: new Map() };
  }
}

export function diffSingle<U, V>(prev: U[], next: V[], key: (datum: U | V) => symbol | string): DiffResult<U, V> {
  const result: DiffResult<U, V> = {
    enter: [],
    exit: [],
    update: []
  };

  const differ = new Differ<U | V>(prev, key);
  differ.setCallback((key, data, prevData) => {
    if (isNil(data)) {
      // exit
      result.exit.push({ prev: prevData[0] as U });
    } else if (isNil(prevData)) {
      // enter
      result.enter.push({ next: data[0] as V });
    } else {
      // update
      result.update.push({ next: data[0] as V, prev: prevData[0] as U });
    }
  });
  differ.setCurrentData(groupData(next, key));
  differ.doDiff();

  return result;
}

export function diffMultiple<U, V>(prev: U[], next: V[], key: (datum: U | V) => symbol | string): DiffResult<U[], V[]> {
  const result: DiffResult<U[], V[]> = {
    enter: [],
    exit: [],
    update: []
  };

  const differ = new Differ<U | V>(prev, key);
  differ.setCallback((key, data, prevData) => {
    if (isNil(data)) {
      // exit
      result.exit.push({ prev: prevData as U[] });
    } else if (isNil(prevData)) {
      // enter
      result.enter.push({ next: data as V[] });
    } else {
      // update
      result.update.push({ next: data as V[], prev: prevData as U[] });
    }
  });
  differ.setCurrentData(groupData(next, key));
  differ.doDiff();

  return result;
}
