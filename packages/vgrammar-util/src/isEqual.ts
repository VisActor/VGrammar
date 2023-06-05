import { isObjectLike, isArray, isNil, isObject } from '@visactor/vutils';

export const isEqual = (key: string, current: any, target: any, deep: boolean = true) => {
  if (current === target) {
    return true;
  }

  // 如果有空值，则直接返回false，这里认为 null 和 undefined 相等
  if (isNil(current) || isNil(target)) {
    return isNil(current) && isNil(target);
  }

  // 非 object 类型直接比对
  if (!isObjectLike(current) && !isObjectLike(target)) {
    return current === target;
  }

  const c = isArray(current) ? current : current[key];
  const t = isArray(target) ? target : target[key];

  if (c === t) {
    return true;
  }
  if (deep === false) {
    return false;
  }
  // 类型必须相同
  if (isArray(t)) {
    if (isArray(c) && t.length === c.length && t.every((v, i) => v === c[i])) {
      return true;
    }
    return false;
  }
  // 类型必须相同
  if (isObject(t)) {
    if (isObject(c) && Object.keys(t).length === Object.keys(c).length && Object.keys(t).every(k => isEqual(k, t, c))) {
      return true;
    }
    return false;
  }
  return false;
};
