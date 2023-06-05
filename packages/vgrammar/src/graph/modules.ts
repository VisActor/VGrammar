import CanvasRenderer from './canvas-renderer';

const Canvas = 'canvas';
const XCanvas = 'xcanvas';
const PNG = 'png';
const None = 'none';

export const RenderType = {
  XCanvas: XCanvas,
  Canvas: Canvas,
  PNG: PNG,
  None: None
};

const modules = {
  [Canvas]: {
    renderer: CanvasRenderer,
    headless: CanvasRenderer
  },
  [PNG]: {
    renderer: CanvasRenderer,
    headless: CanvasRenderer
  },
  [None]: {}
};

export function renderModule(name: string) {
  return modules[name];
}
