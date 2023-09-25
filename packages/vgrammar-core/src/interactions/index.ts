import { Factory } from '../core/factory';
import { ElementActive } from './element-active';
import { ElementSelect } from './element-select';
import { ElementHighlight } from './element-highlight';
import { ElementHighlightByKey } from './element-highlight-by-key';
import { ElementHighlightByGroup } from './element-highlight-by-group';
import { ElementActiveByLegend } from './element-active-by-legend';
import { ElementHighlightByLegend } from './element-highlight-by-legend';
import { ElementHighlightByName } from './element-highlight-by-name';
import { BrushHighlight } from './brush-highlight';
import { BrushActive } from './brush-active';
import { BrushFilter } from './brush-filter';
import { LegendFilter } from './legend-filter';
import { DatazoomFilter } from './datazoom-filter';
import { SliderFilter } from './slider-filter';
import { PlayerFilter } from './player-filter';
import { ScrollbarFilter } from './scrollbar-filter';
import { DrillDown } from './drill-down';
import { RollUp } from './roll-up';
import { Tooltip } from './tooltip';
import { DimensionTooltip } from './dimension-tooltip';
import { Crosshair } from './crosshair';

export const registerElementActive = () => {
  Factory.registerInteraction(ElementActive.type, ElementActive);
};

export const registerElementSelect = () => {
  Factory.registerInteraction(ElementSelect.type, ElementSelect);
};

export const registerElementHighlight = () => {
  Factory.registerInteraction(ElementHighlight.type, ElementHighlight);
};

export const registerElementHighlightByKey = () => {
  Factory.registerInteraction(ElementHighlightByKey.type, ElementHighlightByKey);
};

export const registerElementHighlightByGroup = () => {
  Factory.registerInteraction(ElementHighlightByGroup.type, ElementHighlightByGroup);
};

export const registerElementActiveByLegend = () => {
  Factory.registerInteraction(ElementActiveByLegend.type, ElementActiveByLegend);
};

export const registerElementHighlightByLegend = () => {
  Factory.registerInteraction(ElementHighlightByLegend.type, ElementHighlightByLegend);
};

export const registerElementHighlightByName = () => {
  Factory.registerInteraction(ElementHighlightByName.type, ElementHighlightByName);
};

export const registerBrushHighlight = () => {
  Factory.registerInteraction(BrushHighlight.type, BrushHighlight);
};

export const registerBrushActive = () => {
  Factory.registerInteraction(BrushActive.type, BrushActive);
};

export const registerBrushFilter = () => {
  Factory.registerInteraction(BrushFilter.type, BrushFilter);
};

export const registerLegendFilter = () => {
  Factory.registerInteraction(LegendFilter.type, LegendFilter);
};

export const registerDatazoomFilter = () => {
  Factory.registerInteraction(DatazoomFilter.type, DatazoomFilter);
};

export const registerSliderFilter = () => {
  Factory.registerInteraction(SliderFilter.type, SliderFilter);
};

export const registerPlayerFilter = () => {
  Factory.registerInteraction(PlayerFilter.type, PlayerFilter);
};

export const registerScrollbarFilter = () => {
  Factory.registerInteraction(ScrollbarFilter.type, ScrollbarFilter);
};

export const registerDrillDown = () => {
  Factory.registerInteraction(DrillDown.type, DrillDown);
};

export const registerRollUp = () => {
  Factory.registerInteraction(RollUp.type, RollUp);
};

export const registerTooltipPopover = () => {
  Factory.registerInteraction(Tooltip.type, Tooltip);
};

export const registerDimensionTooltipPopover = () => {
  Factory.registerInteraction(DimensionTooltip.type, DimensionTooltip);
};

export const registerCrosshairPopover = () => {
  Factory.registerInteraction(Crosshair.type, Crosshair);
};
