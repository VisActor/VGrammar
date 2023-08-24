export function extend<T = any>(target: Partial<T>, source: Partial<T>) {
  if (source) {
    const keys = Object.keys(source);
    let i = 0;
    const len = keys.length;
    while (i < len) {
      target[keys[i]] = source[keys[i]];
      i++;
    }
  }

  return target;
}

export function extendToNew<T = any>(target: Partial<T>, source?: Partial<T>) {
  const result = {};
  let keys = Object.keys(target);
  let i = 0;
  let len = keys.length;

  while (i < len) {
    result[keys[i]] = target[keys[i]];
    i++;
  }

  if (source) {
    keys = Object.keys(source);

    i = 0;
    len = keys.length;
    while (i < len) {
      result[keys[i]] = source[keys[i]];
      i++;
    }
  }

  return result as T;
}
