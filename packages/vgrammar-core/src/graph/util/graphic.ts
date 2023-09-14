import type { IGlyphMeta, IMark } from '../../types';
import type { IGraphic } from '@visactor/vrender';
// eslint-disable-next-line no-duplicate-imports
import {
  createArc,
  createArea,
  createGroup,
  createImage,
  createRect3d,
  createLine,
  createPath,
  createRect,
  createSymbol,
  createRichText,
  createText,
  createPolygon,
  createGlyph,
  createArc3d,
  createPyramid3d,
  createCircle
} from '@visactor/vrender';
import { HOOK_EVENT, GrammarMarkType } from '../enums';
import { BridgeElementKey } from '../constants';
import { LargeRects } from '../mark/large-rects';
import { LargeSymbols } from '../mark/large-symbols';
import { Factory } from '../../core/factory';

const itemCreator = {
  circle: createCircle,
  arc: createArc,
  arc3d: createArc3d,
  pyramid3d: createPyramid3d,
  area: createArea,
  group: createGroup,
  image: createImage,
  rect3d: createRect3d,
  line: createLine,
  path: createPath,
  rect: createRect,
  rule: createLine,
  shape: createPath,
  symbol: createSymbol,
  text: createText,
  richtext: createRichText,
  polygon: createPolygon,
  cell: createSymbol,
  interval: createRect
};

export const isMarkType = (type: string) => {
  return !!itemCreator[type];
};

export function createGraphicItem(mark: IMark, markType: string, attrs: any = {}) {
  mark.emit(HOOK_EVENT.BEFORE_CREATE_VRENDER_MARK);

  if (markType === GrammarMarkType.largeRects) {
    return new LargeRects(attrs);
  } else if (markType === GrammarMarkType.largeSymbols) {
    return new LargeSymbols(attrs);
  }

  const graphicItem: IGraphic = itemCreator[markType]
    ? itemCreator[markType](attrs)
    : Factory.createGraphicComponent(markType, attrs);

  mark.emit(HOOK_EVENT.AFTER_CREATE_VRENDER_MARK);
  return graphicItem;
}

export function createGlyphGraphicItem(mark: IMark, glyphMeta: IGlyphMeta, attrs: any = {}) {
  mark.emit(HOOK_EVENT.BEFORE_CREATE_VRENDER_MARK);

  const graphicItem = createGlyph(attrs);
  const glyphMarks = glyphMeta.getMarks();
  const subGraphics: IGraphic[] = Object.keys(glyphMarks).map(name => {
    const graphic = itemCreator[glyphMarks[name]]();
    graphic.name = name;
    return graphic;
  });
  graphicItem.setSubGraphic(subGraphics);

  mark.emit(HOOK_EVENT.AFTER_CREATE_VRENDER_MARK);
  return graphicItem;
}

export const removeGraphicItem = (graphicItem: IGraphic) => {
  if (graphicItem) {
    graphicItem[BridgeElementKey] = null;
    graphicItem.release();
    if (graphicItem.parent) {
      graphicItem.parent.removeChild(graphicItem);
    }
  }
};

export const getMarkTypeOfLarge = (markType: string) => {
  if (markType === GrammarMarkType.rect) {
    return GrammarMarkType.largeRects;
  }

  if (markType === GrammarMarkType.symbol) {
    return GrammarMarkType.largeSymbols;
  }

  return markType;
};
