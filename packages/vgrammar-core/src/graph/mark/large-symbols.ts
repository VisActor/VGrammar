import type { ICustomPath2D, IGroupGraphicAttribute, IPath } from '@visactor/vrender';
import { isNumber, max } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { CustomPath2D, Group, DefaultSymbolAttribute } from '@visactor/vrender';

interface LargeSymbolsAttribute extends IGroupGraphicAttribute {
  size: number;
  points: Float32Array | number[];
}

export class LargeSymbols extends Group {
  constructor(attributes: LargeSymbolsAttribute) {
    super(attributes);
    this.attribute = attributes;
    // 这里调用渲染和事件绑定逻辑
    this.onSetStage(() => {
      this.render();
    });
  }

  render() {
    const pathNode = this.createOrUpdateChild('large-path', {}, 'path') as IPath;
    const points = (this.attribute as LargeSymbolsAttribute).points;
    const size = (this.attribute as LargeSymbolsAttribute).size ?? (DefaultSymbolAttribute.size as number);
    const path2d = (pathNode.attribute.path as ICustomPath2D) ?? new CustomPath2D();
    let x;
    let y;

    path2d.clear();
    const maxSize = isNumber(size) ? size : max(size[0], size[1]);
    for (let i = 0, len = points.length; i < len; i += 4) {
      x = points[i];
      y = points[i + 1];
      path2d.arc(x, y, maxSize / 2, 0, Math.PI * 2);
      path2d.closePath();
    }

    const pathAttrs = Object.assign({}, this.attribute, { path: path2d, points: null, size: null });
    this.attribute = {};
    (pathNode as IPath).setAttributes(pathAttrs);
  }
}
