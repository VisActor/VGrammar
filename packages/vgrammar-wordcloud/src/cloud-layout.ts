/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-wordcloud/src/CloudLayout.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

/**
 * 小程序canvas相关API，getImageData、draw都是异步的，导致渐进渲染流程处理非常麻烦，实际上小程序并未使用这个算法，所以暂时不考虑支持小程序
 */
import { vglobal } from '@visactor/vrender-core';
import type { IProgressiveTransformResult } from '@visactor/vgrammar-core';
import { isString, merge } from '@visactor/vutils';
import type { Bounds, IBaseLayoutOptions, TagItemAttribute, TagItemFunction, TagOutputItem } from './interface';
import { getMaxRadiusAndCenter } from './shapes';
import { BaseLayout } from './base';
import { spirals } from './spirals';
import { functor } from './util';

// Word cloud layout by Jason Davies, https://www.jasondavies.com/wordcloud/
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf

// 一次扩充数组的数量
const MAX_ARGUMENTS_LENGTH = 60000;

export interface TagItem {
  text: number | string;
  /** font-family */
  fontFamily?: string;
  /** font-style */
  fontStyle?: string;
  /** font-weight */
  fontWeight?: string;
  /** 旋转角度 */
  angle?: number;
  /** font-size */
  fontSize?: number;
  padding?: number;
  /** 偏移量，仅内部计算使用 */
  xoff?: number;
  /** 偏移量，仅内部计算使用 */
  yoff?: number;
  /** 中心点坐标 */
  x?: number;
  /** 中心点坐标 */
  y?: number;
  /** 右下角点坐标 */
  x1?: number;
  /** 右下角点坐标 */
  y1?: number;
  /** 左上角点坐标 */
  x0?: number;
  /** 左上角点坐标 */
  y0?: number;
  hasText?: boolean;
  /** 像素是否有填充 */
  sprite?: number[];
  datum: any;
  /** 旋转后，词语所占区域的宽度 */
  width: number;
  /** 旋转后，词语所占区域的高度 */
  height: number;
}

interface ICloudLayoutOptions extends IBaseLayoutOptions {
  spiral?: 'archimedean' | 'rectangular' | ((size: [number, number]) => (t: number) => [number, number]);

  padding?: TagItemAttribute<number>;
  enlarge?: boolean;
}

export class CloudLayout extends BaseLayout<ICloudLayoutOptions> implements IProgressiveTransformResult {
  getTextPadding: TagItemFunction<number>;
  spiral: (size: [number, number]) => (t: any) => [number, number];
  random: () => number;

  /* ==================== runtime vars ======================== */
  cw: number = (1 << 11) >> 5;
  ch: number = 1 << 11;
  _size: [number, number] = [256, 256];
  _originSize: [number, number];
  _isBoardExpandCompleted = false;
  _placeStatus: number = 0;
  _tTemp?: number = null;
  _dtTemp?: number = null;
  _dy: number = 0;

  contextAndRatio?: { context: CanvasRenderingContext2D; ratio: number; canvas: HTMLCanvasElement };
  _board: number[];
  /** 已经绘制文字的最小包围盒 */
  _bounds: Bounds;

  /**
   * 最大无法放置字体缓存, key值为rotate + 摆放顺序(顺时针|逆时针)的组合
   */
  cacheMap = new Map();

  static defaultOptions: Partial<ICloudLayoutOptions> = {
    enlarge: false,
    minFontSize: 2,
    maxSingleWordTryCount: 2
  };

  constructor(options: ICloudLayoutOptions) {
    super(merge({}, CloudLayout.defaultOptions, options));

    if (this.options.minFontSize <= CloudLayout.defaultOptions.minFontSize) {
      this.options.minFontSize = CloudLayout.defaultOptions.minFontSize;
    }

    this.spiral = isString(this.options.spiral)
      ? spirals[this.options.spiral as string] ?? spirals.archimedean
      : (this.options.spiral as (size: [number, number]) => (t: any) => [number, number]);
    this.random = this.options.random ? Math.random : () => 1;
    this.getTextPadding = functor(this.options.padding);
  }

  zoomRatio() {
    return this._originSize[0] / this._size[0];
  }

  dy() {
    return this._dy;
  }

