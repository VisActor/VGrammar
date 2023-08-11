import { CloudLayout } from './cloud-layout';
import { isFunction, isNumber, isString, toNumber, Logger } from '@visactor/vutils';
import type { TagOutputItem, TagItemAttribute } from './interface';
import { GridLayout } from './grid-layout';
import { FastLayout } from './fast-layout';
import { error } from '@visactor/vgrammar-util';

const OUTPUT = {
  x: 'x',
  y: 'y',
  z: 'z',
  fontFamily: 'fontFamily',
  fontSize: 'fontSize',
  fontStyle: 'fontStyle',
  fontWeight: 'fontWeight',
  angle: 'angle'
};

export type FieldOption = { field: string };
export type CallbackOption = (datum: any) => any;
export type AsType = {
  x: string;
  y: string;
  z: string;
  fontFamily: string;
  fontSize: string;
  fontStyle: string;
  fontWeight: string;
  angle: string;
};

export const transform = (
  options: {
    size?: [number, number];
    fontFamily?: FieldOption | TagItemAttribute<string>;
    fontStyle?: FieldOption | TagItemAttribute<string>;
    fontWeight?: FieldOption | TagItemAttribute<string>;
    fontSize?: FieldOption | TagItemAttribute<number>;
    fontSizeRange?: [number, number];
    rotate?: FieldOption | TagItemAttribute<number>;
    text: FieldOption | CallbackOption | string;
    spiral?: string;
    padding?: FieldOption | TagItemAttribute<number>;
    shape?: string;
    shrink?: boolean;
    enlarge?: boolean;
    clip?: boolean;
    minFontSize?: number;
    randomVisible?: boolean;
    as?: AsType;
    layoutType?: string;
    progressiveTime?: number;
    progressiveStep?: number;
    depth_3d?: number;
    postProjection?: string;
  },
  upstreamData: any[]
) => {
  if (options.size && (options.size[0] <= 0 || options.size[1] <= 0)) {
    const logger = Logger.getInstance();
    logger.info('Wordcloud size dimensions must be greater than 0');
    // size非法不报错，不进行布局，ChartSpace层会有用户初始化size为0的情况
    return [];
  }

  /** 输入数据转换 */
  const data = upstreamData;
  const canvasSize = (options.size ?? [500, 500]).slice() as [number, number];
  // canvasSize必须是整数
  canvasSize[0] = Math.floor(canvasSize[0]);
  canvasSize[1] = Math.floor(canvasSize[1]);
  const fontFamily = options.fontFamily ? field(options.fontFamily) : 'sans-serif';
  const fontStyle = options.fontStyle ? field(options.fontStyle) : 'normal';
  const fontWeight = options.fontWeight ? field(options.fontWeight) : 'normal';
  const rotate = options.rotate ? field(options.rotate) : 0;
  const text = field<string | number>(options.text);
  const spiral = options.spiral ?? 'archimedean';
  const padding = options.padding ? field(options.padding) : 1;
  const shape = options.shape ?? 'square';
  const shrink = options.shrink ?? false;
  const enlarge = options.enlarge ?? false;
  const clip = options.clip ?? false;
  const minFontSize = options.minFontSize;
  const randomVisible = options.randomVisible;
  const as = options.as || OUTPUT;
  const depth_3d = options.depth_3d;
  const postProjection = options.postProjection;

  // 根据range转换fontSize
  let fontSize = options.fontSize ? field(options.fontSize) : 14;
  const fontSizeRange = options.fontSizeRange;
  // 只有fontSize不为固定值时，fontSizeRange才生效
  if (fontSizeRange && !isNumber(fontSize)) {
    const fsize: any = fontSize;
    const fontSizeSqrtScale = generateSqrtScale(extent(fsize, data), fontSizeRange as number[]);

    fontSize = datum => {
      return fontSizeSqrtScale(fsize(datum));
    };
  }

  let Layout: any = CloudLayout;

  if (options.layoutType === 'fast') {
    Layout = FastLayout;
  } else if (options.layoutType === 'grid') {
    Layout = GridLayout;
  }

  /** 执行布局算法 */
  const layout = new Layout({
    text,
    padding,
    spiral,
    shape,
    rotate,
    fontFamily,
    fontStyle,
    fontWeight,
    fontSize,
    shrink,
    clip,
    enlarge,
    minFontSize,
    random: randomVisible,
    progressiveStep: options.progressiveStep,
    progressiveTime: options.progressiveTime,
    outputCallback: (words: any[]) => {
      const res: any[] = [];
      let t: any;
      let w: TagOutputItem;

      for (let i = 0, len = words.length; i < len; i++) {
        w = words[i];
        t = w.datum;
        t[as.x] = w.x;
        t[as.y] = w.y;
        t[as.fontFamily] = w.fontFamily;
        t[as.fontSize] = w.fontSize;
        t[as.fontStyle] = w.fontStyle;
        t[as.fontWeight] = w.fontWeight;
        t[as.angle] = w.angle;

        if (postProjection === 'StereographicProjection') {
          stereographicProjection(canvasSize, w, t, as, depth_3d);
        }

        res.push(t);
      }
      return res;
    }
  });

  layout.layout(data, {
    width: canvasSize[0],
    height: canvasSize[1]
  });

  if (options.progressiveStep > 0 || options.progressiveTime > 0) {
    return {
      progressive: layout
    };
  }

  return layout.output();
};

// 取数逻辑
const field = <T>(option: FieldOption | TagItemAttribute<T>) => {
  if (isString(option) || isNumber(option) || isFunction(option)) {
    return option as TagItemAttribute<T>;
  }
  return (datum: any) => datum[(option as FieldOption).field] as T;
};

const sqrt = (x: number) => {
  return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
};

// simulation sqrt scale
const generateSqrtScale = (domain: number[], range: number[]) => {
  if (domain[0] === domain[1]) {
    return (datum: number) => range[0]; // match smallest fontsize
  }

  const s0 = sqrt(domain[0]);
  const s1 = sqrt(domain[1]);
  const min = Math.min(s0, s1);
  const max = Math.max(s0, s1);

  return (datum: number) => ((sqrt(datum) - min) / (max - min)) * (range[1] - range[0]) + range[0];
};

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

function stereographicProjection(canvasSize: [number, number], w: any, t: any, as: any, depth_3d?: number) {
  const maxSize = Math.max(canvasSize[0], canvasSize[1]);
  const r = maxSize / 2;
  const out = _StereographicProjection(canvasSize[0], canvasSize[1], r, { x: r, y: r, z: depth_3d ?? r }, w);
  t[as.x] = out.x;
  t[as.y] = out.y;
  t[as.z] = out.z;
}

function _StereographicProjection(
  w: number,
  h: number,
  r: number,
  center: { x: number; y: number; z: number },
  word: { x: number; y: number }
) {
  const { x, y } = word;
  const theta = (x / w) * Math.PI * 2;
  let phi = Math.PI - (y / h) * Math.PI;
  // 由于cos函数的特性，调整phi的分布，向内聚
  phi += ((phi < Math.PI / 2 ? 1 : -1) * Math.pow(Math.min(phi - Math.PI / 2, 1), 2)) / 5;
  const nx = r * Math.sin(phi) * Math.cos(theta) + center.x;
  const ny = r * Math.cos(phi) + center.y;
  const nz = r * Math.sin(phi) * Math.sin(theta) + center.z;
  return {
    x: nx,
    y: ny,
    z: nz
  };
}
