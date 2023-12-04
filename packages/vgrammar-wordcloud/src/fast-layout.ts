/**
 * 主要用于小程序环境的快速布局算法
 */
import type { ITextAttribute } from '@visactor/vrender/es/core';
import { getTextBounds } from '@visactor/vrender/es/core';
import type { IProgressiveTransformResult } from '@visactor/vgrammar-core';
import type { IBaseLayoutOptions, TagItemAttribute } from './interface';
import { BaseLayout } from './base';
import { merge } from '@visactor/vutils';
export interface TagItem {
  datum: any;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  fontFamily: string;
  angle: number;
  x: number;
  y: number;
  top: number;
  left: number;
}

interface IFastLayoutOptions extends IBaseLayoutOptions {
  padding?: TagItemAttribute<number>;
  enlarge?: boolean;
}

export class FastLayout extends BaseLayout<IFastLayoutOptions> implements IProgressiveTransformResult {
  private random: () => number;

  /* ==================== runtime vars ======================== */
  private center: [number, number];
  private aspectRatio: number;
  private maxRadius: number;
  private width: number;
  private height: number;

  static defaultOptions: Partial<IFastLayoutOptions> = {
    enlarge: false
  };

  constructor(options: IFastLayoutOptions) {
    super(merge({}, FastLayout.defaultOptions, options));
    this.random = this.options.random ? Math.random : () => 0;
    this.aspectRatio = 1;
  }

  // 新词是否与目前layout结果重叠
  private fit(word: TagItem) {
    for (let i = 0, len = this.result.length; i < len; i++) {
      if (isOverlap(word, this.result[i] as TagItem)) {
        return false;
      }
    }
    return true;
  }

  private getTextInfo(datum: any) {
    const info: Partial<TagItem> = {
      datum,
      fontSize: this.getTextFontSize(datum),
      fontWeight: this.getTextFontWeight(datum),
      fontStyle: this.getTextFontStyle(datum),
      fontFamily: this.getTextFontFamily(datum),
      angle: this.getTextRotate(datum),
      text: this.getText(datum) + '',
      x: this.center[0],
      y: this.center[1]
    };

    const bounds = getTextBounds(info as ITextAttribute);

    info.width = bounds.width();
    info.height = bounds.height();
    info.top = this.center[1] - info.height + info.height * 0.21;
    info.left = this.center[0] - info.width / 2;

    return info as TagItem;
  }

  layoutWord(index: number) {
    const step = 0.5; // 步长决定布局时间，也决定布局结果
    const info = this.getTextInfo(this.data[index]);

    let angle = 2 * Math.PI;
    let radius = 0;
    let left = info.left;
    let top = info.top;
    const width = info.width;
    const height = info.height;
    let rx = 1;
    let isFit = this.fit(info);

    while (!isFit && radius < this.maxRadius) {
      // elliptic shape
      radius += step; // spiral radius
      rx = this.shape((radius / this.maxRadius) * 2 * Math.PI); // 0 to 1
      angle += (this.options.random ? (this.random() > 0.5 ? 1 : -1) : index % 2 === 0 ? 1 : -1) * step;

      left = this.center[0] - width / 2 + radius * rx * Math.cos(angle) * this.aspectRatio;
      top = this.center[1] - height / 2 + radius * rx * Math.sin(angle);

      info.left = left;
      info.top = top;
      info.x = left + width / 2;
      info.y = top + height / 2;

      isFit = this.fit(info);
    }

    if (!isFit) {
      return false;
    }

    if (
      this.options.clip ||
      (info.left >= 0 && info.left + info.width <= this.width && info.top >= 0 && info.top + info.height <= this.height)
    ) {
      this.result.push(info);

      return true;
    }

    return false;
  }

  layout(data: any[], config: { width: number; height: number }) {
    if (!data?.length) {
      return [];
    }

    this.initProgressive();
    this.result = [];
    this.maxRadius = Math.sqrt(config.width * config.width + config.height * config.height) / 2;
    this.center = [config.width / 2, config.height / 2];
    this.width = config.width;
    this.height = config.height;
    this.data = data.sort((a: any, b: any) => {
      return this.getTextFontSize(b) - this.getTextFontSize(a);
    });

    // 将words按照fontSize排序，结果更美观
    // words.sort((a, b) => b.fontSize - a.fontSize);

    let i = 0;

    while (i < data.length) {
      const drawn = this.layoutWord(i);

      i++;
      this.progressiveIndex = i;

      if (this.exceedTime()) {
        break;
      }
    }

    return this.result;
  }
}

// 判断矩形是否重叠
function isOverlap(a: TagItem, b: TagItem) {
  if (a.left + a.width < b.left || a.top + a.height < b.top || a.left > b.left + b.width || a.top > b.top + b.height) {
    return false;
  }
  return true;
}
