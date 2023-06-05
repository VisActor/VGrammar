import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isValidNumber, isNumber, isString } from '@visactor/vutils';
import type { MarkElementItem, MarkType } from '../../types';

/**
 * 比较颜色是否相等
 * @param {*} c1
 * @param {*} c2
 * @returns
 */
export function colorEqual(c1: any, c2: any) {
  if (c1 === c2) {
    return true;
  }
  if (!c1 || !c2) {
    return false;
  }
  if (isString(c1)) {
    return false;
  }
  if (['gradient', 'x0', 'x1', 'r0', 'r1', 'y0', 'y1'].some(key => c1[key] !== c2[key])) {
    return false;
  }
  if (
    c1.stops.length !== c2.stops.length ||
    c1.stops.some((s: any, i: any) => s.offset !== c2.stops[i].offset || s.color !== c2.stops[i].color)
  ) {
    return false;
  }
  return true;
}

/**
 * 解析graphicItem x, y 相关默认值的处理
 * @param val
 * @returns
 */
export function parseXY(val: number): number {
  if (val === null) {
    return 0;
  }
  return val;
}

export function isValidPointsChannel(channels: string[], markType: MarkType): boolean {
  switch (markType) {
    case 'line':
      return channels.some(channel => ['x', 'y', 'defined'].includes(channel));
    case 'area':
      return channels.some(channel => ['x', 'y', 'x1', 'y1', 'defined'].includes(channel));
    case 'largeRects':
      return channels.some(channel => ['x', 'y', 'width', 'y1'].includes(channel));
    case 'largeSymbols':
      return channels.some(channel => ['x', 'y'].includes(channel));
  }
  return false;
}

/**
 * 获取rule的points
 * 相对位置
 * @param {*} item
 * @returns
 */
export function getRulePoints(nextAttrs: { x: number; y: number; x1: number; y1: number }) {
  const { x, y, x1, y1 } = nextAttrs;

  if (!isValidNumber(x) || !isValidNumber(y) || !isValidNumber(x1) || !isValidNumber(y1)) {
    return [];
  }
  return [
    { x, y },
    { x: x1, y: y1 }
  ];
}
/**
 * 生成用于渲染的点数组
 * @param {*} item
 * @returns {IPointLike[]}
 */
export function getLinePoints(
  items?: MarkElementItem[],
  includeOnePoint?: boolean,
  lastPoints?: IPointLike[],
  isArea?: boolean
) {
  if (!items || !items.length || (items.length === 1 && includeOnePoint)) {
    return [];
  }
  const hasValidChannel = items.some(item => {
    return isValidPointsChannel(Object.keys(item.nextAttrs), 'line');
  });
  if (!hasValidChannel) {
    return lastPoints ?? [];
  }
  return items.map((item, index) => {
    const attrs = item.nextAttrs;
    const x = parseXY(attrs.x ?? lastPoints?.[index]?.x);
    const y = parseXY(attrs.y ?? lastPoints?.[index]?.y);
    const defined = attrs.defined ?? lastPoints?.[index]?.defined;
    const point: IPointLike = { x, y, context: item.key };

    if (isArea) {
      const x1 = parseXY(attrs.x1 ?? lastPoints?.[index]?.x1);
      const y1 = parseXY(attrs.y1 ?? lastPoints?.[index]?.y1);
      point.x1 = x1;
      point.y1 = y1;
    }

    if (defined === false) {
      point.defined = false;
    }

    return point;
  });
}

export function getLargeRectsPoints(
  items?: MarkElementItem[],
  includeOnePoint?: boolean,
  lastPoints?: Float32Array | number[]
): Float32Array | number[] {
  if (!items || !items.length || (items.length === 1 && includeOnePoint)) {
    return [];
  }
  const arr: Float32Array = new Float32Array(items.length * 4);

  items.forEach((item, index) => {
    const attrs = item.nextAttrs;
    const x = parseXY(attrs.x ?? lastPoints?.[index * 4]);
    const y = parseXY(attrs.y ?? lastPoints?.[index * 4 + 1]);
    const width = parseXY(attrs.width ?? lastPoints?.[index * 4 + 2]);
    const y1 = parseXY(attrs.y1 ?? lastPoints?.[index * 4 + 3]);
    arr[index * 4] = x;
    arr[index * 4 + 1] = y;
    arr[index * 4 + 2] = width;
    arr[index * 4 + 3] = y1 - y;
  });

  return arr;
}

export function getLargeSymbolsPoints(
  items?: MarkElementItem[],
  includeOnePoint?: boolean,
  lastPoints?: Float32Array | number[]
): Float32Array | number[] {
  if (!items || !items.length || (items.length === 1 && includeOnePoint)) {
    return [];
  }
  const arr: Float32Array = new Float32Array(items.length * 2);

  items.forEach((item, index) => {
    const attrs = item.nextAttrs;
    const x = parseXY(attrs.x ?? lastPoints?.[index * 2]);
    const y = parseXY(attrs.y ?? lastPoints?.[index * 2 + 1]);
    arr[index * 2] = x;
    arr[index * 2 + 1] = y;
  });

  return arr;
}

export function getGraphicBorderRadius(attrs: {
  cornerRadius?: number;
  cornerRadiusTopLeft?: number;
  cornerRadiusTopRight?: number;
  cornerRadiusBottomLeft?: number;
  cornerRadiusBottomRight?: number;
}) {
  let { cornerRadius, cornerRadiusTopLeft, cornerRadiusTopRight, cornerRadiusBottomRight, cornerRadiusBottomLeft } =
    attrs;

  cornerRadius = isNumber(cornerRadius) ? cornerRadius : 0;
  cornerRadiusTopLeft = isNumber(cornerRadiusTopLeft) ? cornerRadiusTopLeft : cornerRadius;
  cornerRadiusTopRight = isNumber(cornerRadiusTopRight) ? cornerRadiusTopRight : cornerRadius;
  cornerRadiusBottomRight = isNumber(cornerRadiusBottomRight) ? cornerRadiusBottomRight : cornerRadius;
  cornerRadiusBottomLeft = isNumber(cornerRadiusBottomLeft) ? cornerRadiusBottomLeft : cornerRadius;

  return [cornerRadiusTopLeft, cornerRadiusTopRight, cornerRadiusBottomRight, cornerRadiusBottomLeft];
}
