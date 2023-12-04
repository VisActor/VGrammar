import type { IGlyphMeta, IMark } from '../../types';
import type { IGraphic } from '@visactor/vrender/es/core';
// eslint-disable-next-line no-duplicate-imports

import { HOOK_EVENT, GrammarMarkType } from '../enums';
import { BridgeElementKey } from '../constants';
import { Factory } from '../../core/factory';
import { Logger } from '@visactor/vutils';

export const isMarkType = (type: string) => {
  return !!GrammarMarkType[type];
};

export function createGraphicItem(mark: IMark, markType: string, attrs: any = {}) {
  mark.emit(HOOK_EVENT.BEFORE_CREATE_VRENDER_MARK);

  const graphicItem: IGraphic = Factory.getGraphicType(markType)
    ? Factory.createGraphic(markType, attrs)
    : Factory.createGraphicComponent(markType, attrs, {
        skipDefault: (mark as any)?.spec?.skipTheme
      });

  if (!graphicItem) {
    const logger = Logger.getInstance();
    logger.error(`create ${markType} graphic failed!`);
  }

  mark.emit(HOOK_EVENT.AFTER_CREATE_VRENDER_MARK);
  return graphicItem;
}

export function createGlyphGraphicItem(mark: IMark, glyphMeta: IGlyphMeta, attrs: any = {}) {
  mark.emit(HOOK_EVENT.BEFORE_CREATE_VRENDER_MARK);
  if (!Factory.getGraphicType(GrammarMarkType.glyph)) {
    return;
  }
  const graphicItem = Factory.createGraphic(GrammarMarkType.glyph, attrs);
  const glyphMarks = glyphMeta.getMarks();
  const subGraphics: IGraphic[] = Object.keys(glyphMarks).map(name => {
    if (Factory.getGraphicType(glyphMarks[name])) {
      const graphic = Factory.createGraphic(glyphMarks[name]);
      if (graphic) {
        graphic.name = name;
        return graphic;
      }
    }
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
