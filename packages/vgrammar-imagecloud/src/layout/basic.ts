import type {
  GridLayoutConfig,
  ImageCloudOptions,
  ImageCollageType,
  ImageConfig,
  SegmentationOutputType
} from '../interface';
import type { IView, IProgressiveTransformResult } from '@visactor/vgrammar-core';
import type { SegmentationInputType } from '@visactor/vgrammar-util';
import { vglobal } from '@visactor/vrender-core';
import {
  generateIsEmptyPixel,
  generateMaskCanvas,
  loadImage,
  loadImages,
  extent,
  segmentation
} from '@visactor/vgrammar-util';
import { isString, Logger } from '@visactor/vutils';
import { removeBorder, scaleAndMiddleShape } from '../segmentation';
import { fakeRandom, field, setSize } from '../util';
import { isNumber, isFunction } from '@visactor/vutils';
import { SqrtScale } from '@visactor/vscale';

export abstract class Layout implements IProgressiveTransformResult<any[]> {
  options: ImageCloudOptions;
  data: any[];
  view?: IView;

  protected isMaskImageFinished?: boolean;
  protected isImagesFinished?: boolean;
  protected isLayoutFinished?: boolean;
  protected progressiveResult?: any[] = [];
  protected segmentationInput?: SegmentationInputType;
  protected segmentationOutput?: SegmentationOutputType;

  protected imageCollageList?: ImageCollageType[] = [];