  layoutWord(index: number) {
    const d = this.data[index];

    // 当 text 为空时，直接跳过对其的布局，否则会卡死
    if (('' + d.text).trim() === '') {
      return true;
    }

    // size可能会更新
    const { maxRadius, center } = getMaxRadiusAndCenter(this.options.shape as string, this._size);
    d.x = center[0];
    d.y = center[1];
    cloudSprite(this.contextAndRatio, d, this.data, index, this.cw, this.ch);
    /* 一次place判断可能发生的情况：
     * 1. 成功找到位置，更新board，返回true ==》 更新词语位置，完成布局
     * 2. range和shape判断一直无法通过，直到delta大于max，返回false，等待扩大board范围再次尝试布局
     * 3. 在螺旋的过程中collide检测一直无法找到合适位置，直到delta大于max，返回false，等待扩大board范围再次尝试布局
     *
     * 目标：
     * 1. `超长词`语判断(d.fontSize > size)，返回false，size扩大到可以容纳d.fontSize
     * 2. range和shape判断一直无法通过，直到delta大于max，返回false，等待扩大board范围再次尝试布局
     * `长词`？记录可以容纳词语的最小fontSize（一次），扩大board范围再次尝试布局；目前测试数据只命中1,3，未发现命中2的情况
     * 3. 在螺旋的过程中collide检测一直无法找到合适位置，直到delta大于max，返回false，等待扩大board范围再次尝试布局
     * 从起点开始不断进行collide检测，第一次未通过range和shape判断时，记录当时的dt，扩大画布以后从该dt开始扫描
     *
     */
    this._placeStatus = 0;
    if (d.hasText && this.place(this._board, d, this._bounds, maxRadius)) {
      this.result.push(d);
      if (this._bounds) {
        cloudBounds(this._bounds, d);
      } else {
        this._bounds = [
          { x: d.x + d.x0, y: d.y + d.y0 },
          { x: d.x + d.x1, y: d.y + d.y1 }
        ];
      }
      // Temporary hack
      d.x -= this._size[0] >> 1;
      d.y -= this._size[1] >> 1;

      // 清空t, dt缓存
      this._tTemp = null; // 初始化t缓存
      this._dtTemp = null; // 初始化dt缓存

      return true;
    }
    // 扩大画布问题：
    // 每次扩大画布，都是依据当前单词的d.fontSize和minFontSize比较后再扩大，
    // 如果某个词绘制顺序比较靠前，且尺寸较大，就会在绘制时将board拉大，
    // 后续尺寸较小的词语再画在borad后，其实际大小就会远远小于minFontSize，
    // 是不是应该先遍历数据，找到最小的词语尺寸，按照minFontSize算出board能扩大的最大尺寸，
    // 后面再绘制时board扩大不能超过这个尺寸。
    this.updateBoardExpandStatus(d.fontSize);
    if (d.hasText && this.shouldShrinkContinue()) {
      // 不需要为hasText为false时扩大画布
      if (this._placeStatus === 1) {
        // 按照字体要求能扩大的最大尺寸
        const maxSize0 = (d.fontSize * this._originSize[0]) / this.options.minFontSize;
        const distSize0 = Math.max(d.width, d.height);
        if (distSize0 <= maxSize0) {
          // 扩大尺寸满足最小字体要求 =》 按照要求扩大board
          this.expandBoard(this._board, this._bounds, distSize0 / this._size[0]);
        } else if (this.options.clip) {
          // 扩大尺寸不满足最小字体要求，但支持裁剪 =》 按最大尺寸扩大，裁剪词语
          this.expandBoard(this._board, this._bounds, maxSize0 / this._size[0]);
        } else {
          // 扩大尺寸不满足最小字体要求，且不支持裁剪 =》 丢弃词语
          return true;
        }
      } else if (this._placeStatus === 3) {
        // 扩大画布
        this.expandBoard(this._board, this._bounds);
      } else {
        // 扩大画布
        this.expandBoard(this._board, this._bounds);
      }
      // 更新一次状态，下次大尺寸词语进入裁剪
      this.updateBoardExpandStatus(d.fontSize);
      return false;
    }
    this._tTemp = null; // 初始化t缓存
    this._dtTemp = null; // 初始化dt缓存
    return true;
  }

