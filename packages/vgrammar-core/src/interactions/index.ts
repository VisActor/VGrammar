import { Factory } from '../core/factory';
import { ElementHoverState } from './element-hover';
import { ElementSelectState } from './element-select';

Factory.registerInteraction('element-hover', ElementHoverState);
Factory.registerInteraction('element-select', ElementSelectState);
