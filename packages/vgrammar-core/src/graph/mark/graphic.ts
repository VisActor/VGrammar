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
  registerGlyph,
  registerShadowRoot
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
import {
  registerRectDataLabel,
  registerLineDataLabel,
  registerArcDataLabel,
  registerSymbolDataLabel
} from '@visactor/vrender-components';

export const registerCircleGraphic = () => {
  registerShadowRoot();
  registerCircle();
  Factory.registerGraphic(GrammarMarkType.circle, createCircle);
};

export const registerArcGraphic = () => {
  registerShadowRoot();
  registerArc();
  Factory.registerGraphic(GrammarMarkType.arc, createArc);
  registerArcDataLabel();
};

export const registerArc3dGraphic = () => {
  registerShadowRoot();
  registerArc3d();
  Factory.registerGraphic(GrammarMarkType.arc3d, createArc3d);
};

export const registerPyramid3dGraphic = () => {
  registerShadowRoot();
  registerPyramid3d();
  Factory.registerGraphic(GrammarMarkType.pyramid3d, createPyramid3d);
};

export const registerAreaGraphic = () => {
  registerShadowRoot();
  registerArea();
  Factory.registerGraphic(GrammarMarkType.area, createArea);
  registerLineDataLabel();
  registerSymbolDataLabel();
};

export const registerGroupGraphic = () => {
  registerShadowRoot();
  registerGroup();
  Factory.registerGraphic(GrammarMarkType.group, createGroup);
};

export const registerImageGraphic = () => {
  registerShadowRoot();
  registerImage();
  Factory.registerGraphic(GrammarMarkType.image, createImage);
};

export const registerLineGraphic = () => {
  registerShadowRoot();
  registerLine();
  registerLineDataLabel();
  registerSymbolDataLabel();
  Factory.registerGraphic(GrammarMarkType.line, createLine);
};

export const registerPathGraphic = () => {
  registerShadowRoot();
  registerPath();
  Factory.registerGraphic(GrammarMarkType.path, createPath);
};

export const registerRectGraphic = () => {
  registerShadowRoot();
  registerRect();
  registerRectDataLabel();
  Factory.registerGraphic(GrammarMarkType.rect, createRect);
};

export const registerRect3dGraphic = () => {
  registerShadowRoot();
  registerRect3d();
  Factory.registerGraphic(GrammarMarkType.rect3d, createRect3d);
};

export const registerRuleGraphic = () => {
  registerShadowRoot();
  registerLine();
  Factory.registerGraphic(GrammarMarkType.rule, createLine);
};

export const registerShapeGraphic = () => {
  registerShadowRoot();
  registerPath();
  Factory.registerGraphic(GrammarMarkType.shape, createPath);
};

export const registerSymbolGraphic = () => {
  registerShadowRoot();
  registerSymbol();
  registerSymbolDataLabel();
  Factory.registerGraphic(GrammarMarkType.symbol, createSymbol);
};

export const registerTextGraphic = () => {
  registerShadowRoot();
  registerText();
  registerRichtext();
  Factory.registerGraphic(GrammarMarkType.text, createText);
};

export const registerPolygonGraphic = () => {
  registerShadowRoot();
  registerPolygon();
  Factory.registerGraphic(GrammarMarkType.polygon, createPolygon);
};

export const registerRichTextGraphic = () => {
  registerShadowRoot();
  registerRichtext();
  Factory.registerGraphic(GrammarMarkType.richtext, createRichText);
};

export const registerCellGraphic = () => {
  registerShadowRoot();
  registerSymbol();
  registerSymbolDataLabel();
  Factory.registerGraphic(GrammarMarkType.cell, createSymbol);
};

export const registerIntervalGraphic = () => {
  registerShadowRoot();
  registerRect();
  registerRectDataLabel();
  registerArc();
  registerArcDataLabel();
  Factory.registerGraphic(GrammarMarkType.interval, createRect);
};

export const registerGlyphGraphic = () => {
  registerShadowRoot();
  registerGlyph();
  Factory.registerGraphic(GrammarMarkType.glyph, createGlyph);
};

export const registerLargeRectsGraphic = () => {
  registerShadowRoot();
  registerPath();
  Factory.registerGraphic(GrammarMarkType.largeRects, (attrs: any) => {
    return new LargeRects(attrs) as unknown as IGraphic;
  });
};

export const registerLargeSymbolsGraphic = () => {
  registerShadowRoot();
  registerPath();
  Factory.registerGraphic(GrammarMarkType.largeSymbols, (attrs: any) => {
    return new LargeSymbols(attrs) as unknown as IGraphic;
  });
};
