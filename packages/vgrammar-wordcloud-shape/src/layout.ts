import { degreeToRadian, isFunction, isString, maxInArray, toNumber } from '@visactor/vutils';
import type {
  CloudWordType,
  FieldOption,
  LayoutConfigType,
  SegmentationInputType,
  SegmentationOutputType,
  TagItemAttribute,
  WordCloudShapeOptions,
  wordsConfigType
} from './interface';
import { removeBorder, scaleAndMiddleShape, segmentation } from './segmentation';
import { WORDCLOUD_SHAPE_HOOK_EVENT, calTextLength, colorListEqual, fakeRandom, functor, loadImage } from './util';
import { LinearScale, OrdinalScale, SqrtScale } from '@visactor/vscale';
import cloud from './cloud-shape-layout';
import { type IProgressiveTransformResult, type IView } from '@visactor/vgrammar-core';
import { vglobal } from '@visactor/vrender-core';
import { generateIsEmptyPixel, generateMaskCanvas } from '@visactor/vgrammar-util';

const OUTPUT = {
  x: 'x',
  y: 'y',
  fontFamily: 'fontFamily',
  fontSize: 'fontSize',
  fontStyle: 'fontStyle',
  fontWeight: 'fontWeight',
  angle: 'angle',
  opacity: 'opacity',
  visible: 'visible',
  isFillingWord: 'isFillingWord',
  color: 'color'
};

export class Layout implements IProgressiveTransformResult<any[]> {
  options: WordCloudShapeOptions;

  data: any[];
  view?: IView;

  private isImageFinished?: boolean;
  private isLayoutFinished?: boolean;
  private progressiveResult?: any[] = [];
  private segmentationInput?: SegmentationInputType;

  constructor(options: WordCloudShapeOptions, view?: IView) {
    this.options = options;
    this.view = view;
  }

  layout(data: any[]) {
    this.data = data;

    const options = this.options;

    /** step1: 根据shapeUrl, 计算segmentation */
    const segmentationInput: SegmentationInputType = {
      shapeUrl: options.shape,
      size: options.size,
      ratio: options.ratio || 0.8,
      tempCanvas: undefined,
      boardSize: [0, 0],
      random: false,
      randomGenerator: undefined
    };

    // 全局共用的临时画板，此处需要对小程序的 canvas 进行兼容
    const tempCanvas = vglobal.createCanvas({ width: options.size[0], height: options.size[1] });
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    segmentationInput.tempCanvas = tempCanvas;

    // board 的宽必须为 32 的倍数
    const boardW = ((options.size[0] + 31) >> 5) << 5;
    segmentationInput.boardSize = [boardW, options.size[1]];

    // 用于随机的随机数生成器
    if (segmentationInput.random) {
      segmentationInput.randomGenerator = Math.random;
    } else {
      segmentationInput.randomGenerator = fakeRandom();
    }
    this.segmentationInput = segmentationInput;
    if (isString(segmentationInput.shapeUrl)) {
      segmentationInput.isEmptyPixel = generateIsEmptyPixel();
      const imagePromise = loadImage(segmentationInput.shapeUrl);

      if (imagePromise) {
        this.isImageFinished = false;
        this.isLayoutFinished = false;
        imagePromise
          .then(shapeImage => {
            this.isImageFinished = true;
            const maskCanvas = vglobal.createCanvas({ width: options.size[0], height: options.size[1], dpr: 1 });
            segmentationInput.maskCanvas = maskCanvas;
            const ctx = maskCanvas.getContext('2d');
            if (options.removeWhiteBorder) {
              removeBorder(shapeImage, maskCanvas, segmentationInput.isEmptyPixel);
            }
            const shapeConfig = scaleAndMiddleShape(shapeImage, options.size);
            ctx.clearRect(0, 0, options.size[0], options.size[1]);
            ctx.drawImage(shapeImage, shapeConfig.x, shapeConfig.y, shapeConfig.width, shapeConfig.height);

            if (this.options.onUpdateMaskCanvas) {
              this.options.onUpdateMaskCanvas(segmentationInput.maskCanvas);
            }
          })
          .catch(error => {
            this.isImageFinished = true;
          });
      } else {
        this.isImageFinished = true;
        this.isLayoutFinished = true;
      }
    } else if (
      segmentationInput.shapeUrl &&
      (segmentationInput.shapeUrl.type === 'text' || segmentationInput.shapeUrl.type === 'geometric')
    ) {
      segmentationInput.isEmptyPixel = generateIsEmptyPixel(segmentationInput.shapeUrl.backgroundColor);
      const maskCanvas = generateMaskCanvas(segmentationInput.shapeUrl, options.size[0], options.size[1]);
      segmentationInput.maskCanvas = maskCanvas;

      if (this.options.onUpdateMaskCanvas) {
        this.options.onUpdateMaskCanvas(maskCanvas);
      }
      this.doLayout();
      this.isImageFinished = true;
      this.isLayoutFinished = true;
    }
  }

