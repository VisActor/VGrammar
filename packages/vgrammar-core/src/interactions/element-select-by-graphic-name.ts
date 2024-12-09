import type { InteractionEvent } from '../types';
import { ElementSelect } from './element-select';

export class ElementSelectByGraphicName extends ElementSelect {
  static type: string = 'element-select-by-graphic-name';
  type: string = ElementSelectByGraphicName.type;

  start(element: InteractionEvent['element']) {
    const name = element.getGraphicItem()?.name;
    if (name) {
      this._marks.forEach(mark => {
        mark.elements.forEach(el => {
          if (el.getGraphicItem()?.name === name) {
            super.start(el);
          }
        });
      });
    }
  }
}
