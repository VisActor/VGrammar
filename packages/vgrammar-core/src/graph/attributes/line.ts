import type { IColor, IColorStop, ISegment } from '@visactor/vrender-core';
import type { IPointLike } from '@visactor/vutils';
import { isNil, isString } from '@visactor/vutils';
import type { IElement } from '../../types';

const isStopsEqual = (prev: IColorStop[], next: IColorStop[]) => {
  if (prev === next) {
    return true;
  }
  const prevLength = (prev && prev.length) ?? 0;
  const nextLength = (next && next.length) ?? 0;

  if (prevLength !== nextLength || prevLength === 0) {
    return false;
  }

  return prev.every((prevEntry, prevIndex) => {
    return (
      (!prevEntry && !next[prevIndex]) ||
      (prevEntry &&
        next[prevIndex] &&
        prevEntry.color === next[prevIndex].color &&
        prevEntry.offset === next[prevIndex].offset)
    );
  });
};

const isColorAttrEqual = (prev: IColor, next: IColor) => {
  if (prev === next) {
    return true;
  }

  if (typeof prev !== typeof next) {
    return false;
  }

  if (isString(prev)) {
    return false;
  }

  if (prev.gradient !== (next as any).gradient) {
    return false;
  }

  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  return prevKeys.every(key => {
    if (key === 'stops') {
      return isStopsEqual(prev[key], next[key]);
    }

    return prev[key] === next[key];
  });
};

const isLineDashEqual = (prev: number[], next: number[]) => {
  if (prev.length !== next.length) {
    return false;
  }

  if (prev.join('-') === next.join('-')) {
    return true;
  }

  return false;
};

const isSegmentAttrEqual = (prev: any, next: any, key: string) => {
  if (isNil(prev) && isNil(next)) {
    return true;
  }

  if (isNil(prev)) {
    return false;
  }

  if (isNil(next)) {
    return false;
  }

  if (key === 'lineDash') {
    return isLineDashEqual(prev, next);
  }

  if (key === 'stroke' || key === 'fill') {
    return isColorAttrEqual(prev, next);
  }

  return prev === next;
};

const fillAttrs = ['fill', 'fillOpacity', 'background', 'texture', 'texturePadding', 'textureSize', 'textureColor'];
const strokeAttrs = [
  'stroke',
  'strokeOpacity',
  'lineDash',
  'lineDashOffset',
  'lineCap',
  'lineJoin',
  'lineWidth',
  'miterLimit'
];
const areaAttrs = fillAttrs.concat(strokeAttrs);

/**
 * 生成用于渲染的点数组
 * @param {*} item
 * @returns {IPointLike[]}
 */
export function getLineSegmentConfigs(items: any[], points: any[], element?: IElement) {
  if (!items || items.length <= 1) {
    return null;
  }

  const checkAttributes = element?.mark?.markType === 'area' ? areaAttrs : strokeAttrs;

  const segments: any[] = [];
  let prevSegmentAttrs: any = null;

  items.forEach((item, index) => {
    if (
      !prevSegmentAttrs ||
      !checkAttributes.every(key => {
        return isSegmentAttrEqual(prevSegmentAttrs[key], item[key], key);
      })
    ) {
      if (segments.length) {
        segments[segments.length - 1].endIndex = index;
      }

      prevSegmentAttrs = item;
      segments.push({
        attrs: prevSegmentAttrs,
        startIndex: index
      });
    }
  });

  if (segments.length >= 2) {
    return segments.map(entry => {
      const res = parseCollectionMarkAttributes(entry.attrs) as any;

      res.points = points.slice(entry.startIndex, isNil(entry.endIndex) ? points.length : entry.endIndex);
      return res;
    });
  }

  return null;
}

/**
 * get the segments for connectNulls
 * @param {*} item
 * @returns {IPointLike[]}
 */
export function getConnectLineSegmentConfigs(items: any[], points: IPointLike[], element?: IElement) {
  if (!items || items.length <= 1) {
    return null;
  }
  const enableSegments = element ? element.mark.getSpec().enableSegments : false;
  let segments: { isConnect?: boolean; points: any[]; items: any[] }[] = [];
  let point: IPointLike = null;
  let isPrevDefined: boolean;
  let curSegment: { isConnect?: boolean; points: any[]; items: any[] };

  items.forEach((item, index) => {
    point = points[index];

    if (point && point.defined !== false) {
      if (!isPrevDefined) {
        // start a segment
        curSegment = {
          items: [],
          points: []
        };
        segments.push(curSegment);
      }

      curSegment.points.push(point);
      curSegment.items.push(item);

      if (isPrevDefined === false) {
        curSegment.isConnect = true;

        curSegment = {
          items: [],
          points: []
        };
        segments.push(curSegment);
      }

      isPrevDefined = true;
    } else {
      isPrevDefined = false;
    }
  });

  segments = segments.filter(seg => seg.points.length > 0);

  if (segments.length >= 2) {
    const res: ISegment[] = [];

    segments.forEach(entry => {
      if (entry.isConnect) {
        res.push({
          points: entry.points,
          isConnect: true
        } as ISegment);
        return;
      } else if (enableSegments) {
        const subSegments = getLineSegmentConfigs(entry.items, entry.points, element);

        if (subSegments) {
          subSegments.forEach(subSeg => {
            res.push(subSeg);
          });

          return;
        }
      }

      const seg = parseCollectionMarkAttributes(entry.items[0]) as any;
      seg.points = entry.points;

      res.push(seg);
    });

    return res;
  } else if (enableSegments) {
    return getLineSegmentConfigs(items, points, element);
  }

  return null;
}

export function getLinePointsFromSegments(segments: any[]) {
  if (!segments) {
    return null;
  }
  return segments.reduce((points, segment) => {
    return points.concat(segment.points);
  }, []);
}

export function parseCollectionMarkAttributes(itemNextAttrs: any) {
  const result = {};

  if (!itemNextAttrs) {
    return result;
  }

  Object.keys(itemNextAttrs).forEach(key => {
    if (
      key === 'x' ||
      key === 'y' ||
      key === 'x1' ||
      key === 'y1' ||
      key === 'defined' ||
      key === 'size' ||
      key === 'width' ||
      key === 'height' ||
      key === 'context'
    ) {
      return;
    }
    result[key] = itemNextAttrs[key];
  });

  return result;
}