  unfinished(): boolean {
    return !this.isLayoutFinished;
  }

  output(): any[] {
    return this.progressiveResult;
  }

  progressiveRun() {
    if (!this.isImageFinished || this.isLayoutFinished) {
      return;
    }

    if (this.segmentationInput.maskCanvas) {
      this.doLayout();
    }

    this.isLayoutFinished = true;
  }

  progressiveOutput(): any[] {
    return this.progressiveResult;
  }

  doLayout() {
    const segmentationInput = this.segmentationInput;
    // 对用户输入的图形进行预处理
    const segmentationOutput: SegmentationOutputType = segmentation(segmentationInput);

    if (!segmentationOutput.segmentation.regions.length) {
      return;
    }

    const options = this.options;
    const data = this.data;

    /** step2: 收集 wordsConfig, 并计算fontSizeScale */
    const colorMode = options.colorMode || 'ordinal';
    const wordsConfig: wordsConfigType = {
      getText: field(options.text),
      getFontSize: field(options.fontSize),
      fontSizeRange: options.fontSizeRange,

      // color 相关
      colorMode: colorMode,
      getColor: options.colorField ? field(options.colorField) : field(options.text),
      getFillingColor: field(options.fillingColorField),
      // 根据不同的 colorMode 赋值不同的默认值
      colorList:
        options.colorList ||
        (colorMode === 'ordinal' ? ['#2E62F1'] : ['#537EF5', '#2E62F1', '#2358D8', '#184FBF', '#0C45A6', '#013B8E']),
      getColorHex: field(options.colorHexField),

      // 字体相关
      getFontFamily: field(options.fontFamily || 'sans-serif'),
      rotateList: options.rotateList || [0],
      getPadding: field(options.padding || 1),
      getFontStyle: field(options.fontStyle || 'normal'),
      getFontWeight: field(options.fontWeight || 'normal'),
      // fontField: options.fontFamily,
      // fontWeightField: options.fontWeight,
      // fontStyleField: options.fontStyle,
      getFontOpacity: options.fontOpacity ? field(options.fontOpacity) : () => 1
    };

    initFontSizeScale(data, wordsConfig, segmentationOutput);

    /** step3: 收集 layoutConfig, 初始化colorScale */
    const layoutConfig: LayoutConfigType = {
      // font style 相关
      size: options.size,
      ratio: options.ratio || 0.8,

      // layout 相关
      shapeUrl: options.shape,
      random: typeof options.random === 'undefined' ? true : options.random,
      textLayoutTimes: options.textLayoutTimes ?? 3,
      removeWhiteBorder: options.removeWhiteBorder,
      layoutMode: options.layoutMode ?? 'default',
      fontSizeShrinkFactor: options.fontSizeShrinkFactor ?? 0.8,
      stepFactor: options.stepFactor ?? 1,
      importantWordCount: options.importantWordCount ?? 10,
      globalShinkLimit: options.globalShinkLimit || 0.2,
      // textLengthLimit: 10,
      fontSizeEnlargeFactor: options.fontSizeEnlargeFactor ?? 1.5,

      // fill 相关
      fillingRatio: options.fillingRatio ?? 0.7,
      fillingTimes: options.fillingTimes ?? 4,
      // fillingXRatioStep: options.fillingXRatioStep || 0,
      // fillingYRatioStep: options.fillingYRatioStep || 0,
      // fillingRatioStep: 步长占长宽的比例，优先级高于fillingStep
      fillingXStep: options.fillingXRatioStep
        ? Math.max(Math.floor(options.size[0] * options.fillingXRatioStep), 1)
        : options.fillingXStep ?? 4,
      fillingYStep: options.fillingYRatioStep
        ? Math.max(Math.floor(options.size[1] * options.fillingYRatioStep), 1)
        : options.fillingYStep ?? 4,
      fillingInitialFontSize: options.fillingInitialFontSize,
      fillingDeltaFontSize: options.fillingDeltaFontSize,
      fillingInitialOpacity: options.fillingInitialOpacity ?? 0.8,
      fillingDeltaOpacity: options.fillingDeltaOpacity ?? 0.05,

      // fill font style 相关
      getFillingFontFamily: field(options.fillingFontFamily || 'sans-serif'),
      getFillingFontStyle: field(options.fillingFontStyle || 'normal'),
      getFillingFontWeight: field(options.fillingFontWeight || 'normal'),
      getFillingPadding: field(options.fillingPadding ?? 0.4),
      fillingRotateList: options.fillingRotateList ?? [0, 90],
      fillingDeltaFontSizeFactor: options.fillingDeltaFontSizeFactor ?? 0.2,

      // fill color 相关
      fillingColorList: options.fillingColorList || ['#537EF5'],

      // 经过计算，补充的内容
      sameColorList: false,

      minInitFontSize: options.minInitFontSize ?? 10,
      minFontSize: options.minFontSize ?? 4,
      minFillFontSize: options.minFillFontSize ?? 2
    };
    // 核心词与填充词colorList和colorField不一致时，会给填充词设置独立scale
    const sameColorList = colorListEqual(wordsConfig.colorList, layoutConfig.fillingColorList);
    layoutConfig.sameColorList = sameColorList;
    initColorScale(data, wordsConfig, layoutConfig, options);

    /** step4: 初始化填充次fontSize */
    initFillingWordsFontSize(data, wordsConfig, layoutConfig, segmentationOutput);

    // 过滤掉上游 source 中的填充词，上游数据相关，待去除 @chensiji
    // data = data.filter((d) => !d.isFillingWord || d.isFillingWord !== true)

    /** step5: 初始化words信息，并执行layout算法 */
    // 初始化单词信息, 用个代码块避免变量污染外面的变量环境
    const {
      getText,
      getFontFamily,
      getFontStyle,
      getFontWeight,
      getPadding,
      getColor,
      getFillingColor,
      getColorHex,
      fontSizeScale,
      colorScale,
      fillingColorScale,
      getFontOpacity,
      rotateList
    } = wordsConfig;

    const words: CloudWordType[] = data.map(datum => {
      return {
        x: 0,
        y: 0,
        weight: 0,
        text: getText(datum),
        // text: addEllipsis(text(word), config.textLengthLimit),
        fontFamily: getFontFamily(datum),
        fontWeight: getFontWeight(datum),
        fontStyle: getFontStyle(datum),
        rotate: rotateList[~~(segmentationInput.randomGenerator() * rotateList.length)],
        fontSize: Math.max(layoutConfig.minInitFontSize, ~~fontSizeScale(datum)),
        opacity: getFontOpacity(datum),
        padding: getPadding(datum),
        color: (getColorHex && getColorHex(datum)) || (colorScale && colorScale(getColor(datum))) || 'black',
        fillingColor:
          getFillingColor && (options.colorField?.field !== options.fillingColorField?.field || !sameColorList)
            ? (getColorHex && getColorHex(datum)) ||
              (fillingColorScale && fillingColorScale(getFillingColor(datum))) ||
              'black'
            : undefined,
        datum: datum,
        visible: true,
        hasPlaced: false
        // 上游数据相关，待去除 @chensiji
        // isInAdd: add.indexOf(word) !== -1,
      };
    });

    // 计算所有单词的权重 weight，用于后续的布局
    const wordsMaxFontSize = maxInArray(words.map(word => word.fontSize));
    words.forEach(word => (word.weight = word.fontSize / wordsMaxFontSize));
    words.sort((a, b) => b.weight - a.weight);

    // 进行布局
    const { fillingWords, successedWords, failedWords } = cloud(words, layoutConfig, segmentationOutput);
    const textKey = (options.text as FieldOption)?.field ?? 'textKey'; // 记录用户是用什么 key 存储 text 信息
    const dataIndexKey = options.dataIndexKey ?? 'defaultDataIndexKey';

    /** step5: 将单词信息转换为输出 */
    const as = options.as ? { ...OUTPUT, ...options.as } : OUTPUT;
    let w;
    let t;
    const modKeywords = [];
    for (let i = 0; i < words.length; ++i) {
      w = words[i];
      t = w.datum;
      t[as.x] = w.x;
      t[as.y] = w.y;
      t[as.fontFamily] = w.fontFamily;
      t[as.fontSize] = w.fontSize;
      t[as.fontStyle] = w.fontStyle;
      t[as.fontWeight] = w.fontWeight;
      t[as.angle] = degreeToRadian(w.rotate);
      t[as.opacity] = w.opacity;
      t[as.visible] = w.visible;
      t[as.isFillingWord] = false;
      t[as.color] = w.color;
      t[dataIndexKey] = `${w.text}_${i}_keyword`;

      modKeywords.push(t);
    }

    const fillingWordsData: any[] = [];
    fillingWords.forEach((word, index) => {
      const t = { ...word.datum };
      t[as.x] = word.x;
      t[as.y] = word.y;
      t[as.fontFamily] = word.fontFamily;
      t[as.fontSize] = word.fontSize;
      t[as.fontStyle] = word.fontStyle;
      t[as.fontWeight] = word.fontWeight;
      t[as.angle] = degreeToRadian(word.rotate);
      t[as.opacity] = word.opacity;
      t[as.visible] = word.visible;
      t[as.isFillingWord] = true;
      t[as.color] = !getFillingColor
        ? layoutConfig.fillingColorList[~~(segmentationInput.randomGenerator() * layoutConfig.fillingColorList.length)]
        : options.colorField?.field !== options.fillingColorField?.field || !sameColorList
        ? word.fillingColor
        : word.color;
      t[textKey] = word.text;

      // 保证绘制时，mark的唯一性
      t[dataIndexKey] = `${word.text}_${index}_fillingWords`;

      // updateid(t)
      fillingWordsData.push(t);
    });

    // 抛出事件
    if (this.view && this.view.emit) {
      this.view.emit(WORDCLOUD_SHAPE_HOOK_EVENT.AFTER_WORDCLOUD_SHAPE_LAYOUT, { successedWords, failedWords });
      const stage = this.view.renderer?.stage();

      if (stage) {
        stage.hooks.afterRender.tap(WORDCLOUD_SHAPE_HOOK_EVENT.AFTER_WORDCLOUD_SHAPE_DRAW, () => {
          this.view.emit(WORDCLOUD_SHAPE_HOOK_EVENT.AFTER_WORDCLOUD_SHAPE_DRAW, { successedWords, failedWords });
          stage.hooks.afterRender.unTap(WORDCLOUD_SHAPE_HOOK_EVENT.AFTER_WORDCLOUD_SHAPE_DRAW);
        });
      }
    }

    // 最后将核心词和填充词合并返回
    this.progressiveResult = modKeywords.concat(fillingWordsData);
  }

