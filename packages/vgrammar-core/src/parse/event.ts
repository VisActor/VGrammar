import { debounce, isNil, throttle } from '@visactor/vutils';
import type {
  EventSourceType,
  ParsedViewEventSpec,
  ParsedWindowEventSpec,
  EventCallback,
  MarkType,
  IElement
} from '../types';
import { isMarkType } from '../graph/util/graphic';
import { EVENT_SOURCE_VIEW, EVENT_SOURCE_WINDOW } from '../view/constants';

export const generateFilterByMark = (evtSpec: Partial<ParsedViewEventSpec | ParsedWindowEventSpec>) => {
  if (isNil(evtSpec.markId)) {
    return (el: IElement) => {
      return el && el.mark.id() === evtSpec.markId;
    };
  }

  if (isNil(evtSpec.markName)) {
    return (el: IElement) => {
      return el && el.mark.name() === evtSpec.markName;
    };
  }

  if (isNil(evtSpec.type)) {
    return (el: IElement) => {
      return el && el.mark.markType === evtSpec.type;
    };
  }

  return () => true;
};

export const parseHandler = (callback: EventCallback, config: { debounce?: number; throttle?: number }) => {
  if (config && config.debounce) {
    return debounce(callback, config.debounce);
  }

  if (config && config.throttle) {
    return throttle(callback, config.throttle);
  }

  return callback;
};

const JOIN_SYMBOL = ':';
export const NAME_PREFIX = '@';
export const ID_PREFIX = '#';

/**
 * Parse an event selector string.
 * Supported rules:
 * 1. mousedown
 * 2. rect:mousedown
 * 3. window:mousemove
 * 4. @foo:mousedown
 * Returns an event stream definitions.
 */
export const parseEventSelector = (
  selector: string,
  source: EventSourceType = EVENT_SOURCE_VIEW
): Partial<ParsedViewEventSpec | ParsedWindowEventSpec> => {
  const spec: Partial<ParsedViewEventSpec | ParsedWindowEventSpec> = {};

  const splitArr = selector.split(JOIN_SYMBOL);

  if (splitArr.length === 2) {
    const [space, eventType] = splitArr;

    if (space[0] === ID_PREFIX) {
      // events on marks id
      spec.markId = space.slice(1);
      spec.source = source;
    } else if (space[0] === NAME_PREFIX) {
      // events on marks name
      spec.markName = space.slice(1);
      spec.source = source;
    } else if (isMarkType(space)) {
      spec.markType = space as MarkType;
      spec.source = source;
    } else if (space === EVENT_SOURCE_WINDOW) {
      spec.source = EVENT_SOURCE_WINDOW;
    } else {
      spec.source = source;
    }

    spec.type = eventType;
  } else if (splitArr.length === 1) {
    spec.type = selector;
    spec.source = source;
  }

  return spec;
};
