import type { FederatedEvent } from '@visactor/vrender-core';
import type { IElement } from './../../types/element';
import type { IView } from './../../types/view';
import { point } from './point';
import { EVENT_SOURCE_WINDOW } from '../../view/constants';
import type { EventSourceType } from '../../types';

export default function getExtendedEvents(
  view: IView,
  event: FederatedEvent,
  item: IElement,
  type: string,
  source: EventSourceType
) {
  if (source === EVENT_SOURCE_WINDOW) {
    const e = (event as any).changedTouches ? (event as any).changedTouches[0] : event;
    point(e);
  }

  (event as any).element = item;
  (event as any).vGrammarType = type;

  return event;
}
