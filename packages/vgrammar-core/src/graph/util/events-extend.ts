import type { FederatedEvent } from '@visactor/vrender-core';
import type { IView } from './../../types/view';
import { point } from './point';
import { EVENT_SOURCE_VIEW, EVENT_SOURCE_WINDOW } from '../../view/constants';
import type { EventSourceType } from '../../types';
import { BridgeElementKey } from '../constants';

export default function getExtendedEvents(view: IView, event: FederatedEvent, type: string, source: EventSourceType) {
  if (source === EVENT_SOURCE_WINDOW) {
    const e = (event as any).changedTouches ? (event as any).changedTouches[0] : event;
    point(e);
  }
  let element = (event.target as any)?.[BridgeElementKey];
  if (!element && source === EVENT_SOURCE_VIEW) {
    let target = event.target;
    const rootGraphic = view.rootMark?.graphicItem;

    while (target?.parent && (target.parent as any) !== rootGraphic) {
      target = target.parent;
      if ((target as any)[BridgeElementKey]) {
        element = (target as any)[BridgeElementKey];
        break;
      }
    }
  }

  (event as any).element = element;

  return event;
}
