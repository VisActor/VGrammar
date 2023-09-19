import { Factory } from '../core/factory';
import { ElementActive } from './element-active';
import { ElementSelect } from './element-select';
import { ElementHighlight } from './element-highlight';
import { ElementHighlightByKey } from './element-highlight-by-key';
import { ElementHighlightByGroup } from './element-highlight-by-group';
import { ElementActiveByLegend } from './element-active-by-legend';
import { ElementHighlightByLegend } from './element-highlight-by-legend';

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
