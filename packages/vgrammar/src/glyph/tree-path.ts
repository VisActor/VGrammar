import type { IAnimationParameters, TypeAnimation, TreePathEncoderSpec } from '../types';
import type { IElement } from '../types/element';
import { registerAnimationType } from '../view/register-animation';
import { registerGlyph } from '../view/register-glyph';
import { isNil } from '@visactor/vutils';

export interface TreePathConfig {
  direction?: 'horizontal' | 'vertical' | 'LR' | 'RL' | 'TB' | 'BL' | 'radial';
}

export const getHorizontalPath = (options: TreePathEncoderSpec) => {
  const curvature = options.curvature ?? 0.5;
  let x0 = options.x0;
  let x1 = options.x1;
  let y0 = options.y0;
  let y1 = options.y1;
  let cpx0 = x0 + curvature * (x1 - x0);
  let cpx1 = x1 + curvature * (x0 - x1);
  let formatter = (v: number) => v;

  if (options.round !== false) {
    x0 = Math.round(x0);
    x1 = Math.round(x1);
    y0 = Math.round(y0);
    y1 = Math.round(y1);
    cpx0 = Math.round(cpx0);
    cpx1 = Math.round(cpx1);
    formatter = Math.round;
  }
  const mainPath =
    options.pathType === 'line'
      ? `M${x0},${y0}L${x1},${y1}`
      : options.pathType === 'polyline'
      ? `M${x0},${y0}L${cpx0},${y0}L${cpx0},${y1}L${x1},${y1}`
      : `M${x0},${y0}C${cpx0},${y0},${cpx1},${y1},${x1},${y1}`;

  if (options.startArrow || options.endArrow) {
    const delta = x1 - x0;
    const hasLength = Math.abs(delta) > 1e-6;

    if (hasLength) {
      const arrowSize = options.arrowSize ?? 3;
      const sign = delta > 0 ? 1 : -1;

      const endArrowPath = options.endArrow
        ? `M${formatter(x1 - sign * arrowSize)},${formatter(y1 - arrowSize)}L${x1},${y1}L${formatter(
            x1 - sign * arrowSize
          )},${formatter(y1 + arrowSize)}`
        : '';
      const startArrowPath = options.startArrow
        ? `M${formatter(x0 + sign * arrowSize)},${formatter(y0 - arrowSize)}L${x0},${y0}L${formatter(
            x0 + sign * arrowSize
          )},${formatter(y0 + arrowSize)}`
        : '';

      return [startArrowPath, mainPath, endArrowPath];
    }
  }

  return ['', mainPath, ''];
};

export const getVerticalPath = (options: TreePathEncoderSpec) => {
  const curvature = options.curvature ?? 0.5;
  let y0 = options.y0;
  let y1 = options.y1;
  let x0 = options.x0;
  let x1 = options.x1;
  let cpy0 = y0 + curvature * (y1 - y0);
  let cpy1 = y1 + curvature * (y0 - y1);
  let formatter = (v: number) => v;

  if (options.round !== false) {
    formatter = Math.round;
    y0 = Math.round(y0);
    y1 = Math.round(y1);
    x0 = Math.round(x0);
    x1 = Math.round(x1);
    cpy0 = Math.round(cpy0);
    cpy1 = Math.round(cpy1);
  }
  const mainPath =
    options.pathType === 'line'
      ? `M${x0},${y0}L${x1},${y1}`
      : options.pathType === 'polyline'
      ? `M${x0},${y0}L${x0},${cpy0}L${x1},${cpy0}L${x1},${y1}`
      : `M${x0},${y0}C${x0},${cpy0},${x1},${cpy1},${x1},${y1}`;

  if (options.startArrow || options.endArrow) {
    const delta = y1 - y0;
    const hasLength = Math.abs(delta) > 1e-6;

    if (hasLength) {
      const arrowSize = options.arrowSize ?? 3;
      const sign = delta > 0 ? 1 : -1;

      const endArrowPath = options.endArrow
        ? `M${formatter(x1 - arrowSize)},${formatter(y1 - sign * arrowSize)}L${x1},${formatter(y1)}L${formatter(
            x1 + arrowSize
          )},${formatter(y1 - sign * arrowSize)}`
        : '';
      const startArrowPath = options.startArrow
        ? `M${formatter(x0 + arrowSize)},${formatter(y0 + sign * arrowSize)}L${x0},${formatter(y0)}L${formatter(
            x0 + arrowSize
          )},${formatter(y0 + sign * arrowSize)}`
        : '';

      return [startArrowPath, mainPath, endArrowPath];
    }
  }

  return ['', mainPath, ''];
};

