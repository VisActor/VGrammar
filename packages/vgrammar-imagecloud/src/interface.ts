import type {
  TextShapeMask,
  GeometricMaskShape,
  SegmentationOutputType as SegmentationOutputTypeBase,
  FieldOption,
  TagItemAttribute
} from '@visactor/vgrammar-util';

export interface SegmentationOutputType extends SegmentationOutputTypeBase {
  transparentMaskCanvas?: HTMLCanvasElement;
}

export type ImageCollageType = ImageInput & {
  valid: boolean;
  aspectRatio: number;
  x: number;
  y: number;
  width: number;
  height: number;
  weight: number;
  opacity: number;
  padding: number;
  frequency: number; // 记录图片出现频率，图片可能重复出现
  distance: number;
  datum: any;
  clipConfig?: { shape: string };
  _widthWithPadding: number;
  _heightWithPadding: number;
  _left: number;
  _top: number;
  _leftWithoutPadding: number;
  _topWithoutPadding: number;
} & { [key: string]: any };

export type GridLayoutCellType = {
  centerX: number;
  centerY: number;
  x: number;
  y: number;
  row: number;
  col: number;
  distance: number;
  isEdge?: boolean;
  intersectPixels?: number;
  image?: ImageCollageType;
};

export type GridLayoutContext = {
  cellType: 'rect' | 'circle' | 'hexagonal' | string;
  // rect 相关
  cellWidth: number;
  cellHeight: number;
  // circle 相关
  cellRadius?: number;
  // hexagonal 相关
  cellHexPoints?: { x: number; y: number }[];
  cellHexSideLength?: number;

  cellInfo: GridLayoutCellType[];
  cellCount: number;
  cellPixelCount: number;
  clipPath: string;
  eachPixel: (...args: any) => void;
};

/** 对外的配置接口定义 */

export type ImageConfig = {
  imageSize?: number;
  imageSizeRange?: [number, number];
  padding?: number;
};

export type ImageInput = {
  url: string;
  weight?: number;
};

export type AsType = {
  visible?: string;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  opacity?: string;
  angle?: string;
  clipPath?: string;
  zIndex?: string;
  datum?: any;
  distance?: string;
};

export type LayoutConfigType = SpiralLayoutConfig | GridLayoutConfig | StackLayoutConfig;

/** 螺旋线布局 */
export type SpiralLayoutConfig = {
  layoutMode: 'spiral';
  /** 螺旋线种类
   * @default 'archimedean'
   */
  spiralType?: 'archimedean' | 'rectangular';

  /**
   * 图片填充迭代次数
   * @default 4
   * */
  fillingTimes?: number;
  /** 填充图片的最小尺寸 */
  minFillingImageSize?: number;
};

/**
 * 网格布局
 * 网格布局下，每个网格单元的大小是固定的，图片的权重不再会影响图片的大小，仅会影响图片的位置。
 */
export type GridLayoutConfig = {
  layoutMode: 'grid';
  /** 网格单元形状 */
  cellType?: 'rect' | 'circle' | 'hexagonal';
  /**
   * 矩形网格单元的宽高比
   * @description 当 cellType 为 'rect' 时，该值有效
   * @default 1
   * */
  rectAspectRatio?: number;
  /**
   * 图片的布局方式
   * - 'default': 图片填满网格单元，尽可能排列成遮罩的形状
   * - 'masked': 图片填满网格单元，并应用遮罩
   * - 'edge': 图片延着遮罩边缘布局
   * @default 'default'
   */
  placement?: 'default' | 'masked' | 'edge';
};

/**
 * 堆叠布局
 * 堆叠布局下，图片之间可以发生重叠。
 */
export type StackLayoutConfig = {
  layoutMode: 'stack';
  /**
   * 图片的布局方式
   * - 'default': 图片填满网格单元，尽可能排列成遮罩的形状
   * - 'masked': 图片填满网格单元，并应用遮罩
   * - 'edge': 图片延着遮罩边缘布局
   * @default 'default'
   */
  placement?: 'default' | 'masked' | 'edge';
  /**
   * 最大旋转角度
   * @default 1.22173 - 默认值为角度 70 度，转换为弧度：
   *      70 * (Math.PI / 180) ≈ 1.22173
   * */
  maxAngle?: number;
};

export type ImageCloudOptions = {
  size: [number, number] | (() => [number, number]);
  image: FieldOption | TagItemAttribute<string> | string;

  weight?: FieldOption | TagItemAttribute<number> | number;

  imageConfig?: ImageConfig;
  mask?: string | TextShapeMask | GeometricMaskShape;
  maskConfig?: {
    removeWhiteBorder?: boolean;
    /**
     * 二值化阈值。
     * 默认情况下，透明或白色的像素会被认为是背景进行剔除。
     * @default undefined
     */
    threshold?: number;
    /**
     * 反转图像
     * @default false
     */
    invert?: boolean;
    /**
     * 边缘模糊半径
     * @default 0
     */
    edgeBlur?: number;
  };

  layoutConfig?: LayoutConfigType;

  ratio?: number;

  as?: AsType;

  onUpdateMaskCanvas?: (inputCanvas?: HTMLCanvasElement, maskCanvas?: HTMLCanvasElement) => void;
  onLayoutEnd?: (images: ImageCollageType[]) => void;
};
