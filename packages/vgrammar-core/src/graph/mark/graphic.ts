import type { IGraphic } from '@visactor/vrender-core';
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
} from '@visactor/vrender-core';
import { Factory } from '../../core/factory';
import { GrammarMarkType } from '../enums';
import { LargeRects } from './large-rects';
import { LargeSymbols } from './large-symbols';

export const registerCircleGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.circle, createCircle);
};

export const registerArcGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.arc, createArc);
};

export const registerArc3dGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.arc3d, createArc3d);
};

export const registerPyramid3dGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.pyramid3d, createPyramid3d);
};

export const registerAreaGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.area, createArea);
};

export const registerGroupGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.group, createGroup);
};

export const registerImageGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.image, createImage);
};

export const registerRect3dGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.rect3d, createRect3d);
};

export const registerLineGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.line, createLine);
};

export const registerPathGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.path, createPath);
};

export const registerRectGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.rect, createRect);
};

export const registerRuleGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.rule, createLine);
};

export const registerShapeGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.shape, createPath);
};

export const registerSymbolGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.symbol, createSymbol);
};

export const registerTextGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.text, createText);
};

export const registerPolygonGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.polygon, createPolygon);
};

export const registerRichTextGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.richtext, createRichText);
};

export const registerCellGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.cell, createSymbol);
};

export const registerIntervalGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.interval, createRect);
};

export const registerGlyphGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.glyph, createGlyph);
};

export const registerLargeRectsGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.largeRects, (attrs: any) => {
    return new LargeRects(attrs) as unknown as IGraphic;
  });
};

export const registerLargeSymbolsGraphic = () => {
  Factory.registerGraphic(GrammarMarkType.largeSymbols, (attrs: any) => {
    return new LargeSymbols(attrs) as unknown as IGraphic;
  });
};
