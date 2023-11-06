import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isValidNumber } from '@visactor/vutils';
import type { MarkElementItem, MarkType } from '../../types';
import { GrammarMarkType } from '../enums';

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
    const x = attrs.x ?? lastPoints?.[index]?.x;
    const y = attrs.y ?? lastPoints?.[index]?.y;
    const defined = attrs.defined ?? lastPoints?.[index]?.defined;
    const point: IPointLike = { x, y, context: item.key };

    if (isArea) {
      const x1 = attrs.x1 ?? lastPoints?.[index]?.x1;
      const y1 = attrs.y1 ?? lastPoints?.[index]?.y1;
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
    const x = attrs.x ?? lastPoints?.[index * 4];
    const y = attrs.y ?? lastPoints?.[index * 4 + 1];
    const width = attrs.width ?? lastPoints?.[index * 4 + 2];
    const y1 = attrs.y1 ?? lastPoints?.[index * 4 + 3];
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
    const x = attrs.x ?? lastPoints?.[index * 2];
    const y = attrs.y ?? lastPoints?.[index * 2 + 1];
    arr[index * 2] = x;
    arr[index * 2 + 1] = y;
  });

  return arr;
}

export function isPositionOrSizeChannel(type: string, channel: string) {
  if (['x', 'y', 'dx', 'dy'].includes(channel)) {
    return true;
  }

  switch (type) {
    case GrammarMarkType.arc:
      return ['innerRadius', 'outerRadius', 'startAngle', 'endAngle'].includes(channel);
    case GrammarMarkType.group:
    case GrammarMarkType.rect:
    case GrammarMarkType.image:
      return ['width', 'height', 'y1'].includes(channel);
    case GrammarMarkType.path:
    case GrammarMarkType.shape:
      return ['path', 'customPath'].includes(channel);
    case GrammarMarkType.line:
      return channel === 'defined';
    case GrammarMarkType.area:
      return ['x1', 'y1', 'defined'].includes(channel);
    case GrammarMarkType.rule:
      return ['x1', 'y1'].includes(channel);
    case GrammarMarkType.symbol:
      return channel === 'size';
    case GrammarMarkType.polygon:
      return channel === 'points';
    case GrammarMarkType.text:
      return channel === 'text';
  }

  return false;
}

export function isPointsMarkType(markType: MarkType): boolean {
  return (
    [GrammarMarkType.line, GrammarMarkType.area, GrammarMarkType.largeRects, GrammarMarkType.largeSymbols] as MarkType[]
  ).includes(markType);
}
