import { isValidNumber, isNil } from '@visactor/vutils';

interface EventPosition {
  canvasX: number;
  canvasY: number;
  clientX?: number;
  clientY?: number;
}

export function point(event: Event) {
  ['touches', 'changedTouches', 'targetTouches'].forEach(touchKey => {
    if (event[touchKey] && event[touchKey].length) {
      Array.from(event[touchKey]).forEach(touch => {
        const touchPosition = clientToLocal(touch as Event);
        defineSrPosition(touch, touchPosition, false);
      });
    }
  });

  const pos = clientToLocal(event);
  return defineSrPosition(event, pos);
}

function clientToLocal(e: Event): EventPosition {
  // For IE6+, chrome, safari, opera. (When will ff support offsetX?)
  if (!isNil((e as any).offsetX)) {
    return getOffsetPos(e);
  }

  // for miniApp
  if (!isNil((e as any).x)) {
    return getXYPos(e);
  }

  // for miniApp
  if ((e as any).changedTouches && (e as any).changedTouches.length) {
    return getChangedTouchesPos(e);
  }

  // For some other device, e.g., IOS safari.
  return {
    canvasX: 0,
    canvasY: 0
  };
}

function getOffsetPos(e: any) {
  return {
    canvasX: e.offsetX,
    canvasY: e.offsetY
  };
}

function getXYPos(e: any) {
  return { canvasX: e.x, canvasY: e.y };
}

function getChangedTouchesPos(e: any) {
  const pos = e.changedTouches[0];
  return { canvasX: pos.x, canvasY: pos.y };
}

function defineSrPosition(event: any, pos: EventPosition, client = true) {
  const keys = ['canvasX', 'canvasY'];

  if (client) {
    keys.push('clientX');
    keys.push('clientY');
  }

  keys.forEach(key => {
    isValidNumber(pos[key]) &&
      Object.defineProperty(event, key, {
        value: pos[key],
        writable: true
      });
  });

  return [pos.canvasX, pos.canvasY];
}
