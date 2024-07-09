import { vglobal } from '@visactor/vrender-core';
import type { GeometricMaskShape, TextShapeMask } from './types/wordcloud';
import { getMaxRadiusAndCenter, getShapeFunction } from './shapes';
import type { IPointLike } from '@visactor/vutils';
import { polarToCartesian } from '@visactor/vutils';

export const generateIsEmptyPixel = (backgroundColor?: string) => {
  if (!backgroundColor || backgroundColor === '#fff') {
    return (imageData: ImageData, y: number, x: number) => {
      const width = imageData.width;
      return (
        imageData.data[y * width * 4 + x * 4 + 3] === 0 ||
        (imageData.data[y * width * 4 + x * 4 + 0] === 255 &&
          imageData.data[y * width * 4 + x * 4 + 1] === 255 &&
          imageData.data[y * width * 4 + x * 4 + 2] === 255)
      );
    };
  }

  /* Determine bgPixel by creating
      another canvas and fill the specified background color. */
  // eslint-disable-next-line no-undef
  const bctx = vglobal.createCanvas({ width: 1, height: 1 }).getContext('2d');

  bctx.fillStyle = backgroundColor;
  bctx.fillRect(0, 0, 1, 1);
  const bgPixel = bctx.getImageData(0, 0, 1, 1).data;

  return (imageData: ImageData, y: number, x: number) => {
    const width = imageData.width;

    return [0, 1, 2, 3].every(i => {
      return imageData.data[(y * width + x) * 4 + i] === bgPixel[i];
    });
  };
};

export const generateMaskCanvas = (
  shape: TextShapeMask | GeometricMaskShape,
  width: number,
  height: number,
  cacheCanvas?: HTMLCanvasElement
) => {
  const { backgroundColor = '#fff' } = shape;

  const maskCanvas =
    cacheCanvas ||
    vglobal.createCanvas({
      width,
      height,
      dpr: 1
    });
  const tempContext = maskCanvas.getContext('2d');
  if (cacheCanvas) {
    const prevWidth = cacheCanvas.width;
    const prevHeight = cacheCanvas.height;
    tempContext.clearRect(0, 0, prevWidth, prevHeight);
    cacheCanvas.style.width = `${width}px`;
    cacheCanvas.style.height = `${height}px`;
    cacheCanvas.width = width;
    cacheCanvas.height = height;
  }
  tempContext.fillStyle = backgroundColor;
  tempContext.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

  if ((shape as TextShapeMask).type === 'text') {
    drawTextMask(shape as TextShapeMask, maskCanvas.width, maskCanvas.height, tempContext);
  } else if ((shape as GeometricMaskShape).type === 'geometric') {
    drawGeometricMask(shape as GeometricMaskShape, maskCanvas.width, maskCanvas.height, tempContext);
  }

  return maskCanvas;
};

const drawTextMask = (shape: TextShapeMask, width: number, height: number, ctx: CanvasRenderingContext2D) => {
  const {
    fontFamily = 'sans-serif',
    fontWeight = 'normal',
    fontStyle = 'normal',
    fontVariant = 'normal',
    fill,
    text,
    hollow
  } = shape;

  let baseFontSize = 12;

  ctx.font = `${fontStyle} ${fontVariant} ${fontWeight} ${baseFontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = fill ?? 'black';
  const textWidth = ctx.measureText(text).width;

  if (hollow) {
    ctx.globalCompositeOperation = 'xor';
  }
  if (textWidth > width) {
    const scale = Math.min(width / textWidth, height / baseFontSize);
    ctx.fillText(text, width / 2, height / 2);
    ctx.scale(scale, scale);
  } else {
    baseFontSize = Math.floor((baseFontSize * width) / textWidth);
    baseFontSize = Math.min(baseFontSize, height);

    ctx.font = `${fontStyle} ${fontVariant} ${fontWeight} ${baseFontSize}px ${fontFamily}`;
    ctx.fillText(text, width / 2, height / 2);
  }
};

export const generatePoints = (center: IPointLike, radius: number, startAngle: number = 0, count: number) => {
  const angle = (2 * Math.PI) / count;
  return new Array(count).fill(0).map((entry, index) => {
    return polarToCartesian(center, radius, startAngle + index * angle);
  });
};

export const generateCardioidPoints = (center: IPointLike, radius: number, startAngle: number = 0, count: number) => {
  const angle = (2 * Math.PI) / count;
  const func = getShapeFunction('cardioid');

  return new Array(count).fill(0).map((entry, index) => {
    const theta = startAngle + index * angle;
    const r = radius * func(theta);
    const res = polarToCartesian(center, r, theta);
    return res;
  });
};

export const drawRegularPolygon = (ctx: CanvasRenderingContext2D, points: IPointLike[]) => {
  ctx.beginPath();
  points.forEach((p: IPointLike, index: number) => {
    if (index === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  });

  ctx.closePath();
  ctx.fill();
};

export const drawCardioid = (ctx: CanvasRenderingContext2D, points: IPointLike[]) => {
  ctx.beginPath();
  let prev: IPointLike;
  points.forEach((p: IPointLike, index: number) => {
    if (index === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.bezierCurveTo(p.x, p.y, prev.x, prev.y, p.x, p.y);
    }
    prev = p;
  });

  ctx.closePath();
  ctx.fill();
};

const drawGeometricMask = (shape: GeometricMaskShape, width: number, height: number, ctx: CanvasRenderingContext2D) => {
  const { fill, hollow } = shape;
  const { center, maxRadius } = getMaxRadiusAndCenter(shape.shape, [width, height]);

  ctx.fillStyle = fill ?? 'black';

  if (hollow) {
    ctx.globalCompositeOperation = 'xor';
  }
  const cx = center[0];
  const cy = center[1];

  if (shape.shape === 'cardioid') {
    drawCardioid(ctx, generateCardioidPoints({ x: cx, y: cy }, maxRadius, 0, 100));
  } else if (shape.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(cx, cy, maxRadius, 0, 2 * Math.PI, true);
    ctx.fill();
  } else if (shape.shape === 'diamond') {
    drawRegularPolygon(ctx, generatePoints({ x: cx, y: cy }, maxRadius, -Math.PI / 2, 4));
  } else if (shape.shape === 'square') {
    drawRegularPolygon(ctx, generatePoints({ x: cx, y: cy }, maxRadius, -Math.PI / 4, 4));
  } else if (shape.shape === 'pentagon') {
    drawRegularPolygon(ctx, generatePoints({ x: cx, y: cy }, maxRadius, Math.PI / 2, 5));
  } else if (shape.shape === 'triangle' || shape.shape === 'triangleUpright') {
    drawRegularPolygon(ctx, generatePoints({ x: cx, y: cy }, maxRadius, -Math.PI / 2, 3));
  } else if (shape.shape === 'triangleForward') {
    drawRegularPolygon(ctx, generatePoints({ x: cx, y: cy }, maxRadius, 0, 3));
  } else if (shape.shape === 'star') {
    const outterPoints = generatePoints({ x: cx, y: cy }, maxRadius, -Math.PI / 2, 5);
    const innerPoints = generatePoints(
      { x: cx, y: cy },
      maxRadius / (2 * Math.cos(Math.PI / 5)),
      -Math.PI / 2 + Math.PI / 5,
      5
    );
    const points = [];
    for (let i = 0; i < 5; i++) {
      points.push(outterPoints[i]);
      points.push(innerPoints[i]);
    }
    drawRegularPolygon(ctx, points);
  } else {
    ctx.fillRect(0, 0, width, height);
  }
};
