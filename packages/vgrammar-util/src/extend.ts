export function extend<T = any>(target: Partial<T>, source: Partial<T>) {
  if (source) {
    const keys = Object.keys(source);
    let i = keys.length;
    while (i--) {
      target[keys[i]] = source[keys[i]];
    }
  }

  return target;
}

export function extendToNew<T = any>(target: Partial<T>, source?: Partial<T>) {
  const result = {};
  let keys = Object.keys(target);
  let i = keys.length;
  while (i--) {
    result[keys[i]] = target[keys[i]];
  }

  if (source) {
    keys = Object.keys(source);

    i = keys.length;
    while (i--) {
      result[keys[i]] = source[keys[i]];
    }
  }

  return result as T;
}
