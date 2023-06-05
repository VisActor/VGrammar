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

  // if (el && el.getBoundingClientRect) {
  //   return getBoundingClientRectPos(e, el);
  // }

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

function getBoundingClientRectPos(e: any, el: HTMLElement) {
  const result: EventPosition = { canvasX: 0, canvasY: 0 };
  const rect = el.getBoundingClientRect();
  const currentWidth = rect.width;
  const originWidth = el.offsetWidth || currentWidth;
  const widthRatio = currentWidth / originWidth;
  const currentHeight = rect.height;
  const originHeight = el.offsetHeight || currentHeight;
  const heightRatio = currentHeight / originHeight;
  if (['touchstart', 'touchmove', 'touchend'].includes(e.type) && e.changedTouches && e.changedTouches.length) {
    result.canvasX = (e.changedTouches[0].clientX - rect.left - (el.clientLeft || 0)) / widthRatio;
    result.canvasY = (e.changedTouches[0].clientY - rect.top - (el.clientTop || 0)) / heightRatio;
    result.clientX = e.changedTouches[0].clientX;
    result.clientY = e.changedTouches[0].clientY;
  } else {
    result.canvasX = (e.clientX - rect.left - (el.clientLeft || 0)) / widthRatio;
    result.canvasY = (e.clientY - rect.top - (el.clientTop || 0)) / heightRatio;
  }
  return result;
}

function getXYPos(e: any) {
  return { canvasX: e.x, canvasY: e.y };
}

function getChangedTouchesPos(e: any) {
  return { canvasX: e.changedTouches[0].x, canvasY: e.changedTouches[0].y };
}

function defineSrPosition(event: any, pos: EventPosition, client = true) {
  isValidNumber(pos.canvasX) &&
    Object.defineProperty(event, 'canvasX', {
      value: pos.canvasX,
      writable: true
    });
  isValidNumber(pos.canvasY) &&
    Object.defineProperty(event, 'canvasY', {
      value: pos.canvasY,
      writable: true
    });
  client &&
    isValidNumber(pos.clientX) &&
    Object.defineProperty(event, 'clientX', {
      value: pos.clientX,
      writable: true
    });
  client &&
    isValidNumber(pos.clientY) &&
    Object.defineProperty(event, 'clientY', {
      value: pos.clientY,
      writable: true
    });
  return [pos.canvasX, pos.canvasY];
}
