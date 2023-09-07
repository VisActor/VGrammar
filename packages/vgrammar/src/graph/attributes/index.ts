import { has, isNil, isPlainObject, isString, isValidNumber } from '@visactor/vutils';
import type { IColor, IColorStop } from '@visactor/vrender';
import { transformCommonAttribute, commonAttributes } from './common';
import { getRulePoints } from './helpers';
import { GrammarMarkType } from '../enums';
import type { AttributeTransform, IElement, IGlyphElement, MarkType } from '../../types';

export { transformCommonAttribute };

export function isPointsMarkType(markType: MarkType): boolean {
  return (
    [GrammarMarkType.line, GrammarMarkType.area, GrammarMarkType.largeRects, GrammarMarkType.largeSymbols] as MarkType[]
  ).includes(markType);
}

function storeOriginAttributes(
  name: string,
  channels: string[],
  graphicAttributes: any,
  nextAttrs: any,
  element: IElement,
  markName: string
): Record<string, any> {
  const prevStoredAttrs = (element as IGlyphElement).getGraphicAttribute(name, false, markName) ?? {};
  const storedAttrs = {};
  channels.forEach(channel => {
    storedAttrs[channel] = nextAttrs[channel] ?? prevStoredAttrs[channel];
  });
  graphicAttributes[name] = storedAttrs;
  return storedAttrs;
}