  layout(words: any[], config: { width: number; height: number }) {
    this.initProgressive();
    this.result = [];
    this._size = [config.width, config.height];
    // console.time('prepare data');
    // 开始新的layout时清除旧的缓存
    this.clearCache();
    this._originSize = [...this._size];
    const contextAndRatio = this.getContext(vglobal.createCanvas({ width: 1, height: 1 }));
    this.contextAndRatio = contextAndRatio;
    this._board = new Array((this._size[0] >> 5) * this._size[1]).fill(0);
    // 已经绘制文字的最小包围盒
    this._bounds = null;

    const n = words.length;
    const i = 0;

    this.result = [];
    const data = words
      .map((d: any, i: number) => {
        return {
          text: this.getText(d),
          fontFamily: this.getTextFontFamily(d),
          fontStyle: this.getTextFontStyle(d),
          fontWeight: this.getTextFontWeight(d),
          angle: this.getTextRotate(d, i),
          fontSize: ~~this.getTextFontSize(d),
          padding: this.getTextPadding(d),
          xoff: 0,
          yoff: 0,
          x1: 0,
          y1: 0,
          x0: 0,
          y0: 0,
          hasText: false,
          sprite: null,
          datum: d,
          x: 0,
          y: 0,
          width: 0,
          height: 0
        };
      })
      .sort(function (a, b) {
        return b.fontSize - a.fontSize;
      });
    this.originalData = data;
    this.data = data;

    this.progressiveRun();

    if (!this.options.clip && this.options.enlarge && this._bounds) {
      this.shrinkBoard(this._bounds);
    }

    // 处理y方向偏移
    if (this._bounds && ['cardioid', 'triangle', 'triangle-upright'].includes(this.options.shape as string)) {
      const currentCenterY = (this._bounds[0].y + this._bounds[1].y) / 2;
      this._dy = -(currentCenterY - this._size[1] / 2);
    }

    return this.result;
  }

  formatTagItem(words: TagOutputItem[]) {
    /** 调整结果 */
    const size = this._size;
    const zoomRatio = this.zoomRatio();
    const globalDy = this.dy();
    const dx = size[0] >> 1;
    const dy = size[1] >> 1;

    const n = words.length;
    const result = [];
    let w;
    let t: any;

    for (let i = 0; i < n; ++i) {
      w = words[i];
      t = {};
      t.datum = w.datum;
      t.x = (w.x + dx) * zoomRatio;
      t.y = (w.y + dy + globalDy) * zoomRatio;
      t.fontFamily = w.fontFamily;
      t.fontSize = w.fontSize * zoomRatio;
      t.fontStyle = w.fontStyle;
      t.fontWeight = w.fontWeight;
      t.angle = w.angle;

      result.push(t);
    }

    return result;
  }

  output() {
    return this.outputCallback ? this.outputCallback(this.formatTagItem(this.result)) : this.formatTagItem(this.result);
  }

  progressiveOutput() {
    return this.outputCallback
      ? this.outputCallback(this.formatTagItem(this.progressiveResult))
      : this.formatTagItem(this.progressiveResult);
  }
  // 词语尺寸是否达小于最小尺寸，true时不能继续扩大画布“
  private updateBoardExpandStatus(fontSize: number) {
    this._isBoardExpandCompleted = fontSize * (this._originSize[0] / this._size[0]) < this.options.minFontSize;
  }

  // 是否可以继续扩大画布，true可以继续扩大
  private shouldShrinkContinue() {
    return !this.options.clip && this.options.shrink && !this._isBoardExpandCompleted;
  }

  // 根据 bounds 最大比例缩小 size
  private shrinkBoard(bounds: Bounds) {
    const leftTopPoint = bounds[0];
    const rightBottomPoint = bounds[1];
    if (rightBottomPoint.x >= this._size[0] || rightBottomPoint.y >= this._size[1]) {
      return;
    }
    const minXValue = Math.min(leftTopPoint.x, this._size[0] - rightBottomPoint.x);
    const minYValue = Math.min(leftTopPoint.y, this._size[1] - rightBottomPoint.y);
    const minRatio = Math.min(minXValue / this._size[0], minYValue / this._size[1]) * 2;
    this._size = this._size.map(v => v * (1 - minRatio)) as any;
  }

