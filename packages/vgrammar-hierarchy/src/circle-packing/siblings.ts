import { array } from '@visactor/vutils';
import { randomLCG } from '../lcg';
import { packEncloseRandom } from './enclose';
import type { ICircle } from '../interface';

interface CircleNode {
  _: ICircle;
  next?: CircleNode;
  prev?: CircleNode;
}

function place(b: ICircle, a: ICircle, c: ICircle) {
  const dx = b.x - a.x;
  let x;
  let a2;
  const dy = b.y - a.y;
  let y;
  let b2;
  const d2 = dx * dx + dy * dy;
  if (d2) {
    a2 = a.radius + c.radius;
    a2 *= a2;
    b2 = b.radius + c.radius;
    b2 *= b2;
    if (a2 > b2) {
      x = (d2 + b2 - a2) / (2 * d2);
      y = Math.sqrt(Math.max(0, b2 / d2 - x * x));
      c.x = b.x - x * dx - y * dy;
      c.y = b.y - x * dy + y * dx;
    } else {
      x = (d2 + a2 - b2) / (2 * d2);
      y = Math.sqrt(Math.max(0, a2 / d2 - x * x));
      c.x = a.x + x * dx - y * dy;
      c.y = a.y + x * dy + y * dx;
    }
  } else {
    c.x = a.x + c.radius;
    c.y = a.y;
  }
}

function intersects(a: ICircle, b: ICircle) {
  const dr = a.radius + b.radius - 1e-6;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

function score(node: CircleNode) {
  const a = node._;
  const b = node.next._;
  const ab = a.radius + b.radius;
  const dx = (a.x * b.radius + b.x * a.radius) / ab;
  const dy = (a.y * b.radius + b.y * a.radius) / ab;
  return dx * dx + dy * dy;
}

function getCicleNode(circle: ICircle): CircleNode {
  return {
    _: circle,
    next: null as CircleNode,
    prev: null as CircleNode
  };
}

export function packSiblingsRandom(circles: ICircle[], random: () => number) {
  circles = array(circles);

  const n = circles.length;
  if (!n) {
    return 0;
  }

  // Place the first circle.
  let a = circles[0];
  a.x = 0;
  a.y = 0;
  if (n === 1) {
    return a.radius;
  }

  // Place the second circle.
  const b = circles[1];
  a.x = -b.radius;
  b.x = a.radius;
  b.y = 0;
  if (n === 2) {
    return a.radius + b.radius;
  }

  let c = circles[2];
  // Place the third circle.
  place(b, a, c);

  // Initialize the front-chain using the first three circles a, b and c.
  let aNode = getCicleNode(a);
  let bNode = getCicleNode(b);
  let cNode = getCicleNode(c);
  aNode.next = bNode;
  cNode.prev = bNode;

  bNode.next = cNode;
  aNode.prev = cNode;

  cNode.next = aNode;
  bNode.prev = aNode;

  let j: CircleNode;
  let k: CircleNode;
  let sj: number;
  let sk: number;
  let aa: number;
  let ca: number;
  let isContinue: boolean;

  // Attempt to place each remaining circle…
  for (let i = 3; i < n; ++i) {
    isContinue = false;
    c = circles[i];
    place(aNode._, bNode._, c);
    cNode = getCicleNode(c);

    // Find the closest intersecting circle on the front-chain, if any.
    // “Closeness” is determined by linear distance along the front-chain.
    // “Ahead” or “behind” is likewise determined by linear distance.
    j = bNode.next;
    k = aNode.prev;
    sj = bNode._.radius;
    sk = aNode._.radius;

    do {
      if (sj <= sk) {
        if (intersects(j._, cNode._)) {
          bNode = j;
          aNode.next = bNode;
          bNode.prev = aNode;
          --i;
          isContinue = true;
          break;
        }
        sj += j._.radius;
        j = j.next;
      } else {
        if (intersects(k._, cNode._)) {
          aNode = k;
          aNode.next = bNode;
          bNode.prev = aNode;
          --i;

          isContinue = true;
          break;
        }
        sk += k._.radius;
        k = k.prev;
      }
    } while (j !== k.next);

    if (isContinue) {
      continue;
    }

    // Success! Insert the new circle c between a and b.
    cNode.prev = aNode;
    cNode.next = bNode;
    aNode.next = bNode.prev = bNode = cNode;

    // Compute the new closest circle pair to the centroid.
    aa = score(aNode);
    cNode = cNode.next;
    while (cNode !== bNode) {
      ca = score(cNode);
      if (ca < aa) {
        aNode = cNode;
        aa = ca;
      }
      cNode = cNode.next;
    }
    bNode = aNode.next;
  }

  // Compute the enclosing circle of the front chain.
  const aCircles = [bNode._];
  cNode = bNode.next;
  while (cNode !== bNode) {
    aCircles.push(cNode._);
    cNode = cNode.next;
  }
  c = packEncloseRandom(aCircles, random);

  // Translate the circles to put the enclosing circle around the origin.
  for (let i = 0; i < n; ++i) {
    a = circles[i];
    a.x -= c.x;
    a.y -= c.y;
  }

  return c.radius;
}

export default function (circles: ICircle[]) {
  packSiblingsRandom(circles, randomLCG());
  return circles;
}