export const transformsByType: Record<string, AttributeTransform[]> = {
  [GrammarMarkType.largeRects]: [
    {
      channels: ['x', 'y', 'y1', 'x1', 'width', 'height'],
      transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
        graphicAttributes.x = 0;
        graphicAttributes.y = 0;
      }
    }
  ],
  [GrammarMarkType.largeSymbols]: [
    {
      channels: ['x', 'y', 'size'],
      transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
        graphicAttributes.x = 0;
        graphicAttributes.y = 0;
      }
    }
  ],
  [GrammarMarkType.area]: [
    {
      channels: ['x', 'y', 'x1', 'y1'],
      transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
        graphicAttributes.x = 0;
        graphicAttributes.y = 0;
        graphicAttributes.x1 = 0;
        graphicAttributes.y1 = 0;
      }
    }
  ],
  [GrammarMarkType.line]: [
    {
      channels: ['x', 'y', 'defined', 'enableSegments'],
      transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
        graphicAttributes.x = 0;
        graphicAttributes.y = 0;
      }
    }
  ],
  [GrammarMarkType.rect]: [
    {
      channels: ['x', 'y', 'x1', 'y1', 'width', 'height'],
      transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
        // width
        if (isValidNumber(nextAttrs.width) || (!isValidNumber(nextAttrs.x1) && isValidNumber(storedAttrs.width))) {
          graphicAttributes.x = Math.min(storedAttrs.x ?? 0, storedAttrs.x1 ?? Infinity);
          graphicAttributes.width = storedAttrs.width;
        } else if (isValidNumber(nextAttrs.x1) || (!isValidNumber(nextAttrs.width) && isValidNumber(storedAttrs.x1))) {
          graphicAttributes.x = Math.min(storedAttrs.x, storedAttrs.x1);
          graphicAttributes.width = Math.abs(storedAttrs.x1 - storedAttrs.x);
        } else {
          graphicAttributes.x = Math.min(storedAttrs.x ?? 0, storedAttrs.x1 ?? Infinity);
          graphicAttributes.width = storedAttrs.width;
        }

        // height
        if (isValidNumber(nextAttrs.height) || (!isValidNumber(nextAttrs.y1) && isValidNumber(storedAttrs.height))) {
          graphicAttributes.y = Math.min(storedAttrs.y ?? 0, storedAttrs.y1 ?? Infinity);
          graphicAttributes.height = storedAttrs.height;
        } else if (isValidNumber(nextAttrs.y1) || (!isValidNumber(nextAttrs.height) && isValidNumber(storedAttrs.y1))) {
          graphicAttributes.y = Math.min(storedAttrs.y, storedAttrs.y1);
          graphicAttributes.height = Math.abs(storedAttrs.y1 - storedAttrs.y);
        } else {
          graphicAttributes.y = Math.min(storedAttrs.y ?? 0, storedAttrs.y1 ?? Infinity);
          graphicAttributes.height = storedAttrs.height;
        }
      },
      storedAttrs: 'sizeAttrs'
    }
  ],
  rect3d: [
    {
      channels: ['x', 'y', 'z', 'x1', 'y1', 'width', 'height', 'length'],
      transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
        // width
        if (isValidNumber(nextAttrs.width) || (!isValidNumber(nextAttrs.x1) && isValidNumber(storedAttrs.width))) {
          graphicAttributes.x = Math.min(storedAttrs.x ?? 0, storedAttrs.x1 ?? Infinity);
          graphicAttributes.width = storedAttrs.width;
        } else if (isValidNumber(nextAttrs.x1) || (!isValidNumber(nextAttrs.width) && isValidNumber(storedAttrs.x1))) {
          graphicAttributes.x = Math.min(storedAttrs.x, storedAttrs.x1);
          graphicAttributes.width = Math.abs(storedAttrs.x1 - storedAttrs.x);
        } else {
          graphicAttributes.x = Math.min(storedAttrs.x ?? 0, storedAttrs.x1 ?? Infinity);
          graphicAttributes.width = storedAttrs.width;
        }

        // height
        if (isValidNumber(nextAttrs.height) || (!isValidNumber(nextAttrs.y1) && isValidNumber(storedAttrs.height))) {
          graphicAttributes.y = Math.min(storedAttrs.y ?? 0, storedAttrs.y1 ?? Infinity);
          graphicAttributes.height = storedAttrs.height;
        } else if (isValidNumber(nextAttrs.y1) || (!isValidNumber(nextAttrs.height) && isValidNumber(storedAttrs.y1))) {
          graphicAttributes.y = Math.min(storedAttrs.y, storedAttrs.y1);
          graphicAttributes.height = Math.abs(storedAttrs.y1 - storedAttrs.y);
        } else {
          graphicAttributes.y = Math.min(storedAttrs.y ?? 0, storedAttrs.y1 ?? Infinity);
          graphicAttributes.height = storedAttrs.height;
        }

        // length
        if (isValidNumber(nextAttrs.length) || (!isValidNumber(nextAttrs.z1) && isValidNumber(storedAttrs.length))) {
          graphicAttributes.z = Math.min(storedAttrs.z ?? 0, storedAttrs.z1 ?? Infinity);
          graphicAttributes.length = storedAttrs.length;
        } else if (isValidNumber(nextAttrs.z1) || (!isValidNumber(nextAttrs.length) && isValidNumber(storedAttrs.z1))) {
          graphicAttributes.z = Math.min(storedAttrs.z, storedAttrs.z1);
          graphicAttributes.length = Math.abs(storedAttrs.z1 - storedAttrs.z);
        } else {
          graphicAttributes.z = Math.min(storedAttrs.z ?? 0, storedAttrs.z1 ?? Infinity);
          graphicAttributes.length = storedAttrs.length;
        }
      },
      storedAttrs: 'sizeAttrs'
    }
  ],
  [GrammarMarkType.text]: [
    {
      channels: ['text', 'limit', 'autoLimit', 'maxLineWidth'],
      transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
        const limit = storedAttrs.limit ?? Infinity;
        const autoLimit = storedAttrs.autoLimit ?? Infinity;
        const maxWidth = Math.min(limit, autoLimit);
        const isTextConfig = isPlainObject(storedAttrs.text) && !isNil(storedAttrs.text.text);
        const text = isTextConfig ? storedAttrs.text.text : storedAttrs.text;

        if (Array.isArray(text)) {
          graphicAttributes.maxLineWidth = maxWidth === Infinity ? storedAttrs.maxLineWidth : maxWidth;
        } else {
          graphicAttributes.maxLineWidth = maxWidth === Infinity ? storedAttrs.maxLineWidth : maxWidth;
        }

        if (isTextConfig) {
          if (storedAttrs.text.type === 'html') {
            graphicAttributes.html = {
              dom: text,
              width: nextAttrs.width ?? maxWidth,
              height: nextAttrs.height ?? nextAttrs.fontSize,
              anchorType: 'position'
            };
            graphicAttributes.text = '';
          } else if (storedAttrs.text.type === 'rich') {
            graphicAttributes.textConfig = text;
          } else {
            graphicAttributes.text = text;
          }
        } else {
          graphicAttributes.text = text;
        }
      },
      storedAttrs: 'limitAttrs'
    }
  ],
  [GrammarMarkType.rule]: [
    {
      channels: ['x', 'y', 'x1', 'y1'],
      transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
        const points = getRulePoints(storedAttrs);
        graphicAttributes.points = points;
        graphicAttributes.x = 0;
        graphicAttributes.y = 0;
      },
      storedAttrs: 'pointAttrs'
    }
  ],
  [GrammarMarkType.symbol]: [
    {
      channels: ['shape', 'symbolType'],
      transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
        graphicAttributes.symbolType = nextAttrs.shape ?? nextAttrs.symbolType;
      }
    },
    {
      channels: ['image', 'fill', 'background'],
      transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
        if (nextAttrs.image) {
          graphicAttributes.background = nextAttrs.image;
          graphicAttributes.fill = false;
        } else if (storedAttrs.image) {
          graphicAttributes.background = storedAttrs.image;
          graphicAttributes.fill = false;
        } else {
          graphicAttributes.fill = storedAttrs.fill;
          graphicAttributes.background = storedAttrs.background;
        }
      },
      storedAttrs: 'imageAttrs'
    }
  ],
  [GrammarMarkType.richtext]: [
    {
      channels: ['text', 'textConfig'],
      transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
        graphicAttributes.text = null;
        graphicAttributes.textConfig = nextAttrs.text?.type === 'rich' ? nextAttrs.text.text : nextAttrs.textConfig;
      }
    }
  ]
};