const encoder = (encodeValues: TreePathEncoderSpec, datum: any, element: IElement, config: TreePathConfig) => {
  const direction = encodeValues.direction ?? config?.direction;
  const parsePath = ['vertical', 'TB', 'BT'].includes(direction) ? getVerticalPath : getHorizontalPath;

  const encodeChannels = Object.keys(encodeValues);
  // parse path when all required channels are included
  if (['x0', 'y0', 'x1', 'y1'].every(channel => encodeChannels.includes(channel))) {
    const [startArrowPath, mainPath, endArrowPath] = parsePath(encodeValues);

    return {
      main: {
        path: mainPath
      },
      startArrow: {
        path: startArrowPath
      },
      endArrow: {
        path: endArrowPath
      }
    };
  }

  return {};
};

const treePathGrowIn: TypeAnimation<IElement> = (
  element: IElement,
  options: any,
  animationParameters: IAnimationParameters
) => {
  const linkValues: TreePathEncoderSpec = {
    x0: element.getGraphicAttribute('x0', false),
    x1: element.getGraphicAttribute('x1', false),
    y0: element.getGraphicAttribute('y0', false),
    y1: element.getGraphicAttribute('y1', false),
    round: element.getGraphicAttribute('round', false),
    align: element.getGraphicAttribute('align', false),
    pathType: element.getGraphicAttribute('pathType', false),
    endArrow: element.getGraphicAttribute('endArrow', false),
    startArrow: element.getGraphicAttribute('startArrow', false)
  };
  // FIXME: undefined channel animation will cause vRender warning
  Object.keys(linkValues).forEach(key => {
    if (isNil(linkValues[key])) {
      delete linkValues[key];
    }
  });
  return {
    from: Object.assign({}, linkValues, { x1: linkValues.x0, y1: linkValues.y0 }),
    to: linkValues
  };
};

const treePathGrowOut: TypeAnimation<IElement> = (
  element: IElement,
  options: any,
  animationParameters: IAnimationParameters
) => {
  const linkValues: TreePathEncoderSpec = {
    x0: element.getGraphicAttribute('x0', true),
    x1: element.getGraphicAttribute('x1', true),
    y0: element.getGraphicAttribute('y0', true),
    y1: element.getGraphicAttribute('y1', true),
    round: element.getGraphicAttribute('round', true),
    align: element.getGraphicAttribute('align', true),
    pathType: element.getGraphicAttribute('pathType', true),
    endArrow: element.getGraphicAttribute('endArrow', true),
    startArrow: element.getGraphicAttribute('startArrow', true)
  };
  // FIXME: undefined channel animation will cause vRender warning
  Object.keys(linkValues).forEach(key => {
    if (isNil(linkValues[key])) {
      delete linkValues[key];
    }
  });
  return {
    from: linkValues,
    to: Object.assign({}, linkValues, { x1: linkValues.x0, y1: linkValues.y0 })
  };
};

const treePathUpdate: TypeAnimation<IElement> = (
  element: IElement,
  options: any,
  animationParameters: IAnimationParameters
) => {
  const bassLinkValues = {
    thickness: element.getGraphicAttribute('thickness', false),
    round: element.getGraphicAttribute('round', false),
    align: element.getGraphicAttribute('align', false),
    pathType: element.getGraphicAttribute('pathType', false),
    endArrow: element.getGraphicAttribute('endArrow', false),
    startArrow: element.getGraphicAttribute('startArrow', false)
  };
  // FIXME: undefined channel animation will cause vRender warning
  Object.keys(bassLinkValues).forEach(key => {
    if (isNil(bassLinkValues[key])) {
      delete bassLinkValues[key];
    }
  });
  const prevLinkValues: TreePathEncoderSpec = Object.assign(
    {
      x0: element.getGraphicAttribute('x0', true),
      x1: element.getGraphicAttribute('x1', true),
      y0: element.getGraphicAttribute('y0', true),
      y1: element.getGraphicAttribute('y1', true),
      ...bassLinkValues
    },
    bassLinkValues
  );
  const nextLinkValues: TreePathEncoderSpec = Object.assign(
    {
      x0: element.getGraphicAttribute('x0', false),
      x1: element.getGraphicAttribute('x1', false),
      y0: element.getGraphicAttribute('y0', false),
      y1: element.getGraphicAttribute('y1', false)
    },
    bassLinkValues
  );

  return {
    from: prevLinkValues,
    to: nextLinkValues
  };
};

export const registerTreePathGlyph = () => {
  registerGlyph<TreePathEncoderSpec, TreePathConfig>('treePath', {
    main: 'path',
    startArrow: 'path',
    endArrow: 'path'
  })
    .registerFunctionEncoder(encoder)
    .registerChannelEncoder('startArrowStyle', (channel, encodeValue) => {
      return {
        startArrow: encodeValue
      };
    })
    .registerChannelEncoder('endArrowStyle', (channel, encodeValue) => {
      return {
        endArrow: encodeValue
      };
    })
    .registerDefaultEncoder(() => {
      return {
        startArrow: { zIndex: 1 },
        endArrow: { zIndex: 2 }
      };
    });

  registerAnimationType('treePathGrowIn', treePathGrowIn);
  registerAnimationType('treePathGrowOut', treePathGrowOut);
  registerAnimationType('treePathUpdate', treePathUpdate);
};
