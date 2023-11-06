export const commonAttributes = ['fillOpacity', 'x', 'y', 'dx', 'dy'];

export const transformCommonAttribute = (graphicAttributes: any, changedKey: string, nextAttrs: any) => {
  if (changedKey === 'fillOpacity') {
    graphicAttributes.fillOpacity = nextAttrs.fillOpacity ?? 1;
    return ['fillOpacity'];
  }

  return [];
};
