import { parseXY } from './helpers';

export const commonAttributes = ['fillOpacity', 'x', 'y', 'dx', 'dy'];

export const transformCommonAttribute = (graphicAttributes: any, changedKey: string, nextAttrs: any) => {
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
