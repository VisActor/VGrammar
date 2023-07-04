import { isFunction } from '@visactor/vutils';
import { SIGNAL_VIEW_HEIGHT, SIGNAL_PADDING, SIGNAL_VIEW_WIDTH } from './../../view/constants';
import type { MarkRelativeContainerSpec, MarkGridContainerSpec } from './../../types/mark';
import { GrammarMarkType } from '../enums';
import type { IMark, IGroupMark } from '../../types/grammar';
import type { ILayoutOptions, IView } from '../../types/view';
import { doGridLayout } from './grid';
import { doRelativeLayout } from './relative';

export const defaultDoLayout = (layoutMarks: IMark[], options: ILayoutOptions, view: IView) => {
  layoutMarks?.forEach(mark => {
    if (mark.markType !== GrammarMarkType.group) {
      return;
    }

    const layoutChildren = (mark as IGroupMark).layoutChildren;

    // FIXME buildLayoutTree的时候过滤一下空的group
    // if (!layoutChildren?.length) {
    //   return;
    // }

    const layoutSpec = mark.getSpec().layout;
    const bounds = mark.layoutBounds ?? mark.getBounds();

    if (isFunction(layoutSpec)) {
      layoutSpec.call(null, mark as IGroupMark, layoutChildren, bounds, options);
    } else if (isFunction(layoutSpec.callback)) {
      layoutSpec.callback.call(null, mark as IGroupMark, layoutChildren, bounds, options);
    } else if ((layoutSpec as MarkRelativeContainerSpec).display === 'relative') {
      if (layoutSpec.updateViewSignals) {
        const oldViewBox = view.getViewBox();

        if (oldViewBox) {
          bounds.intersect(oldViewBox);
        }

        const viewBounds = doRelativeLayout(mark as IGroupMark, layoutChildren, bounds, options);
        const viewWidth = viewBounds.width();
        const viewHeight = viewBounds.height();
        const padding = {
          top: viewBounds.y1 - bounds.y1,
          right: bounds.x2 - viewBounds.x2,
          left: viewBounds.x1 - bounds.x1,
          bottom: bounds.y2 - viewBounds.y2
        };

        (view as any).updateSignal(SIGNAL_VIEW_WIDTH, viewWidth);
        (view as any).updateSignal(SIGNAL_VIEW_HEIGHT, viewHeight);
        (view as any).updateSignal(SIGNAL_PADDING, padding);
      } else {
        doRelativeLayout(mark as IGroupMark, layoutChildren, bounds, options);
      }
    } else if ((layoutSpec as MarkGridContainerSpec).display === 'grid') {
      doGridLayout(mark as IGroupMark, layoutChildren, bounds, options);
    }

    defaultDoLayout(layoutChildren, options, view);
  });
};