  abstract doLayout(images: ImageCollageType[]): ImageCollageType[];

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
        img.datum = this.data[index];
      }
    });

    // 去除怀链导致的无效图
    images = images.filter(img => img.valid !== false).sort((a, b) => b.weight - a.weight);

    return images;
  }

  onImageCollageInputReady(images: any): void {
    images.forEach((img: any, i: number) => {
      if (img.status === 'fulfilled') {
        const imageElement = img.value;
        const { width, height } = imageElement;
        this.imageCollageList.push(Object.assign({}, this.data[i], { aspectRatio: width / height }));
      } else {
        //  对加载失败的图片设为不可用
        this.imageCollageList.push(Object.assign({}, this.data[i], { valid: false }));
      }
    });
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
      randomGenerator: undefined,
      blur: options.maskConfig?.edgeBlur
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
        threshold: options.maskConfig?.threshold ?? 200,
        invert: options.maskConfig?.invert
      });
      const imagePromise = loadImage(segmentationInput.shapeUrl);

      if (imagePromise) {
        this.isMaskImageFinished = false;
        this.isLayoutFinished = false;
        imagePromise
          .then(shapeImage => {
            this.isMaskImageFinished = true;
            const size = options.size as [number, number];
            const maskCanvas = vglobal.createCanvas({ width: size[0], height: size[1], dpr: 1 });
            segmentationInput.maskCanvas = maskCanvas;
            const ctx = maskCanvas.getContext('2d');
            if (options.maskConfig?.removeWhiteBorder) {
              removeBorder(shapeImage, maskCanvas, segmentationInput.isEmptyPixel);
            }
            const shapeConfig = scaleAndMiddleShape(shapeImage, size);
            ctx.clearRect(0, 0, size[0], size[1]);
            ctx.drawImage(shapeImage, shapeConfig.x, shapeConfig.y, shapeConfig.width, shapeConfig.height);

            this.segmentationOutput = segmentation(this.segmentationInput);

            let transparentMaskCanvas;
            if ((this.options.layoutConfig as GridLayoutConfig)?.placement === 'masked') {
              transparentMaskCanvas = this.generateTransparentMaskCanvas(shapeImage, size);
            }

            if (this.options.onUpdateMaskCanvas) {
              this.options.onUpdateMaskCanvas(maskCanvas, transparentMaskCanvas);
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

      if (segmentationInput.shapeUrl.type === 'text' || segmentationInput.shapeUrl.type === 'geometric') {
        if (!segmentationInput.shapeUrl.backgroundColor) {
          segmentationInput.shapeUrl.backgroundColor = 'rgba(255,255,255,0)';
        }
      }

      const maskCanvas = generateMaskCanvas(
        segmentationInput.shapeUrl,
        size[0],
        size[1],
        undefined,
        options.maskConfig?.invert
      );
      segmentationInput.maskCanvas = maskCanvas;
      this.segmentationOutput = segmentation(this.segmentationInput);

      if (this.options.onUpdateMaskCanvas) {
        this.options.onUpdateMaskCanvas(maskCanvas, maskCanvas);
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
      const layoutResult = this.doLayout(images);
      if (this.options && this.options.onLayoutEnd) {
        this.options.onLayoutEnd(layoutResult);
      }
      this.progressiveResult = this.processOutput(layoutResult);
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

  protected calculateImageSize(images: ImageCollageType[], imageConfig: ImageConfig = {}, ratio: number = 0.45) {
    const { imageSizeRange, padding = 0 } = imageConfig;
    const imageSize = isNumber(imageConfig.imageSize) ? imageConfig.imageSize : field(imageConfig.imageSize);
    const size = this.options.size as [number, number];

    if (!imageSize && !imageSizeRange) {
      // 用户没有设置图片大小，则自动计算一个统一的大小
      const imageArea = images.reduce((prev, pic) => {
        const r = pic.aspectRatio;
        return prev + (r > 1 ? 1 / r : r);
      }, 0);
      let longSideLength = ~~Math.sqrt((ratio * size[0] * size[1]) / imageArea);
      // 减掉 padding 的影响
      longSideLength = longSideLength - 2 * padding < 0 ? 1 : longSideLength - 2 * padding;
      images.forEach(img => setSize(img, longSideLength));
    } else if (imageSize && !isFunction(imageSize)) {
      // 用户指定了统一的图片大小
      images.forEach(img => setSize(img, imageSize));
    } else if (imageSizeRange) {
      // 用户指定了图片大小的范围
      const sizeScale = new SqrtScale().domain(extent(images, d => d.weight)).range(imageSizeRange);
      images.forEach(img => setSize(img, ~~sizeScale.scale(img.weight)));
    } else if (imageSize && isFunction(imageSize) && !imageSizeRange) {
      // 用户没指定图片大小范围，但指定了图片大小的对应的 key
      const a = 0.5;
      const [min, max] = extent(images, d => d.weight);
      const picArea = images.reduce((prev, img) => {
        const r = img.aspectRatio;
        const w = (img.weight - min) / (max - min);
        return prev + (r > 1 ? 1 / r : r) * (a + (1 - a) * w) ** 2;
      }, 0);
      const x = ~~Math.sqrt((ratio * size[0] * size[1]) / picArea);
      const range = [
        ~~(a * x) - padding * 2 < 0 ? 1 : ~~(a * x) - padding * 2,
        ~~x - padding * 2 < 0 ? 1 : ~~x - padding * 2
      ];

      const sizeScale = new SqrtScale().domain(extent(images, d => d.weight)).range(range);
      images.forEach(img => setSize(img, ~~sizeScale.scale(img.weight)));
    } else {
      console.warn('image cloud imageSize error');
    }

    return images;
  }

  protected generateTransparentMaskCanvas(shapeImage: any, size: [number, number]) {
    const transparentMaskCanvas = vglobal.createCanvas({ width: size[0], height: size[1], dpr: 1 });
    const transparentMaskContext = transparentMaskCanvas.getContext('2d');
    this.segmentationOutput.transparentMaskCanvas = transparentMaskCanvas;
    if (this.options.maskConfig?.removeWhiteBorder) {
      removeBorder(shapeImage, transparentMaskCanvas, this.segmentationInput.isEmptyPixel);
    }
    const imageData = transparentMaskContext.createImageData(size[0], size[1]); // 宽度和高度
    const labels = this.segmentationOutput.segmentation.labels;
    for (let i = 0; i < labels.length; i++) {
      const color = labels[i] === 0 ? 255 : 0; // 0 为白色 (255, 255, 255)，1 为黑色 (0, 0, 0)
      const alpha = labels[i] * 255; // 0 为透明 (0)，1 为不透明 (255)
      // 每个像素在 ImageData 中占 4 个字节 (RGBA)
      const pixelIndex = i * 4;
      imageData.data[pixelIndex] = color; // 红色通道
      imageData.data[pixelIndex + 1] = color; // 绿色通道
      imageData.data[pixelIndex + 2] = color; // 蓝色通道
      imageData.data[pixelIndex + 3] = alpha; // Alpha 通道
    }
    transparentMaskContext.clearRect(0, 0, size[0], size[1]);
    transparentMaskContext.fillStyle = `rgba(255,255,255,0)`;
    transparentMaskContext.fillRect(0, 0, size[0], size[1]);
    transparentMaskContext.putImageData(imageData, 0, 0);
    return transparentMaskCanvas;
  }

  protected processOutput(images: ImageCollageType[]) {
    const outputAs = this.options?.as;
    if (outputAs) {
      Object.keys(outputAs).forEach(key => {
        images.forEach(img => {
          img[(outputAs as Record<string, string>)[key]] = img[key];
          delete img[key];
        });
      });
    }
    return images;
  }
}