export function cloneTransformAttributes(markType: MarkType, attributes: any) {
  const transforms = transformsByType[markType] ?? [];
  return transforms.reduce((clonedAttributes, transform) => {
    transform.channels.forEach(channel => {
      if (has(attributes, channel)) {
        clonedAttributes[channel] = attributes[channel];
      }
    });
    return clonedAttributes;
  }, {} as any);
}

export const transformAttributes = (
  markType: MarkType | AttributeTransform[],
  nextAttrs: any,
  element: IElement,
  markName?: string
) => {
  const graphicAttributes = {};
  const changedKeys = Object.keys(nextAttrs);
  const transforms: AttributeTransform[] = isString(markType)
    ? transformsByType[markType]
    : (markType as AttributeTransform[]);

  if (transforms?.length) {
    const tags: boolean[] = [];

    changedKeys.forEach(key => {
      let isTransformed = false;

      transforms.forEach((transform, index) => {
        if (transform.channels.includes(key)) {
          if (!tags[index]) {
            if (transform.storedAttrs) {
              const storedAttrs = storeOriginAttributes(
                transform.storedAttrs,
                transform.channels,
                graphicAttributes,
                nextAttrs,
                element,
                markName
              );
              transform.transform(graphicAttributes, nextAttrs, storedAttrs);
            } else {
              transform.transform(graphicAttributes, nextAttrs, null);
            }
          }
          // 记录一下，不重复处理
          tags[index] = true;
          isTransformed = true;
        }
      });

      if (!isTransformed) {
        if (commonAttributes.includes(key)) {
          transformCommonAttribute(graphicAttributes, key, nextAttrs);
        } else {
          graphicAttributes[key] = nextAttrs[key];
        }
      }
    });
  } else {
    changedKeys.forEach(key => {
      if (commonAttributes.includes(key)) {
        transformCommonAttribute(graphicAttributes, key, nextAttrs);
      } else {
        graphicAttributes[key] = nextAttrs[key];
      }
    });
  }

  return graphicAttributes;
};

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
      const res = transformAttributes(GrammarMarkType.line, entry.attrs, element) as any;

      res.points = points.slice(entry.startIndex, isNil(entry.endIndex) ? points.length : entry.endIndex);
      return res;
    });
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
