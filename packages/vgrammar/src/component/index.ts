import { ComponentEnum } from '../graph';
import type { IComponent, IGroupMark, IView } from '../types';
import { Component } from '../view/component';
import { Axis } from './axis';
import { Grid } from './grid';
import { Legend } from './legend';
import { Crosshair } from './crosshair';
import { Slider } from './slider';
import { Label } from './label';
import { Datazoom } from './datazoom';
import { Player } from './player';
import { DimensionTooltip, Tooltip } from './tooltip';
import { Title } from './title';
import { Scrollbar } from './scrollbar';

export { generateLineAxisAttributes, generateCircleAxisAttributes } from './axis';
export { generateLineAxisGridAttributes, generateCircleAxisGridAttributes } from './grid';
export {
  generateDiscreteLegendAttributes,
  generateColorLegendAttributes,
  generateSizeLegendAttributes
} from './legend';
export {
  generateLineCrosshairAttributes,
  generateRectCrosshairAttributes,
  generateSectorCrosshairAttributes,
  generateCircleCrosshairAttributes,
  generatePolygonCrosshairAttributes
} from './crosshair';
export { generateSliderAttributes } from './slider';
export { generateLabelAttributes } from './label';
export { generateDatazoomAttributes } from './datazoom';
export { generateContinuousPlayerAttributes, generateDiscretePlayerAttributes } from './player';
export { generateTooltipAttributes } from './tooltip';
export { generateTitleAttributes } from './title';

export const createComponent = (
  view: IView,
  componentType: string,
  groupMark: IGroupMark,
  mode?: '2d' | '3d'
): IComponent => {
  switch (componentType) {
    case ComponentEnum.axis:
      return new Axis(view, groupMark, mode);
    case ComponentEnum.grid:
      return new Grid(view, groupMark, mode);
    case ComponentEnum.legend:
      return new Legend(view, groupMark);
    case ComponentEnum.crosshair:
      return new Crosshair(view, groupMark);
    case ComponentEnum.slider:
      return new Slider(view, groupMark);
    case ComponentEnum.label:
      return new Label(view, groupMark);
    case ComponentEnum.datazoom:
      return new Datazoom(view, groupMark);
    case ComponentEnum.player:
      return new Player(view, groupMark);
    case ComponentEnum.tooltip:
      return new Tooltip(view, groupMark);
    case ComponentEnum.dimensionTooltip:
      return new DimensionTooltip(view, groupMark);
    case ComponentEnum.title:
      return new Title(view, groupMark);
    case ComponentEnum.scrollbar:
      return new Scrollbar(view, groupMark);
  }
  return new Component(view, componentType, groupMark);
};
