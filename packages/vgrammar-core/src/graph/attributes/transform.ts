import { has, isNil, isPlainObject, isString, isValidNumber } from '@visactor/vutils';
import type { IElement, IGlyphElement } from '../../types/element';
import type { AttributeTransform, MarkType } from '../../types/mark';
import { GrammarMarkType } from '../enums';
import { getRulePoints } from './helpers';
import { commonAttributes, transformCommonAttribute } from './common';

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
        } else {
          graphicAttributes.fill = nextAttrs.fill;
          graphicAttributes.background = nextAttrs.background;
        }
      }
    }
  ],
  [GrammarMarkType.richtext]: [
    {
      channels: ['text', 'textConfig'],
      transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
        graphicAttributes.text = null;

        if (nextAttrs.text?.type === 'rich') {
          graphicAttributes.textConfig = nextAttrs.text.text;
        } else if (nextAttrs.textConfig?.type === 'html') {
          graphicAttributes.html = {
            dom: nextAttrs.textConfig.text,
            width: nextAttrs.width,
            height: nextAttrs.height ?? nextAttrs.fontSize,
            anchorType: 'position'
          };
          graphicAttributes.text = '';
        } else if (nextAttrs.textConfig?.type === 'rich') {
          graphicAttributes.textConfig = nextAttrs.textConfig.text;
        } else {
          graphicAttributes.textConfig = nextAttrs.textConfig;
        }
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
  const changedKeys = nextAttrs ? Object.keys(nextAttrs) : [];
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
