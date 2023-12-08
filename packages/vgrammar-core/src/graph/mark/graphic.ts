import { Factory } from '../../core/factory';
import { GrammarMarkType } from '../enums';
import { LargeRects } from './large-rects';
import { LargeSymbols } from './large-symbols';
import type { IGraphic } from '@visactor/vrender-core';
import {
  registerCircle,
  registerArc,
  registerArc3d,
  registerPyramid3d,
  registerArea,
  registerGroup,
  registerImage,
  registerRect3d,
  registerLine,
  registerPath,
  registerRect,
  registerSymbol,
  registerText,
  registerPolygon,
  registerRichtext,
  registerGlyph
} from '@visactor/vrender-kits';
import {
  createArc,
  createCircle,
  createArc3d,
  createPyramid3d,
  createArea,
  createGroup,
  createImage,
  createRect3d,
  createLine,
  createPath,
  createRect,
  createSymbol,
  createText,
  createPolygon,
  createRichText,
  createGlyph
} from '@visactor/vrender-core';

export const registerCircleGraphic = () => {
  registerCircle();
  Factory.registerGraphic(GrammarMarkType.circle, createCircle);
};

export const registerArcGraphic = () => {
  registerArc();
  Factory.registerGraphic(GrammarMarkType.arc, createArc);
};

export const registerArc3dGraphic = () => {
  registerArc3d();
  Factory.registerGraphic(GrammarMarkType.arc3d, createArc3d);
};

export const registerPyramid3dGraphic = () => {
  registerPyramid3d();
  Factory.registerGraphic(GrammarMarkType.pyramid3d, createPyramid3d);
};

export const registerAreaGraphic = () => {
  registerArea();
  Factory.registerGraphic(GrammarMarkType.area, createArea);
};

export const registerGroupGraphic = () => {
  registerGroup();
  Factory.registerGraphic(GrammarMarkType.group, createGroup);
};

export const registerImageGraphic = () => {
  registerImage();
  Factory.registerGraphic(GrammarMarkType.image, createImage);
};

export const registerLineGraphic = () => {
  registerLine();
  Factory.registerGraphic(GrammarMarkType.line, createLine);
};

export const registerPathGraphic = () => {
  registerPath();
  Factory.registerGraphic(GrammarMarkType.path, createPath);
};

export const registerRectGraphic = () => {
  registerRect();
  Factory.registerGraphic(GrammarMarkType.rect, createRect);
};

export const registerRect3dGraphic = () => {
  registerRect3d();
  Factory.registerGraphic(GrammarMarkType.rect3d, createRect3d);
};

export const registerRuleGraphic = () => {
  registerLine();
  Factory.registerGraphic(GrammarMarkType.rule, createLine);
};

export const registerShapeGraphic = () => {
  registerPath();
  Factory.registerGraphic(GrammarMarkType.shape, createPath);
};

export const registerSymbolGraphic = () => {
  registerSymbol();
  Factory.registerGraphic(GrammarMarkType.symbol, createSymbol);
};

export const registerTextGraphic = () => {
  registerText();
  Factory.registerGraphic(GrammarMarkType.text, createText);
};

export const registerPolygonGraphic = () => {
  registerPolygon();
  Factory.registerGraphic(GrammarMarkType.polygon, createPolygon);
};

export const registerRichTextGraphic = () => {
  registerRichtext();
  Factory.registerGraphic(GrammarMarkType.richtext, createRichText);
};

export const registerCellGraphic = () => {
  registerSymbol();
  Factory.registerGraphic(GrammarMarkType.cell, createSymbol);
};

export const registerIntervalGraphic = () => {
  registerRect();
  Factory.registerGraphic(GrammarMarkType.interval, createRect);
};

export const registerGlyphGraphic = () => {
  registerGlyph();
  Factory.registerGraphic(GrammarMarkType.glyph, createGlyph);
};

export const registerLargeRectsGraphic = () => {
  registerPath();
  Factory.registerGraphic(GrammarMarkType.largeRects, (attrs: any) => {
    return new LargeRects(attrs) as unknown as IGraphic;
  });
};

export const registerLargeSymbolsGraphic = () => {
  registerPath();
  Factory.registerGraphic(GrammarMarkType.largeSymbols, (attrs: any) => {
    return new LargeSymbols(attrs) as unknown as IGraphic;
  });
};