  // 扩充 bitmap
  private expandBoard(board: number[], bounds: Bounds, factor?: any) {
    const expandedLeftWidth = (this._size[0] * (factor || 1.1) - this._size[0]) >> 5;
    let diffWidth = expandedLeftWidth * 2 > 2 ? expandedLeftWidth : 2;
    if (diffWidth % 2 !== 0) {
      diffWidth++;
    }
    let diffHeight = Math.ceil((this._size[1] * (diffWidth << 5)) / this._size[0]);
    if (diffHeight % 2 !== 0) {
      diffHeight++;
    }
    const w = this._size[0];
    const h = this._size[1];
    const widthArr = new Array(diffWidth).fill(0);

    const heightArr = new Array((diffHeight / 2) * (diffWidth + (w >> 5))).fill(0);
    this.insertZerosToArray(board, h * (w >> 5), heightArr.length + diffWidth / 2);
    for (let i = h - 1; i > 0; i--) {
      this.insertZerosToArray(board, i * (w >> 5), widthArr.length);
    }
    this.insertZerosToArray(board, 0, heightArr.length + diffWidth / 2);
    this._size = [w + (diffWidth << 5), h + diffHeight];
    if (bounds) {
      bounds[0].x += (diffWidth << 5) / 2;
      bounds[0].y += diffHeight / 2;
      bounds[1].x += (diffWidth << 5) / 2;
      bounds[1].y += diffHeight / 2;
    }
  }

  // 分组扩充填充数组, 一次填充超过大概126000+会报stack overflow，worker环境下大概6w,这边取个比较小的
  // https://stackoverflow.com/questions/22123769/rangeerror-maximum-call-stack-size-exceeded-why
  private insertZerosToArray(array: any[], index: number, length: number) {
    const len = Math.floor(length / MAX_ARGUMENTS_LENGTH);
    const restLen = length % MAX_ARGUMENTS_LENGTH;

    for (let i = 0; i < len; i++) {
      array.splice(index + i * MAX_ARGUMENTS_LENGTH, 0, ...new Array(MAX_ARGUMENTS_LENGTH).fill(0));
    }
    array.splice(index + len * MAX_ARGUMENTS_LENGTH, 0, ...new Array(restLen).fill(0));
  }

  private getContext(canvas: any) {
    // 缩放比例
    canvas.width = 1;
    canvas.height = 1;
    const tempContext = canvas.getContext('2d');
    const imageData = tempContext.getImageData(0, 0, 1, 1);
    const ratio = Math.sqrt(imageData.data.length >> 2);

    canvas.width = (this.cw << 5) / ratio;
    canvas.height = this.ch / ratio;
    const context = canvas.getContext('2d');
    context.fillStyle = context.strokeStyle = 'red';
    context.textAlign = 'center';

    return { context: context, ratio: ratio, canvas };
  }

