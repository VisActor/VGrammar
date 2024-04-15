/* Adapted from fmin by Ben Frederickson
 * https://github.com/benfred/fmin
 * Licensed under the BSD-3-Clause

 * url: https://github.com/benfred/fmin/blob/master/src/conjugateGradient.js
 * License: https://github.com/benfred/fmin/blob/master/LICENSE
 * @license
 */

import { dot, norm2, scale, weightedSum, gemv } from './blas1';
import { wolfeLineSearch } from './linesearch';

export function conjugateGradient(f: any, initial: any, params: any) {
  // allocate all memory up front here, keep out of the loop for perfomance
  // reasons
  let current = { x: initial.slice(), fx: 0, fxprime: initial.slice() };
  let next = { x: initial.slice(), fx: 0, fxprime: initial.slice() };
  const yk = initial.slice();
  let temp;
  let a = 1;

  params = params || {};
  const maxIterations = params.maxIterations || initial.length * 20;

  current.fx = f(current.x, current.fxprime);
  const pk = current.fxprime.slice();
  scale(pk, current.fxprime, -1);

  for (let i = 0; i < maxIterations; ++i) {
    a = wolfeLineSearch(f, pk, current, next, a);

    // todo: history in wrong spot?
    if (params.history) {
      params.history.push({ x: current.x.slice(), fx: current.fx, fxprime: current.fxprime.slice(), alpha: a });
    }

    if (!a) {
      // faiiled to find point that satifies wolfe conditions.
      // reset direction for next iteration
      scale(pk, current.fxprime, -1);
    } else {
      // update direction using Polak–Ribiere CG method
      weightedSum(yk, 1, next.fxprime, -1, current.fxprime);

      const delta_k = dot(current.fxprime, current.fxprime);
      const beta_k = Math.max(0, dot(yk, next.fxprime) / delta_k);

      weightedSum(pk, beta_k, pk, -1, next.fxprime);

      temp = current;
      current = next;
      next = temp;
    }

    if (norm2(current.fxprime) <= 1e-5) {
      break;
    }
  }

  if (params.history) {
    params.history.push({ x: current.x.slice(), fx: current.fx, fxprime: current.fxprime.slice(), alpha: a });
  }

  return current;
}
