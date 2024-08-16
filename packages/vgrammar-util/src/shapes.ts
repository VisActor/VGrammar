export const shapes = {
  triangleForward: triangleForward,
  triangleUpright: triangle,
  triangle, // 三角形
  diamond, // 菱形
  square, // 方形
  star, // 星形
  cardioid, // 心形
  circle, // 圆形
  pentagon // 五角形
};

function diamond() {
  return function (theta: number) {
    const thetaPrime = theta % ((2 * Math.PI) / 4);
    return 1 / (Math.cos(thetaPrime) + Math.sin(thetaPrime));
  };
}
function star() {
  return function (theta: number) {
    const thetaPrime = (theta + 0.955) % ((2 * Math.PI) / 10);
    if (((theta + 0.955) % ((2 * Math.PI) / 5)) - (2 * Math.PI) / 10 >= 0) {
      return 1 / (Math.cos((2 * Math.PI) / 10 - thetaPrime) + 3.07768 * Math.sin((2 * Math.PI) / 10 - thetaPrime));
    }
    return 1 / (Math.cos(thetaPrime) + 3.07768 * Math.sin(thetaPrime));
  };
}
function square() {
  return function (theta: number) {
    return Math.min(1 / Math.abs(Math.cos(theta)), 1 / Math.abs(Math.sin(theta)));
  };
}

function triangle() {
  return function (theta: number) {
    const thetaPrime = (theta + (Math.PI * 3) / 2) % ((2 * Math.PI) / 3);
    return 1 / (Math.cos(thetaPrime) + Math.sqrt(3) * Math.sin(thetaPrime));
  };
}
function triangleForward() {
  return function (theta: number) {
    const thetaPrime = theta % ((2 * Math.PI) / 3);
    return 1 / (Math.cos(thetaPrime) + Math.sqrt(3) * Math.sin(thetaPrime));
  };
}
function cardioid() {
  return function (theta: number) {
    return 1 + Math.sin(theta);
  };
}
function circle() {
  return function () {
    return 1;
  };
}

function pentagon() {
  return function (theta: number) {
    const thetaPrime = (theta + 0.955) % ((2 * Math.PI) / 5);
    return 1 / (Math.cos(thetaPrime) + 0.726543 * Math.sin(thetaPrime));
  };
}

export function getMaxRadiusAndCenter(shape: string, size: [number, number]) {
  const w = size[0];
  const h = size[1];
  let maxRadius = 1;
  const center = [size[0] >> 1, size[1] >> 1];

  switch (shape) {
    case 'cardioid':
      center[1] = ~~((h / 2.7) * 0.4);
      maxRadius = Math.floor(Math.min(w / 2.3, h / 2.6));
      break;
    case 'triangleForward':
      maxRadius = h / Math.sqrt(0.75) > w ? Math.floor(w / 2) : Math.floor(h / (2 * Math.sqrt(0.75)));
      break;
    case 'triangle':
    case 'triangleUpright':
      center[1] = ~~(h / 1.5);
      maxRadius = Math.floor(Math.min(h / 1.5, w / 2));
      break;
    case 'circle':
    case 'diamond':
    case 'square':
    case 'star':
    case 'pentagon':
      maxRadius = Math.floor(Math.min(w / 2, h / 2));
      break;
    case 'rect':
    default:
      maxRadius = Math.floor(Math.max(w / 2, h / 2));
      break;
  }
  return { maxRadius, center };
}

export const getShapeFunction = (type: string) => {
  if (shapes[type]) {
    return shapes[type]();
  }

  return shapes.circle();
};