  release() {
    this.segmentationInput = null;
    this.data = null;
    this.progressiveResult = null;
    this.options = null;
  }
}

/**
 * 根据用户输入的参数初始化 colorScale
 */
const initColorScale = (data: any[], wordsConfig: wordsConfigType, layoutConfig: LayoutConfigType, options: any) => {
  const { colorMode, getColor, getFillingColor } = wordsConfig;
  const { sameColorList } = layoutConfig;
  let colorScale;
  let colorList = wordsConfig.colorList;
  let fillingColorScale;
  let fillingColorList = layoutConfig.fillingColorList;
  if (colorMode === 'ordinal') {
    // 序数着色模式下
    const uniqueColorField = data.map(word => getColor(word));
    colorScale = (datum: any) => {
      return new OrdinalScale().domain(uniqueColorField).range(colorList).scale(datum);
    };

    if (getFillingColor && (options.colorField?.field !== options.fillingColorField?.field || !sameColorList)) {
      const uniquefillingColorField = data.map(datum => getFillingColor(datum));
      fillingColorScale = (datum: any) => {
        return new OrdinalScale().domain(uniquefillingColorField).range(fillingColorList).scale(datum);
      };
    }
  } else {
    // 如果用户只输入了一个 color，无法构成 colorRange，则进行兜底
    if (colorList.length === 1) {
      colorList = [colorList[0], colorList[0]];
    }
    // 线性着色模式下
    const valueScale = new LinearScale().domain(extent(getColor, data)).range(colorList);

    colorScale = (i: any) => {
      return valueScale.scale(i);
    };

    if (getFillingColor && (options.colorField?.field !== options.fillingColorField?.field || !sameColorList)) {
      // 线性着色模式下
      // 如果用户只输入了一个 color，无法构成 colorRange，则进行兜底
      if (fillingColorList.length === 1) {
        fillingColorList = [fillingColorList[0], fillingColorList[0]];
      }
      const fillingValueScale = new LinearScale().domain(extent(getFillingColor, data)).range(fillingColorList);

      fillingColorScale = (i: any) => {
        return fillingValueScale.scale(i);
      };
    }
  }
  Object.assign(wordsConfig, { colorScale, fillingColorScale });
};