  private place(board: number[], tag: TagItem, bounds: Bounds, maxRadius: number) {
    let isCollide = false;
    // 情况1，超长词语
    if (this.shouldShrinkContinue() && (tag.width > this._size[0] || tag.height > this._size[1])) {
      this._placeStatus = 1;
      return false;
    }

    const dt: number = this.random() < 0.5 ? 1 : -1;
    // 根据缓存判断是否有放置空间
    if (!this.shouldShrinkContinue() && this.isSizeLargerThanMax(tag, dt)) {
      return null;
    }
    const startX = tag.x;
    const startY = tag.y;
    const maxDelta = Math.sqrt(this._size[0] * this._size[0] + this._size[1] * this._size[1]);
    const s = this.spiral(this._size);
    let t: number = -dt;
    let dxdy;
    let dx;
    let dy;
    let _tag;

    this._tTemp = null; // 初始化t缓存
    this._dtTemp = null; // 初始化dt缓存
    while ((dxdy = s((t += dt)))) {
      dx = dxdy[0];
      dy = dxdy[1];

      // 半径
      const radius = Math.sqrt(dx ** 2 + dy ** 2);
      // 弧度
      let rad = Math.atan(dy / dx);
      /*
       * 弧度从x轴正方向开始，逆时针方向为正，范围[0, 2PI]
       * atan返回值∈[-1/2PI, 1/2PI]，可以正确描述一四象限
       * 第一象限atan为正，弧度正确
       * 第二象限atan为负，等同于第四象限，弧度需要+PI矫正到第二象限
       * 第三象限atan为正，等同于第一象限，弧度需要+PI矫正到第三象限
       * 第四象限atan为负，需要矫正到正值，因此弧度需要+2PI
       */
      if (dx < 0) {
        rad += Math.PI;
      } else if (dy < 0) {
        rad = 2 * Math.PI + rad;
      }

      // 半径更改比例[0, 1]
      const rx = this.shape(rad);

      if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxDelta) {
        break;
      } // (dx, dy)距离中心超过maxDelta，跳出螺旋返回false

      if (radius >= maxRadius) {
        if (isCollide && this._tTemp === null) {
          this._tTemp = t;
          this._dtTemp = dt;
        }
        continue; // 判断是否在指定形状内
      }

      tag.x = startX + ~~(radius * rx * Math.cos(-rad));
      tag.y = startY + ~~(radius * rx * Math.sin(-rad));

      // 超出画布范围
      _tag = tag;
      if (this.options.clip) {
        // 通过剪裁文字，让文字能够正常渲染

        if (!this.shouldShrinkContinue()) {
          // 当文字全部在外面时
          if (isFullOutside(_tag, this._size)) {
            if (isCollide && this._tTemp === null) {
              this._tTemp = t;
              this._dtTemp = dt;
            }
            continue;
          } else if (isPartOutside(_tag, this._size)) {
            // 部分在外面
            _tag = clipInnerTag(_tag, this._size);
          }
        } else {
          if (isPartOutside(_tag, this._size)) {
            if (isCollide && this._tTemp === null) {
              this._tTemp = t;
              this._dtTemp = dt;
            }
            continue;
          }
        }
      } else {
        if (isPartOutside(_tag, this._size)) {
          if (isCollide && this._tTemp === null) {
            this._tTemp = t;
            this._dtTemp = dt;
          }
          continue;
        }
      }

      // 进入collide检测
      isCollide = true;
      // TODO only check for collisions within current bounds.
      if (!bounds || collideRects(_tag, bounds)) {
        if (!bounds || !cloudCollide(_tag, board, this._size)) {
          // 合并文字占用部分到board
          const sprite = _tag.sprite;
          const w = _tag.width >> 5;
          const sw = this._size[0] >> 5;
          const lx = _tag.x - (w << 4);
          const sx = lx & 0x7f;
          const msx = 32 - sx;
          const h = _tag.y1 - _tag.y0;
          let x = (_tag.y + _tag.y0) * sw + (lx >> 5);
          let last;
          for (let j = 0; j < h; j++) {
            last = 0;
            for (let i = 0; i <= w; i++) {
              board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
            }
            // paint(board, size, originSize)
            x += sw;
          }
          // paint(_tag.sprite, [_tag.width, _tag.height])
          // paint(board, size, originSize)
          tag.sprite = null;
          _tag.sprite = null;
          // if (Date.now() - start > 10) {
          //   console.log(_tag.text, Date.now() - start, placeCount)
          // }
          return true;
        }
      }
    }
    // if (Date.now() - start > 50) {
    //   console.log(_tag.text, Date.now() - start, placeCount)
    // }
    if (this._tTemp !== null) {
      this._placeStatus = 3;
    }
    !this.shouldShrinkContinue() && this.setCache(_tag, dt);
    return false;
  }

  /**
   * 清除缓存
   */
  private clearCache() {
    this.cacheMap.clear();
  }
  /**
   * 设置缓存
   * @param {*} tag
   * @param {number} dt 旋转方向, 1, -1
   */
  private setCache(tag: TagItem, dt: number) {
    const cacheKey = `${tag.angle}-${dt}`;
    const w = tag.x1 - tag.x0;
    const h = tag.y1 - tag.y0;
    if (!this.cacheMap.has(cacheKey)) {
      this.cacheMap.set(cacheKey, {
        width: w,
        height: h
      });
      return;
    }
    const { width, height } = this.cacheMap.get(cacheKey);
    if ((w < width && h < height) || (w <= width && h < height)) {
      this.cacheMap.set(cacheKey, {
        width: w,
        height: h
      });
    }
  }

  /**
   * 判断当前text是否能放置
   * 如果缓存中有同旋转角度和旋转方向的text,
   * 且当前text的boundingBox大于缓存boundingBox, 则跳过放置尝试
   * @param {*} tag
   * @param {*} dt 旋转方向, 1, -1
   */
  private isSizeLargerThanMax(tag: TagItem, dt: number) {
    const cacheKey = `${tag.angle}-${dt}`;
    if (!this.cacheMap.has(cacheKey)) {
      return false;
    }
    const { width, height } = this.cacheMap.get(cacheKey);
    const w = tag.x1 - tag.x0;
    const h = tag.y1 - tag.y0;
    return w >= width && h >= height;
  }
}

