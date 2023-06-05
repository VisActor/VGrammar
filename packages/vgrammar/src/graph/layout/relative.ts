import type { IBounds } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { Bounds } from '@visactor/vutils';
import { toPercent } from '@visactor/vgrammar-util';
import type { IGroupMark, ILayoutOptions, IMark, MarkRelativeItemSpec, MarkRelativeContainerSpec } from '../../types';
import { normalizePadding } from '../../parse/view';

export const doRelativeLayout = (
  group: IGroupMark,
  children: IMark[],
  parentLayoutBounds: IBounds,
  options?: ILayoutOptions
) => {
  const viewBounds = parentLayoutBounds.clone();
  const groupLayoutSpec = group.getSpec().layout as MarkRelativeContainerSpec;
  const maxChildWidth = toPercent(groupLayoutSpec.maxChildWidth, viewBounds.width());
  const maxChildHeight = toPercent(groupLayoutSpec.maxChildHeight, viewBounds.width());
  let minDeltaX1 = 0;
  let minDeltaX2 = 0;
  let minDeltaY1 = 0;
  let minDeltaY2 = 0;

  children.forEach((child: IMark) => {
    const layoutSpec = child.getSpec().layout as MarkRelativeItemSpec;
    const padding = normalizePadding(layoutSpec.padding);
    const bounds = options.parseMarkBounds ? options.parseMarkBounds(child.getBounds(), child) : child.getBounds();

    if (layoutSpec.position === 'top' || layoutSpec.position === 'bottom') {
      const childHeight = Math.min(bounds.height() + padding.top + padding.bottom, maxChildHeight);

      if (layoutSpec.position === 'top') {
        viewBounds.y1 += childHeight;
      } else {
        viewBounds.y2 -= childHeight;
      }

      if (bounds.x1 < parentLayoutBounds.x1) {
        minDeltaX1 = Math.max(minDeltaX1, parentLayoutBounds.x1 - bounds.x1);
      }

      if (bounds.x2 > parentLayoutBounds.x2) {
        minDeltaX2 = Math.max(minDeltaX2, bounds.x2 - parentLayoutBounds.x2);
      }
    }

    if (layoutSpec.position === 'left' || layoutSpec.position === 'right') {
      const childWidth = Math.min(bounds.width() + padding.left + padding.right, maxChildWidth);

      if (layoutSpec.position === 'left') {
        viewBounds.x1 += childWidth;
      } else {
        viewBounds.x2 -= childWidth;
      }

      if (bounds.y1 < parentLayoutBounds.y1) {
        minDeltaY1 = Math.max(minDeltaY1, parentLayoutBounds.y1 - bounds.y1);
      }

      if (bounds.y2 > parentLayoutBounds.y2) {
        minDeltaY2 = Math.max(minDeltaY2, bounds.y2 - parentLayoutBounds.y2);
      }
    }
  });

  if (minDeltaX1 > viewBounds.x1 - parentLayoutBounds.x1 && minDeltaX1 < parentLayoutBounds.width()) {
    viewBounds.x1 = parentLayoutBounds.x1 + minDeltaX1;
  }

  if (minDeltaX2 > parentLayoutBounds.x2 - viewBounds.x2 && minDeltaX2 < parentLayoutBounds.width()) {
    viewBounds.x2 = parentLayoutBounds.x2 - minDeltaX2;
  }

  if (minDeltaY1 > viewBounds.y1 - parentLayoutBounds.y1 && minDeltaY1 < parentLayoutBounds.height()) {
    viewBounds.y1 = parentLayoutBounds.y1 + minDeltaY1;
  }

  if (minDeltaY2 > parentLayoutBounds.y2 - viewBounds.y2 && minDeltaY2 < parentLayoutBounds.height()) {
    viewBounds.y2 = parentLayoutBounds.y2 - minDeltaY2;
  }

  const currentBounds = viewBounds.clone();

  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    const layoutSpec = child.getSpec().layout as MarkRelativeItemSpec;
    const padding = normalizePadding(layoutSpec.padding);
    const bounds = options.parseMarkBounds ? options.parseMarkBounds(child.getBounds(), child) : child.getBounds();

    if (layoutSpec.position === 'top' || layoutSpec.position === 'bottom') {
      const childHeight = Math.min(bounds.height() + padding.top + padding.bottom, maxChildHeight);

      if (layoutSpec.position === 'top') {
        child.layoutBounds = new Bounds().set(
          viewBounds.x1,
          currentBounds.y1 - childHeight,
          viewBounds.x2,
          currentBounds.y1
        );
        currentBounds.y1 = currentBounds.y1 - childHeight;
      } else {
        child.layoutBounds = new Bounds().set(
          viewBounds.x1,
          currentBounds.y2,
          viewBounds.x2,
          currentBounds.y2 + childHeight
        );
        currentBounds.y2 = currentBounds.y2 + childHeight;
      }
    } else if (layoutSpec.position === 'left' || layoutSpec.position === 'right') {
      const childWidth = Math.min(bounds.width() + padding.left + padding.right, maxChildWidth);

      if (layoutSpec.position === 'left') {
        child.layoutBounds = new Bounds().set(
          currentBounds.x1 - childWidth,
          viewBounds.y1,
          currentBounds.x1,
          viewBounds.y2
        );
        currentBounds.x1 = currentBounds.x1 - childWidth;
      } else {
        child.layoutBounds = new Bounds().set(
          currentBounds.x2,
          viewBounds.y1,
          currentBounds.x2 + childWidth,
          viewBounds.y2
        );
        currentBounds.x2 = currentBounds.x2 + childWidth;
      }
    } else {
      child.layoutBounds = viewBounds;
    }
  }

  return viewBounds;
};
