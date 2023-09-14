import { Logger, degreeToRadian, isFunction, isNil, isValid, toNumber } from '@visactor/vutils';
import { error } from '@visactor/vgrammar-util';
import type {
  TagItemAttribute,
  FieldOption,
  AsType,
  SegmentationInputType,
  SegmentationOutputType,
  LayoutConfigType,
  wordsConfigType,
  CloudWordType
} from './interface';
import { vglobal } from '@visactor/vrender';
import { loadAndHandleImage, segmentation } from './segmentation';
import { LinearScale, OrdinalScale, SqrtScale } from '@visactor/vscale';
import cloud from './cloud-shape-layout';
import { calTextLength, colorListEqual, fakeRandom, functor, WORDCLOUD_SHAPE_HOOK_EVENT } from './util';
import type { IView } from '@visactor/vgrammar-core';

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

export const transform = async (
  options: {
    // data index key
    dataIndexKey?: string;

    // font value 相关
    text: FieldOption | TagItemAttribute<string> | string;

    // font style 相关
    size?: [number, number];
    fontFamily?: FieldOption | TagItemAttribute<string> | string;
    fontStyle?: FieldOption | TagItemAttribute<string> | string;
    fontOpacity?: FieldOption | TagItemAttribute<number> | number;
    fontWeight?: FieldOption | TagItemAttribute<string> | string;
    fontSize?: FieldOption | TagItemAttribute<number> | number;
    fontSizeRange?: [number, number];
    padding?: FieldOption | TagItemAttribute<number> | number;

    // font color 相关
    colorMode?: 'linear' | 'ordinal';
    colorField?: FieldOption;
    colorHexField?: FieldOption;
    colorList?: string[];

    // font rotate 相关
    rotate?: FieldOption | TagItemAttribute<number> | number;
    rotateList?: number[];

    // layout 相关
    shape: string;
    random?: boolean;
    textLayoutTimes?: number;
    layoutMode?: 'default' | 'ensureMapping' | 'ensureMappingEnlarge';
    ratio?: number;
    removeWhiteBorder?: boolean;
    fontSizeShrinkFactor?: number;
    stepFactor?: number;
    importantWordCount?: number;
    globalShinkLimit?: number;
    fontSizeEnlargeFactor?: number;

    // fill 相关
    fillingRatio?: number;
    fillingTimes?: number;
    fillingXRatioStep?: number;
    fillingYRatioStep?: number;
    fillingXStep?: number;
    fillingYStep?: number;
    fillingInitialFontSize?: number;
    fillingDeltaFontSize?: number;
    fillingInitialOpacity?: number;
    fillingDeltaOpacity?: number;

    // fill font style 相关
    fillingFontFamily?: FieldOption | TagItemAttribute<string> | string;
    fillingFontStyle?: FieldOption | TagItemAttribute<string> | string;
    fillingFontWeight?: FieldOption | TagItemAttribute<string> | string;
    fillingPadding?: FieldOption | TagItemAttribute<number> | number;
    fillingDeltaFontSizeFactor?: number;

    // fill color 相关
    fillingColorList?: string[];
    fillingColorField?: FieldOption;

    // fill rotate 相关
    fillingRotateList?: number[];

    as?: AsType;

    // 核心词最小初始布局字号
    minInitFontSize?: number;
    // 核心词最小布局字号
    minFontSize?: number;
    // 填充词词最小布局字号
    minFillFoontSize?: number;
  },
  upstreamData: any[],
  parameters?: any,
  view?: IView
) => {
  /** options 配置错误提示 */
  if (
    !options.size ||
    isNil(options.size[0]) ||
    isNil(options.size[1]) ||
    options.size[0] <= 0 ||
    options.size[1] <= 0
  ) {
    const logger = Logger.getInstance();
    logger.info('Wordcloud size dimensions must be greater than 0');
    // size非法不报错，不进行布局，ChartSpace层会有用户初始化size为0的情况
    return [];
  }
  /** size 处理, 如果是小数, segmentation 计算会有问题导致place陷入死循环 */
  options.size = [Math.ceil(options.size[0]), Math.ceil(options.size[1])];

  if (!options.shape) {
    error('WordcloudShape shape must be specified.');
  }
  if (!options.text) {
    error('WordcloudShape text must be specified.');
  }

  view?.emit && view.emit(WORDCLOUD_SHAPE_HOOK_EVENT.BEFORE_WORDCLOUD_SHAPE_LAYOUT);

  /** 输入输出数据相关 */
  const data = upstreamData;
  const as = options.as || OUTPUT;

  // 第一次数据流到这里data为空，如果不做判断，走到布局算法会报错
  if (!data || data.length === 0) {
    return [];
  }

  /** step1: 根据shapeUrl, 计算segmentation */
  const segmentationInput: SegmentationInputType = {
    shapeUrl: options.shape,
    size: options.size,
    ratio: options.ratio || 0.8,
    tempCanvas: undefined,
    tempCtx: undefined,
    removeWhiteBorder: options.removeWhiteBorder || false,
    boardSize: [0, 0],
    random: false,
    randomGenerator: undefined
  };

  // 全局共用的临时画板，此处需要对小程序的 canvas 进行兼容
  const tempCanvas = vglobal.createCanvas({ width: options.size[0], height: options.size[1] });
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.textAlign = 'center';
  tempCtx.textBaseline = 'middle';
  segmentationInput.tempCanvas = tempCanvas;
  segmentationInput.tempCtx = tempCtx;

  // board 的宽必须为 32 的倍数
  const boardW = ((options.size[0] + 31) >> 5) << 5;
  segmentationInput.boardSize = [boardW, options.size[1]];

  // 用于随机的随机数生成器
  if (segmentationInput.random) {
    segmentationInput.randomGenerator = Math.random;
  } else {
    segmentationInput.randomGenerator = fakeRandom();
  }

  const shapeImage = await loadAndHandleImage(segmentationInput);

  if (!shapeImage) {
    return [];
  }

  // 对用户输入的图形进行预处理
  const segmentationOutput: SegmentationOutputType = segmentation(shapeImage, segmentationInput);

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
    textLayoutTimes: options.textLayoutTimes || 3,
    removeWhiteBorder: options.removeWhiteBorder || false,
    layoutMode: options.layoutMode || 'default',
    fontSizeShrinkFactor: options.fontSizeShrinkFactor || 0.8,
    stepFactor: options.stepFactor || 1,
    importantWordCount: options.importantWordCount || 10,
    globalShinkLimit: options.globalShinkLimit || 0.2,
    // textLengthLimit: 10,
    fontSizeEnlargeFactor: options.fontSizeEnlargeFactor || 1.5,

    // fill 相关
    fillingRatio: options.fillingRatio || 0.7,
    fillingTimes: options.fillingTimes || 4,
    // fillingXRatioStep: options.fillingXRatioStep || 0,
    // fillingYRatioStep: options.fillingYRatioStep || 0,
    // fillingRatioStep: 步长占长宽的比例，优先级高于fillingStep
    fillingXStep: options.fillingXRatioStep
      ? Math.max(Math.floor(options.size[0] * options.fillingXRatioStep), 1)
      : options.fillingXStep || 4,
    fillingYStep: options.fillingYRatioStep
      ? Math.max(Math.floor(options.size[1] * options.fillingYRatioStep), 1)
      : options.fillingYStep || 4,
    fillingInitialFontSize: options.fillingInitialFontSize,
    fillingDeltaFontSize: options.fillingDeltaFontSize,
    fillingInitialOpacity: options.fillingInitialOpacity || 0.8,
    fillingDeltaOpacity: options.fillingDeltaOpacity || 0.05,

    // fill font style 相关
    getFillingFontFamily: field(options.fillingFontFamily || 'sans-serif'),
    getFillingFontStyle: field(options.fillingFontStyle || 'normal'),
    getFillingFontWeight: field(options.fillingFontWeight || 'normal'),
    getFillingPadding: field(options.fillingPadding || 0.4),
    fillingRotateList: options.fillingRotateList || [0, 90],
    fillingDeltaFontSizeFactor: options.fillingDeltaFontSizeFactor || 0.2,

    // fill color 相关
    fillingColorList: options.fillingColorList || ['#537EF5'],

    // 经过计算，补充的内容
    sameColorList: false,

    minInitFontSize: options.minInitFontSize || 10,
    minFontSize: options.minFontSize || 4,
    minFillFoontSize: options.minFillFoontSize || 2
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
  const wordsMaxFontSize = Math.max(...words.map(word => word.fontSize));
  words.forEach(word => (word.weight = word.fontSize / wordsMaxFontSize));
  words.sort((a, b) => b.weight - a.weight);

  // 进行布局
  const { fillingWords, successedWords, failedWords } = cloud(words, layoutConfig, segmentationOutput);

  /** step5: 将单词信息转换为输出 */
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
    modKeywords.push(t);
  }

  const textKey = (options.text as FieldOption)?.field ?? 'textKey'; // 记录用户是用什么 key 存储 text 信息
  const dataIndexKey = options.dataIndexKey ?? 'defaultDataIndexKey';
  const fillingWordsData: any[] = [];
  fillingWords.forEach((word, index) => {
    const t = {};
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
  view?.emit && view.emit(WORDCLOUD_SHAPE_HOOK_EVENT.AFTER_WORDCLOUD_SHAPE_LAYOUT, { successedWords, failedWords });

  // 最后将核心词和填充词合并返回
  return modKeywords.concat(fillingWordsData);
};

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