/**
 * 根据用户输入参数初始化 fontSizeScale
 */
const initFontSizeScale = (data: any[], wordsConfig: wordsConfigType, segmentationOutput: SegmentationOutputType) => {
  let { fontSizeRange: range } = wordsConfig;
  const { getFontSize, getText } = wordsConfig;
  // const { shapeArea, ratio } = segmentationOutput

  /*
   * 为避免考虑超长词将字号范围计算的非常小，并且超长词同时无法正确布局的情况
   * 需要在计算字号范围时排除超长词，超长词确定标准：
   * textLength * 12 > sqrt(shapeArea)
   * （字号为12px时，该词长度大于预期长宽的两倍，经验参数）
   * 超长词不参与字号的自适应计算，但是任然会参与布局
   * 如果用户遇到边界情况需要布局超长词，需要手动指定fontSizeRange
   */
  // const shapeSizeLimitTextLength = Math.ceil(Math.sqrt(shapeArea) / 12);

  // 生成 fontSize 的 scale
  let fontSizeScale;
  if (!getFontSize) {
    // 如果用户没有提供 fontSize 映射的 field, 自动计算 一个固定的 fontSize
    /**
     * 单词 字长*(fontSize)**2 与真实的单词面积的大概比例为 b
     * 目的为 求 x，从而得到最适合的 fontSizeRange
     * 更详细的算法解析看文档
     */
    const words = data.map(word => ({
      text: getText(word)
    }));
    // const wordArea =
    //   b *
    //   words.reduce((acc, word) => {
    //     const textLength = calTextLength(word.text)
    //     return textLength < shapeSizeLimitTextLength ? acc + textLength : acc
    //   }, 0)
    // const x0 = Math.sqrt(ratio * (shapeArea / wordArea))

    const x = getInitialFontSize(words, segmentationOutput, false);

    // fontSize = x
    // 有了 fontSize 后求解 fontSizeScale
    fontSizeScale = functor(x);
    // console.log('自动计算的 fontSize', fontSize)
  } else if (getFontSize && range) {
    // fontSize 和 range 都提供了
    const sizeScale = new SqrtScale().domain(extent(getFontSize, data)).range(range);
    fontSizeScale = (datum: any) => {
      return sizeScale.scale(getFontSize(datum));
    };
  } else if (getFontSize && isFunction(getFontSize) && !range) {
    // 提供了 fontSize 的取值的 key，没提供 range，自动计算 range
    /**
     * 定义 fontSizeRange 为 [ax, x]
     * 期望单词占图形面积的比例为 ratio
     * 单词 字长*(权重映射后的fontSize)**2 与真实的单词面积的大概比例为 b
     * 目的为 求 x，从而得到最适合的 fontSizeRange
     * 更详细的算法解析看文档
     */
    const a = 0.5;
    const [min, max] = extent(getFontSize, data);
    const words = data.map(datum => ({
      text: getText(datum),
      value: getFontSize(datum),
      // weight: (fontSize(word) - min) / (max - min),
      weight: max === min ? 1 : (getFontSize(datum) - min) / (max - min)
    }));
    // const wordArea =
    //   b *
    //   words.reduce((acc, word) => {
    //     const textLength = calTextLength(word.text)
    //     if (textLength > shapeSizeLimitTextLength) return acc;
    //     return acc + textLength * (a + (1 - a) * word.weight) ** 2
    //   }, 0)
    // const x0 = Math.sqrt(ratio * (shapeArea / wordArea))

    const x = getInitialFontSize(words, segmentationOutput, true);

    range = [~~(a * x), ~~x];
    // 有了 range 后求解 fontSizeScale
    const sizeScale = new SqrtScale().domain(extent(getFontSize, data)).range(range);
    fontSizeScale = (datum: any) => {
      return sizeScale.scale(getFontSize(datum)); // 最小核心词初始字号10px
    };
    // console.log('自动计算的 range', range)
  }

  // 将相关配置更新到 wordsConfig 上
  Object.assign(wordsConfig, { getFontSize, fontSizeRange: range, fontSizeScale });
};

