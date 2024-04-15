/* Adapted from fmin by Ben Frederickson
 * https://github.com/benfred/fmin
 * Licensed under the BSD-3-Clause

 * url: https://github.com/benfred/fmin/blob/master/src/blas1.js
 * License: https://github.com/benfred/fmin/blob/master/LICENSE
 * @license
 */

// need some basic operations on vectors, rather than adding a dependency,
// just define here
export function zeros(x: number): number[] {
  const r = new Array(x);
  for (let i = 0; i < x; ++i) {
    r[i] = 0;
  }
  return r;
}
export function zerosM(x: number, y: number) {
  return zeros(x).map(function () {
    return zeros(y);
  });
}

export function dot(a: number[], b: number[]) {
  let ret = 0;
  for (let i = 0; i < a.length; ++i) {
    ret += a[i] * b[i];
  }
  return ret;
}

export function norm2(a: number[]) {
  return Math.sqrt(dot(a, a));
}

export function scale(ret: number[], value: number[], c: number) {
  for (let i = 0; i < value.length; ++i) {
    ret[i] = value[i] * c;
  }
}

export function weightedSum(ret: number[], w1: number, v1: number[], w2: number, v2: number[]) {
  for (let j = 0; j < ret.length; ++j) {
    ret[j] = w1 * v1[j] + w2 * v2[j];
  }
}

export function gemv(output: number[], A: number[][], x: number[]) {
  for (let i = 0; i < output.length; ++i) {
    output[i] = dot(A[i], x);
  }
}
