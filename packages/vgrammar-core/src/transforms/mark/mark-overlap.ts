import { isNil } from '@visactor/vutils';
import type { IElement, MarkOverlapTransformOptions } from '../../types';

const HIDE_KEY = '_mo_hide_';

function reset(elements: IElement[]) {
  elements.forEach(element => {
    const hide = element.getGraphicAttribute('HIDE_KEY');

    if (hide) {
      element.setGraphicAttribute('visible', true);
      element.setGraphicAttribute(HIDE_KEY, false);
    }
  });
  return elements;
}

function overlapX(elements: IElement[], delta: number, deltaMul: number, useRadius: boolean) {
  if (useRadius) {
    let lastX = -Infinity;
    let lastR = 0;
    const useDeltaMul = isNil(delta);
    let itemDelta = delta;

    elements.forEach(element => {
      if (element.getGraphicAttribute('visible') === false) {
        // skip hidden points
        return;
      }

      const r = element.getGraphicAttribute('size') / 2;
      const currentX = element.getGraphicAttribute('x');
      if (useDeltaMul) {
        itemDelta = (r + lastR) * deltaMul;
      }
      if (Math.abs(currentX - lastX) < itemDelta + lastR + r) {
        if (!element.getGraphicAttribute('forceShow')) {
          element.setGraphicAttribute(HIDE_KEY, true);
          element.setGraphicAttribute('visible', false);
        }
      } else {
        lastX = currentX;
      }

      lastR = r;
    });
  }
}

function overlapY(elements: IElement[], delta: number, deltaMul: number, useRadius: boolean) {
  if (useRadius) {
    let lastY = -Infinity;
    let lastR = 0;
    const useDeltaMul = isNil(delta);
    let itemDelta = delta;

    elements.forEach(element => {
      if (element.getGraphicAttribute('visible') === false) {
        // skip hidden points
        return;
      }

      const r = element.getGraphicAttribute('size') / 2;
      const currentY = element.getGraphicAttribute('y');
      if (useDeltaMul) {
        itemDelta = (r + lastR) * deltaMul;
      }
      if (Math.abs(currentY - lastY) < itemDelta + lastR + r) {
        if (!element.getGraphicAttribute('forceShow')) {
          element.setGraphicAttribute(HIDE_KEY, true);
          element.setGraphicAttribute('visible', false);
        }
      } else {
        lastY = currentY;
      }

      lastR = r;
    });
  }
}

function overlapXY(elements: IElement[], delta: number, deltaMul: number, useRadius: boolean) {
  if (useRadius) {
    const lastX = -Infinity;
    let lastY = -Infinity;
    let lastR = 0;
    let dis = 0;
    const useDeltaMul = isNil(delta);
    let itemDelta = delta;

    elements.forEach(element => {
      if (element.getGraphicAttribute('visible') === false) {
        // skip hidden points
        return;
      }

      const r = element.getGraphicAttribute('size') / 2;
      const currentX = element.getGraphicAttribute('x');
      const currentY = element.getGraphicAttribute('y');

      if (useDeltaMul) {
        itemDelta = (r + lastR) * deltaMul;
      }
      dis = (lastX - currentX) ** 2 + (lastY - currentY) ** 2;
      if (dis < (itemDelta + lastR + r) ** 2) {
        if (!element.getGraphicAttribute('forceShow')) {
          element.setGraphicAttribute(HIDE_KEY, true);
          element.setGraphicAttribute('visible', false);
        }
      } else {
        lastY = currentY;
      }

      lastR = r;
    });
  }
}

/**
 * 针对mark的防重叠
 * @param {object} options - The parameters for this operator.
 * @param {data} [options.followMark]
 * @constructor
 */
export const transform = (options: MarkOverlapTransformOptions, upstreamData: IElement[]) => {
  if (!upstreamData || upstreamData.length === 0) {
    return;
  }
  let { radius } = options;
  if (isNil(radius)) {
    if (upstreamData[0].mark.markType === 'symbol') {
      radius = true;
    }
  }

  const { direction, delta, deltaMul = 1, groupBy } = options;

  const handleOverlap = (elements: IElement[]) => {
    reset(elements);

    const sortedElements = elements.slice().sort((a, b) => {
      return a.getGraphicAttribute('x') - b.getGraphicAttribute('x');
    });

    if (direction === 0) {
      overlapXY(sortedElements, delta, deltaMul, radius);
    } else if (direction === 1) {
      overlapX(sortedElements, delta, deltaMul, radius);
    } else {
      overlapY(sortedElements, delta, deltaMul, radius);
    }
  };

  if (!groupBy) {
    handleOverlap(upstreamData);
  } else {
    // 分组
    const map = upstreamData.reduce((res: { [key: string]: IElement[] }, element: IElement) => {
      const groupName = element.getDatum()[groupBy];

      if (res[groupName]) {
        res[groupName].push(element);
      } else {
        res[groupName] = [element];
      }

      return res;
    }, {});

    Object.keys(map).forEach(key => {
      handleOverlap(map[key]);
    });
  }

  return upstreamData;
};