const getInitialFontSize = (words: any[], segmentationOutput: SegmentationOutputType, weight: boolean) => {
  /**
   * 定义 fontSizeRange 为 [ax, x]
   * 期望单词占图形面积的比例为 ratio
   * 单词 字长*(权重映射后的fontSize)**2 与真实的单词面积的大概比例为 b
   * 目的为 求 x，从而得到最适合的 fontSizeRange
   * 更详细的算法解析看文档
   */

  const a = 0.5;
  const b = 1.7;
  const shapeArea = segmentationOutput.shapeArea;
  const ratio = segmentationOutput.ratio;
  const regions = segmentationOutput.segmentation.regions;

  /*
   * 为避免考虑超长词将字号范围计算的非常小，并且超长词同时无法正确布局的情况
   * 需要在计算字号范围时排除超长词，超长词确定标准：
   * textLength * 12 > sqrt(shapeArea)
   * （字号为12px时，该词长度大于预期长宽的两倍，经验参数）
   * 超长词不参与字号的自适应计算，但是任然会参与布局
   * 如果用户遇到边界情况需要布局超长词，需要手动指定fontSizeRange
   */
  const shapeSizeLimitTextLength = Math.ceil(Math.sqrt(shapeArea) / 12);

  const wordArea =
    // b *
    words.reduce((acc, word) => {
      // 旧版 VGrammar 逻辑
      // const textLength = calTextLength(word.text, segmentationOutput.textLengthLimit)
      const textLength = calTextLength(word.text);
      return textLength < shapeSizeLimitTextLength
        ? acc + textLength * (weight ? (a + (1 - a) * word.weight) ** 2 : 1)
        : acc;
    }, 0);
  if (wordArea === 0) {
    // 只有一个超长词，以12px字号开始初始布局
    return 12;
  }

  let x = 20;
  if (regions.length === 1) {
    // 单一区域
    x = Math.sqrt(ratio * (shapeArea / (wordArea * b)));
  } else {
    const xArr = [];
    for (let i = 0; i < regions.length; i++) {
      const regionArea = regions[i].area;
      const regionAspect = regions[i].ratio;
      const regionRatio = regionArea / shapeArea;
      if (regionRatio < 0.1) {
        continue;
      }
      // 考虑区域长宽比对文字面积的影响(2.7 - regionAspect)，经验参数
      const regionWordArea = regionRatio * (wordArea * (regionAspect < 1 ? 2.7 - regionAspect : b));
      const x = Math.sqrt(ratio * (regionArea / regionWordArea));

      xArr.push(x);
    }

    if (xArr.length) {
      x = Math.min(...xArr);
    } else {
      // 特殊情况当做单一区域处理
      x = Math.sqrt(ratio * (shapeArea / (wordArea * b)));
    }
  }
  return x;
};

