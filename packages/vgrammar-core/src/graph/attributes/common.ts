export const commonAttributes = ['fillOpacity'];

export const transformCommonAttribute = (graphicAttributes: any, changedKey: string, nextAttrs: any) => {
  if (changedKey === 'fillOpacity') {
    graphicAttributes.fillOpacity = nextAttrs.fillOpacity ?? 1;
    return ['fillOpacity'];
  }

  return [];
};