// Fetches a monochrome sprite bitmap for the specified text.
// Load in batches for speed.
// cloudSprite从索引di开始向后绘制词语sprite，直到可以一次绘制的最大范围；
// 如果索引di在它自己的轮次都无法绘制（hasText = true），那么它就是超大词语，无法在屏幕出现
// 此时，不需要为他扩大画布
function cloudSprite(contextAndRatio: any, d: TagItem, data: TagItem[], di: number, cw: number, ch: number) {
  if (d.sprite) {
    return;
  }
  const c = contextAndRatio.context;
  const ratio = contextAndRatio.ratio;
  // 设置transform
  c.setTransform(ratio, 0, 0, ratio, 0, 0);
  c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
  let x = 0;
  let y = 0;
  let maxh = 0;
  const n = data.length;
  let w;
  let w32;
  let h;
  let i;
  let j;
  --di;
  while (++di < n) {
    d = data[di];
    c.save();
    c.font = d.fontStyle + ' ' + d.fontWeight + ' ' + ~~((d.fontSize + 1) / ratio) + 'px ' + d.fontFamily;
    w = c.measureText(d.text + 'm').width * ratio;
    h = d.fontSize << 1;
    if (d.angle) {
      const sr = Math.sin(d.angle);
      const cr = Math.cos(d.angle);
      const wcr = w * cr;
      const wsr = w * sr;
      const hcr = h * cr;
      const hsr = h * sr;
      w = ((Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 31) >> 5) << 5;
      h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
    } else {
      w = ((w + 31) >> 5) << 5;
    }
    // w, h为旋转后，词语所占区域的宽高
    if (h > maxh) {
      maxh = h;
    } // 记录当前行最大高度
    // 如果当前行放不下，就另起一行，y方向向下移动当前行的最大高度
    if (x + w >= cw << 5) {
      x = 0;
      y += maxh;
      maxh = 0;
    }

    if (y + h >= ch) {
      break;
    } // 绘制区域的高度为2048px，超过长度下次绘制（TODO: 如果存在超高词语，这里是否可以当做一个退出机制？）
    c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
    if (d.angle) {
      c.rotate(d.angle);
    }
    c.fillText(d.text, 0, 0);
    if (d.padding) {
      c.lineWidth = 2 * d.padding;
      c.strokeText(d.text, 0, 0);
    }
    c.restore();
    // 词语绘制完成，记录其在画布上的相对位置和范围
    d.width = w;
    d.height = h;
    d.xoff = x;
    d.yoff = y;
    // x0, x1, y0, y1是四角相对于中心点的相对坐标
    d.x1 = w >> 1;
    d.y1 = h >> 1;
    d.x0 = -d.x1;
    d.y0 = -d.y1;
    d.hasText = true;
    // x位置右移，等待下一个词语绘制
    x += w;
  }

  const pixelsImageData = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio);
  const pixels = pixelsImageData.data;
  const sprite: any[] = [];
  while (--di >= 0) {
    d = data[di];
    if (!d.hasText) {
      continue;
    }
    w = d.width;
    w32 = w >> 5;
    h = d.y1 - d.y0;
    // Zero the buffer
    for (i = 0; i < h * w32; i++) {
      sprite[i] = 0;
    }
    x = d.xoff;
    if (x == null) {
      return;
    }
    y = d.yoff;
    let seen = 0;
    let seenRow = -1;
    for (j = 0; j < h; j++) {
      for (i = 0; i < w; i++) {
        // 在sprite数组中，每一个Uint32的数字记录了32个像素的绘制情况
        // 在pixels中，只取alpha通道的值，因此需要每个像素需要 << 2 得到alpha通道
        const k = w32 * j + (i >> 5);
        const m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;
        sprite[k] |= m;
        seen |= m;
      }
      // 如果当前行发现着色，开始记录行号
      if (seen) {
        seenRow = j;
      } else {
        // 如果当前行未发现着色，则在结果中省去改行（高度--，y坐标++，左上角相对坐标++）
        d.y0++;
        h--;
        j--;
        y++;
      }
    }
    d.y1 = d.y0 + seenRow; // 更新右下角相对坐标
    d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32); // 舍弃数组中冗余部分
  }
}