/**
 * 自动计算 fillingWords 相关的 fontSize
 */
function initFillingWordsFontSize(
  data: any[],
  wordsConfig: wordsConfigType,
  layoutConfig: LayoutConfigType,
  segmentationOutput: SegmentationOutputType
) {
  const { getText } = wordsConfig;
  let { fillingInitialFontSize, fillingDeltaFontSize } = layoutConfig;
  const { fillingRatio } = layoutConfig;
  /*
   * 为避免考虑超长词将字号范围计算的非常小，并且超长词同时无法正确布局的情况
   * 需要在计算字号范围时排除超长词，超长词确定标准：
   * textLength * 4 > sqrt(shapeArea)
   * （字号为4px时，该词长度大于预期长宽的两倍，经验参数）
   * 超长词不参与字号的自适应计算，但是任然会参与布局
   * 如果用户遇到边界情况需要布局超长词，需要手动指定fontSizeRange
   */
  const shapeSizeLimitTextLength = Math.ceil(Math.sqrt(segmentationOutput.shapeArea) / 4);

  // 两个值中有一个每天写则自动计算
  if (!fillingInitialFontSize || !fillingDeltaFontSize) {
    /**
     * 自动计算的依据是 填充面积应该与 单词平均长度 * fontSize**2 成一个固定比例 a
     */

    const a = fillingRatio / 100;

    const averageLength =
      data.reduce((acc, word) => {
        const length = calTextLength(getText(word));
        if (length > shapeSizeLimitTextLength) {
          return acc;
        }
        return acc + length;
      }, 0) / data.length;
    let fontSize;
    if (averageLength === 0) {
      // 只有一个超长词，以8px字号开始初始布局
      fontSize = 8;
    } else {
      const area = segmentationOutput.shapeArea * 0.2;
      fontSize = Math.sqrt(a * (area / averageLength));
    }

    fillingInitialFontSize = ~~fontSize;
    fillingDeltaFontSize = fontSize * layoutConfig.fillingDeltaFontSizeFactor;

    Object.assign(layoutConfig, {
      fillingInitialFontSize,
      fillingDeltaFontSize
    });
    // console.log('自动计算的 filling', [
    //   fillingInitialFontSize,
    //   fillingDeltaFontSize,
    // ])
  }
}

const extent = (field: any, data: any[]) => {
  let min = +Infinity;
  let max = -Infinity;
  const n = data.length;
  let v: any;

  for (let i = 0; i < n; ++i) {
    // 字符串类型转换
    v = toNumber(field(data[i]));
    if (v < min) {
      min = v;
    }
    if (v > max) {
      max = v;
    }
  }

  // 如果单条数据，匹配最大字号
  if (data.length === 1 && min === max) {
    min -= 10000;
  }

  return [min, max];
};

/**
 * 取数逻辑
 */
const field = <T>(option: FieldOption | TagItemAttribute<T>) => {
  if (!option) {
    return null;
  }
  if (typeof option === 'string' || typeof option === 'number') {
    return () => option;
  } else if (isFunction(option)) {
    return option as (datum: any) => T;
  }
  return (datum: any) => datum[(option as FieldOption).field];
};
