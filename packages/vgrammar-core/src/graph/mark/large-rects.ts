/**
 * use when mark render in large mode or progressive mode
 */
import type { IGroupGraphicAttribute, IPath, ICustomPath2D } from '@visactor/vrender';
import { Group, CustomPath2D } from '@visactor/vrender';

interface LargeRectsAttribute extends IGroupGraphicAttribute {
  points: Float32Array | number[];
}

export class LargeRects extends Group {
  constructor(attributes: LargeRectsAttribute) {
    super(attributes);
    this.attribute = attributes;
    // 这里调用渲染和事件绑定逻辑
    this.onSetStage(() => {
      this.render();
    });
  }

  render() {
    const pathNode = this.createOrUpdateChild('large-path', {}, 'path') as IPath;
    const points = (this.attribute as LargeRectsAttribute).points;
    const path2d = (pathNode.attribute.path as ICustomPath2D) ?? new CustomPath2D();
    let x;
    let y;
    let width;
    let height;

    path2d.clear();
    for (let i = 0, len = points.length; i < len; i += 4) {
      x = points[i];
      y = points[i + 1];
      width = points[i + 2];
      height = points[i + 3];
      path2d.rect(x, y, width, height);
    }

    const pathAttrs = Object.assign({}, this.attribute, { path: path2d, points: null });
    this.attribute = {};
    (pathNode as IPath).setAttributes(pathAttrs);
  }
}
