import type { IRectGraphicAttribute, IPolygonGraphicAttribute, IPathGraphicAttribute } from '@visactor/vrender/es/core';
import type { IPointLike } from '@visactor/vutils';
import { isNil } from '@visactor/vutils';
import type { SankeyNodeElement, SankeyLinkElement } from './interface';

export const formatNodeRect = (nodes: SankeyNodeElement[]): IRectGraphicAttribute[] => {
  return nodes.map(node => {
    return Object.assign({}, node, {
      x: node.x0,
      y: node.y0,
      width: node.x1 - node.x0,
      height: node.y1 - node.y0
    });
  });
};

export const formatLinkPolygon = (links: SankeyLinkElement[]): (IPolygonGraphicAttribute & SankeyLinkElement)[] => {
  const isVertical = !isNil(links?.[0]?.vertical);

  if (isVertical) {
    return links.map(link => {
      const half = link.thickness / 2;
      const points: IPointLike[] = [
        {
          x: link.x0 - half,
          y: link.y0
        },
        {
          x: link.x1 - half,
          y: link.y1
        },
        {
          x: link.x1 + half,
          y: link.y1
        },
        {
          x: link.x0 + half,
          y: link.y0
        }
      ];

      return Object.assign({}, link, { points: points });
    });
  }

  return links.map(link => {
    const half = link.thickness / 2;
    const points: IPointLike[] = [
      {
        x: link.x0,
        y: link.y0 - half
      },
      {
        x: link.x1,
        y: link.y1 - half
      },
      {
        x: link.x1,
        y: link.y1 + half
      },
      {
        x: link.x0,
        y: link.y0 + half
      }
    ];

    return Object.assign({}, link, { points: points });
  });
};

export const formatLinkPath = (
  links: SankeyLinkElement[],
  round: boolean = true
): (IPathGraphicAttribute & SankeyLinkElement)[] => {
  const isVertical = !isNil(links?.[0]?.vertical);

  if (isVertical) {
    return links.map(link => {
      const half = link.thickness / 2;
      let y0 = link.y0;
      let y1 = link.y1;
      let midY = (y0 + y1) / 2;
      let x00 = link.x0 - half;
      let x01 = link.x0 + half;
      let x10 = link.x1 - half;
      let x11 = link.x1 + half;

      if (round) {
        y0 = Math.round(y0);
        y1 = Math.round(y1);
        midY = Math.round(midY);
        x00 = Math.round(x00);
        x01 = Math.round(x01);
        x10 = Math.round(x10);
        x11 = Math.round(x11);
      }

      return Object.assign({}, link, {
        path: `
            M${x00},${y0}
            C${x00},${midY},${x10},${midY},${x10},${y1}
            L${x11},${y1}
            C${x11},${midY},${x01},${midY},${x01},${y0}
            Z
            `
      });
    });
  }

  return links.map(link => {
    const half = link.thickness / 2;
    let x0 = link.x0;
    let x1 = link.x1;
    let midX = (x0 + x1) / 2;
    let y00 = link.y0 - half;
    let y01 = link.y0 + half;
    let y10 = link.y1 - half;
    let y11 = link.y1 + half;

    if (round) {
      x0 = Math.round(x0);
      x1 = Math.round(x1);
      midX = Math.round(midX);
      y00 = Math.round(y00);
      y01 = Math.round(y01);
      y10 = Math.round(y10);
      y11 = Math.round(y11);
    }

    return Object.assign({}, link, {
      path: `
          M${x0},${y00}
          C${midX},${y00},${midX},${y10},${x1},${y10}
          L${x1},${y11}
          C${midX},${y11},${midX},${y01},${x0},${y01}
          Z`
    });
  });
};

export const getBoundsOfNodes = (nodes: SankeyNodeElement[]) => {
  let x0: number = Infinity;
  let x1: number = -Infinity;
  let y0: number = Infinity;
  let y1: number = -Infinity;

  nodes.forEach(node => {
    x0 = Math.min(node.x0, x0);
    x1 = Math.max(node.x1, x1);
    y0 = Math.min(node.y0, y0);
    y1 = Math.max(node.y1, y1);
  });

  return {
    x0,
    x1,
    y0,
    y1,
    width: x1 - x0,
    height: y1 - y0
  };
};

const isNodeVertical = (node: SankeyNodeElement) => {
  if (node.sourceLinks && node.sourceLinks.length) {
    return !isNil(node.sourceLinks[0].x0);
  }

  if (node.targetLinks && node.targetLinks.length) {
    return !isNil(node.targetLinks[0].x0);
  }

  return false;
};

export const getAlignStartTexts = (nodes: SankeyNodeElement[], offset: number = 0) => {
  const isVertical = isNodeVertical(nodes[0]);

  if (isVertical) {
    return nodes.map((node: SankeyNodeElement) => {
      return {
        y: node.y1,
        x: (node.x0 + node.x1) / 2,
        datum: node.datum,
        key: node.key
      };
    });
  }

  return nodes.map((node: SankeyNodeElement) => {
    return {
      x: node.x1,
      y: (node.y0 + node.y1) / 2,
      datum: node.datum,
      key: node.key
    };
  });
};

export const getAlignEndTexts = (nodes: SankeyNodeElement[], offset: number = 0) => {
  const isVertical = isNodeVertical(nodes[0]);

  if (isVertical) {
    return nodes.map((node: SankeyNodeElement) => {
      return {
        y: node.y1 - offset,
        x: (node.x0 + node.x1) / 2,
        datum: node.datum,
        key: node.key
      };
    });
  }

  return nodes.map((node: SankeyNodeElement) => {
    return {
      x: node.x0 - offset,
      y: (node.y0 + node.y1) / 2,
      datum: node.datum,
      key: node.key
    };
  });
};
