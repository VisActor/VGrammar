import { Factory } from '../core/factory';
import { ElementActive } from './element-active';
import { ElementSelect } from './element-select';

export const registerElementActive = () => {
  Factory.registerInteraction('element-active', ElementActive);
};

export const registerElementSelect = () => {
  Factory.registerInteraction('element-select', ElementSelect);
};
