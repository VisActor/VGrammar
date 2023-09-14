/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-transforms/src/util/util.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { isNil, isString } from '@visactor/vutils';
import type { FieldGetterFunction } from '@visactor/vgrammar-util';
import { accessorName } from '@visactor/vgrammar-util';

// use either provided alias or accessor field name
export function fieldNames(fields: string[] | FieldGetterFunction[], as?: string[]) {
  if (!fields) {
    return null;
  }
  return fields.map((f, i) => {
    return as[i] ?? (isString(f) ? f : accessorName(f));
  });
}

export function partition(data?: any[], groupBy?: FieldGetterFunction[], field?: FieldGetterFunction) {
  // partition data points into groups
  if (isNil(groupBy)) {
    return [data.map(field)];
  }

  const groups: any[] = [];
  const map: Record<string, any> = {};
  data.forEach((entry: any) => {
    const groupKey = groupBy.map((groupFunc: (arg: any) => any) => groupFunc(entry)).toString();

    if (!map[groupKey]) {
      const groupItem: any[] = [];
      (groupItem as any).dims = groupKey;
      groups.push(groupItem);
      map[groupKey] = groupItem;
    } else {
      map[groupKey].push(field(entry));
    }
  });

  return groups;
}

export function normalizeAngle(angle: number): number {
  while (angle < 0) {
    angle += Math.PI * 2;
  }
  while (angle >= Math.PI * 2) {
    angle -= Math.PI * 2;
  }
  return angle;
}

export function computeQuadrant(angle: number): 1 | 2 | 3 | 4 {
  angle = normalizeAngle(angle);
  if (angle > 0 && angle <= Math.PI / 2) {
    return 2;
  } else if (angle > Math.PI / 2 && angle <= Math.PI) {
    return 3;
  } else if (angle > Math.PI && angle <= (3 * Math.PI) / 2) {
    return 4;
  }
  return 1;
}