// Use mask-based collision detection.
function cloudCollide(tag: TagItem, board: number[], size: [number, number]) {
  const sw = size[0] >> 5;
  const sprite = tag.sprite;
  const w = tag.width >> 5;
  const lx = tag.x - (w << 4);
  const sx = lx & 0x7f;
  const msx = 32 - sx;
  const h = tag.y1 - tag.y0;
  let x = (tag.y + tag.y0) * sw + (lx >> 5);
  let last;
  for (let j = 0; j < h; j++) {
    last = 0;
    for (let i = 0; i <= w; i++) {
      if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0)) & board[x + i]) {
        return true;
      }
    }
    x += sw;
  }
  return false;
}

function cloudBounds(bounds: Bounds, d: TagItem) {
  const b0 = bounds[0];
  const b1 = bounds[1];
  if (d.x + d.x0 < b0.x) {
    b0.x = d.x + d.x0;
  }
  if (d.y + d.y0 < b0.y) {
    b0.y = d.y + d.y0;
  }
  if (d.x + d.x1 > b1.x) {
    b1.x = d.x + d.x1;
  }
  if (d.y + d.y1 > b1.y) {
    b1.y = d.y + d.y1;
  }
}

function collideRects(a: TagItem, b: Bounds) {
  return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
}

const isFullOutside = (tag: TagItem, size: [number, number]) => {
  return tag.x + tag.x0 > size[0] || tag.y + tag.y0 > size[0] || tag.x + tag.x1 < 0 || tag.y + tag.y1 < 0;
};

const isPartOutside = (tag: TagItem, size: [number, number]) => {
  return tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 || tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1];
};

function clipInnerTag(tag: TagItem, size: [number, number]) {
  const sprite = tag.sprite;
  const h = tag.y1 - tag.y0;
  const w = tag.width >> 5;
  let x = 0;

  const _sprite: number[] = [];
  const js = Math.max(-(tag.y0 + tag.y), 0);
  const je = Math.min(h + (size[1] - (tag.y1 + tag.y)), h);
  const is = Math.max(-(tag.x0 + tag.x), 0) >> 5;
  const ie = Math.min(w + ((size[0] - (tag.x1 + tag.x)) >> 5) + 1, w);

  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (j < js || je <= j || i < is || ie <= i) {
        // sprite[x + i] = null
        // if (ie === i) {
        //   var value = sprite[x + i]
        //   var overflow = (ie << 5) - (tag.x1 + tag.x)
        //   _sprite.push((value >> overflow << overflow))
        // }
      } else {
        _sprite.push(sprite[x + i]);
      }
    }
    x += w;
  }
  // paint(sprite, [tag.width, tag.height])
  // var _sprite = sprite.filter(d => d !== null)
  const xl = is << 5;
  const xr = (w - ie) << 5;
  const yb = js;
  const yt = h - je;
  // paint(_sprite, [tag.width - xl - xr, tag.height - yb - yt])

  return {
    ...tag,
    width: tag.width - xl - xr,
    height: tag.height - yb - yt,
    x0: tag.x0 + xl,
    x1: tag.x1 - xr,
    y0: tag.y0 + yb,
    y1: tag.y1 - yt,
    x: tag.x + xl / 2 - xr / 2,
    // y: tag.y + yb / 2 - yt / 2,
    sprite: _sprite
  };
}
