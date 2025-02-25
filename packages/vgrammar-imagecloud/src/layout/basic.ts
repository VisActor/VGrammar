import type { ImageCloudOptions, ImageCollageInputType } from '../interface';
import type { IView, IProgressiveTransformResult } from '@visactor/vgrammar-core';
import type { SegmentationInputType } from '@visactor/vgrammar-util';
import { vglobal } from '@visactor/vrender-core';
import { generateIsEmptyPixel, generateMaskCanvas, loadImage, loadImages } from '@visactor/vgrammar-util';
import { isString, Logger } from '@visactor/vutils';
import { removeBorder, scaleAndMiddleShape } from '../segmentation';
import { fakeRandom, field } from '../util';

export const OUTPUT = {
  x: 'x',
  y: 'y',
  width: 'width',
  height: 'height',
  opacity: 'opacity'
};

export abstract class Layout implements IProgressiveTransformResult<any[]> {
  options: ImageCloudOptions;
  data: any[];
  view?: IView;

  protected isMaskImageFinished?: boolean;
  protected isImagesFinished?: boolean;
  protected isLayoutFinished?: boolean;
  protected progressiveResult?: any[] = [];
  protected segmentationInput?: SegmentationInputType;
  protected imageCollageList?: ImageCollageInputType[] = [];

  abstract onImageCollageInputReady(images: any): void;
  abstract doLayout(images: ImageCollageInputType[]): void;

  constructor(options: ImageCloudOptions, view?: IView) {
    this.options = options;
    this.view = view;
  }

  /**
   * 预处理计算
   * @returns 按照权重排列的所有有效图片
   */
  preProcess() {
    const { imageConfig = {}, weight } = this.options;
    const { padding = 0 } = imageConfig;
    let images = this.imageCollageList;
    images.forEach((img, index) => {
      if (img.valid === false) {
        img.x = -10;
        img.y = -10;
        img.width = 0;
        img.height = 0;
        img.opacity = 0;
      } else {
        img.padding = padding;
        img.weight = field(weight)(this.data[index]);
      }
    });

    // 去除怀链导致的无效图
    images = images.filter(img => img.valid !== false).sort((a, b) => b.weight - a.weight);

    return images;
  }

  layout(data: any[]) {
    this.data = data;

    this.loadSegmentationInput();
    this.loadImageCollageInput();
  }

  loadSegmentationInput() {
    const options = this.options;
    const size = options.size as [number, number];
    /** 根据shapeUrl, 计算segmentation */
    const segmentationInput: SegmentationInputType = {
      shapeUrl: options.mask ?? { type: 'geometric', shape: 'rect' },
      size: size,
      ratio: options.ratio || 0.8,
      tempCanvas: undefined,
      boardSize: [0, 0],
      random: false,
      randomGenerator: undefined
    };

    // 全局共用的临时画板，此处需要对小程序的 canvas 进行兼容
    const tempCanvas = vglobal.createCanvas({ width: size[0], height: size[1] });
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    segmentationInput.tempCanvas = tempCanvas;

    // board 的宽必须为 32 的倍数
    const boardW = ((size[0] + 31) >> 5) << 5;
    segmentationInput.boardSize = [boardW, size[1]];

    // 用于随机的随机数生成器
    if (segmentationInput.random) {
      segmentationInput.randomGenerator = Math.random;
    } else {
      segmentationInput.randomGenerator = fakeRandom();
    }
    this.segmentationInput = segmentationInput;
    if (isString(segmentationInput.shapeUrl)) {
      segmentationInput.isEmptyPixel = generateIsEmptyPixel(undefined, {
        threshold: options.maskConfig?.threshold ?? 100,
        invert: options.maskConfig?.invert
      });
      const imagePromise = loadImage(segmentationInput.shapeUrl);

      if (imagePromise) {
        this.isMaskImageFinished = false;
        this.isLayoutFinished = false;
        imagePromise
          .then(shapeImage => {
            const size = options.size as [number, number];
            this.isMaskImageFinished = true;
            const maskCanvas = vglobal.createCanvas({ width: size[0], height: size[1], dpr: 1 });
            segmentationInput.maskCanvas = maskCanvas;
            const ctx = maskCanvas.getContext('2d');
            if (options.maskConfig?.removeWhiteBorder) {
              removeBorder(shapeImage, maskCanvas, segmentationInput.isEmptyPixel);
            }
            const shapeConfig = scaleAndMiddleShape(shapeImage, size);
            ctx.clearRect(0, 0, size[0], size[1]);
            ctx.drawImage(shapeImage, shapeConfig.x, shapeConfig.y, shapeConfig.width, shapeConfig.height);

            if (this.options.onUpdateMaskCanvas) {
              this.options.onUpdateMaskCanvas(segmentationInput.maskCanvas);
            }
          })
          .catch(error => {
            this.isMaskImageFinished = true;
          });
      } else {
        this.isMaskImageFinished = true;
        this.isLayoutFinished = true;
      }
    } else if (
      segmentationInput.shapeUrl &&
      (segmentationInput.shapeUrl.type === 'text' || segmentationInput.shapeUrl.type === 'geometric')
    ) {
      segmentationInput.isEmptyPixel = generateIsEmptyPixel(segmentationInput.shapeUrl.backgroundColor);
      const maskCanvas = generateMaskCanvas(
        segmentationInput.shapeUrl,
        size[0],
        size[1],
        undefined,
        options.maskConfig?.invert
      );
      segmentationInput.maskCanvas = maskCanvas;

      if (this.options.onUpdateMaskCanvas) {
        this.options.onUpdateMaskCanvas(maskCanvas);
      }
      this.isMaskImageFinished = true;
    }
  }

  loadImageCollageInput() {
    const data = this.data;
    const imagesPromise = loadImages(data.map(d => field(this.options.image)(d)));
    if (imagesPromise) {
      imagesPromise
        .then((images: any[]) => {
          this.onImageCollageInputReady(images);
          this.isImagesFinished = true;
        })
        .catch(error => {
          this.isImagesFinished = true;
          this.isLayoutFinished = true;
          Logger.getInstance().error('image load failed', error);
        });
    } else {
      this.isImagesFinished = true;
      this.isLayoutFinished = true;
    }
  }

  canAnimate() {
    return true;
  }

  unfinished(): boolean {
    return !this.isLayoutFinished;
  }

  output(): any[] {
    return this.progressiveResult;
  }

  progressiveRun() {
    if (this.isImagesFinished && this.isMaskImageFinished && !this.isLayoutFinished) {
      const images = this.preProcess();
      this.doLayout(images);
      this.isLayoutFinished = true;
    } else {
      return;
    }
  }

  progressiveOutput(): any[] {
    return this.progressiveResult;
  }

  release() {
    this.segmentationInput = null;
    this.data = null;
    this.progressiveResult = null;
    this.options = null;
  }
}
