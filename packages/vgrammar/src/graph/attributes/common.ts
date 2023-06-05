import { has, isBoolean } from '@visactor/vutils';
import { parseXY } from './helpers';

// FIXME: remove this logic after vRender deprecates fillColor&strokeColor channel
export const transformColor = (graphicAttributes: any) => {
  if (has(graphicAttributes, 'stroke')) {
    const strokeValue = graphicAttributes.stroke;
    if (strokeValue) {
      graphicAttributes.stroke = true;
      if (!isBoolean(strokeValue)) {
        graphicAttributes.strokeColor = graphicAttributes.strokeColor ?? strokeValue;
      }
    } else {
      graphicAttributes.stroke = false;
    }
  }

  if (has(graphicAttributes, 'fill')) {
    const fillValue = graphicAttributes.fill;
    if (fillValue) {
      graphicAttributes.fill = true;
      if (!isBoolean(fillValue)) {
        graphicAttributes.fillColor = graphicAttributes.fillColor ?? fillValue;
      }
    } else {
      graphicAttributes.fill = false;
    }
  }

  return graphicAttributes;
};

export const commonAttributes = ['fill', 'stroke', 'fillOpacity', 'x', 'y', 'dx', 'dy'];

export const transformCommonAttribute = (graphicAttributes: any, changedKey: string, nextAttrs: any) => {
  if (changedKey === 'stroke') {
    const strokeValue = nextAttrs.stroke;

    if (strokeValue) {
      graphicAttributes.stroke = true;
      if (!isBoolean(strokeValue)) {
        graphicAttributes.strokeColor = graphicAttributes.strokeColor ?? strokeValue;
      }
    } else {
      graphicAttributes.stroke = false;
    }

    return ['stroke'];
  }

  if (changedKey === 'fill') {
    const fillValue = nextAttrs.fill;

    if (fillValue) {
      graphicAttributes.fill = true;
      if (!isBoolean(fillValue)) {
        graphicAttributes.fillColor = graphicAttributes.fillColor ?? fillValue;
      }
    } else {
      graphicAttributes.fill = false;
    }

    return ['fill'];
  }

  if (changedKey === 'fillOpacity') {
    graphicAttributes.fillOpacity = nextAttrs.fillOpacity ?? 1;
    return ['fillOpacity'];
  }

  if (changedKey === 'x') {
    graphicAttributes.x = parseXY(nextAttrs.x);
    return ['x'];
  }

  if (changedKey === 'y') {
    graphicAttributes.y = parseXY(nextAttrs.y);
    return ['y'];
  }

  if (changedKey === 'dx') {
    graphicAttributes.dx = parseXY(nextAttrs.dx);
    return ['dx'];
  }

  if (changedKey === 'dy') {
    graphicAttributes.dy = parseXY(nextAttrs.dy);
    return ['dy'];
  }

  return [];
};
