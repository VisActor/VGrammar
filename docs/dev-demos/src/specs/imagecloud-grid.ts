/* eslint-disable no-console */
import { IMark, type IView } from '@visactor/vgrammar';
// import data from '../data/imagecloud/baisc.json';
import data from '../data/imagecloud/weight.json';
import vipImages from '../data/imagecloud/vip-images.json';

import { registerImageCloudTransforms } from '@visactor/vgrammar-imagecloud';
import { createPath, createPolygon, createSymbol } from '@visactor/vrender';

// const res = await fetch("https://cdn.jsdelivr.net/gh/xiaoluoHe/Resources/images/dogs/files.json");
// const dogs = await res.json();

const res = await fetch('http://localhost:3003/dogs1/files.json');
const dogs = await res.json();
registerImageCloudTransforms();

export const spec = {
  width: 600,
  height: 400,
  background: 'pink',
  data: [
    {
      id: 'baseData',
      // values: vipImages,
      values: dogs,
      // values:data,
      transform: [
        {
          type: 'map',
          as: 'weight',
          callback: (datum: any) => {
            return datum.count / 100;
          }
        }
      ]
    }
  ],
  signals: [
    {
      id: 'wordPadding',
      value: 1,
      bind: { input: 'range', min: 0, max: 5, step: 1 }
    },
    {
      id: 'fontSizeRange0',
      value: 12,
      bind: { input: 'range', min: 8, max: 42, step: 1 }
    },
    {
      id: 'fontSizeRange1',
      value: 56,
      bind: { input: 'range', min: 8, max: 100, step: 1 }
    },
    {
      id: 'rotate',
      value: 0,
      bind: { input: 'select', options: [0, 30, 45, 60, 90, -30, -45] }
    }
  ],
  scales: [
    {
      id: 'color',
      type: 'ordinal',
      range: ['#d5a928', '#652c90', '#939597'],
      domain: { data: 'baseData', field: 'challenge_name' }
    }
  ],
  marks: [
    {
      type: 'group',
      id: 'background',
      encode: {
        enter: {
          x: 0,
          y: 0,
          width: 600,
          height: 400
        }
      },
      dependency: 'images',
      marks: [
        {
          type: 'image',
          id: 'images',
          from: { data: 'baseData' },
          transform: [
            {
              type: 'imagecloud',
              size: [600, 400],
              // padding: { signal: 'wordPadding' },
              // mask: "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_logo.png",
              mask: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_motuo_mini.png',
              // mask: 'http://localhost:3003/heart-red.png',
              // mask: {
              //   type: 'text',
              //   text: '大',
              //   fontWeight: 'bold'
              // },
              layoutConfig: {
                layoutMode: 'grid',
                rectAspectRatio: 4 / 3,
                cellType: 'rect',
                // cellType:"circle",
                // cellType: 'hexagonal',
                placement: 'masked'
                // placement:"edge"
              },
              maskConfig: {
                // threshold: 200
                // invert: true
                edgeBlur: 20
              },
              onUpdateMaskCanvas: (canvas: any, transparentMaskCanvas: any) => {
                // console.log(canvas, document.getElementById('footer'));
                // document.getElementById('footer').appendChild(canvas);
                const view = window.view;
                if (view) {
                  const group = view.getGrammarById('background') as IMark;
                  // const group = view.getGrammarById('images') as IMark;
                  document.getElementById('footer').appendChild(transparentMaskCanvas);
                  if (group) {
                    group.getGroupGraphicItem().name = 'container';
                    group.getGroupGraphicItem().setAttributes({
                      background: transparentMaskCanvas,
                      // background: segmentationOutput.maskCanvas,
                      // background: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vrender/vsactor-icon.png',
                      clip: true,
                      drawMode: 1,
                      globalCompositeOperation: 'destination-in'
                    });
                  }
                }
              },
              onLayoutEnd: (images: any) => {
                // debug grid 各种布局算法用
                // for (const image of images) {
                //   const cell = image.cell;
                //   const path = createSymbol({
                //     x: cell.centerX,
                //     y: cell.centerY,
                //     symbolType: image.clipConfig.shape,
                //     fill: false,
                //     fillOpacity: 0,
                //     stroke: 'red',
                //     lineWidth: 1,
                //     globalZIndex: 1,
                //     size: (cell.centerX - cell.x) * 2
                //   });
                //   view?.renderer.stage().defaultLayer.add(path);
                // }
              },
              weight: { field: 'count' },
              image: { field: 'url' },
              imageConfig: {
                padding: 2
                // removeWhiteBorder: true,
              },
              ratio: 0.08,
              progressiveStep: 50
            }
          ],
          encode: {
            enter: {
              image: { field: 'url' }
              // _debug_bounds: true,
              // stroke:'blue',
              // lineWidth:1,
              // globalCompositeOperation: 'source-atop'
            },
            update: {
              x: { field: 'x' },
              y: { field: 'y' },
              width: { field: 'width' },
              height: { field: 'height' },
              angle: { field: 'angle' },
              clipConfig: { field: 'clipConfig' },
              visible: { field: 'visible' },
              // visible: false,
              cell: { field: 'cell' },
              fillOpacity: 1,
              scaleX: 1,
              scaleY: 1
            },
            hover: {
              fillOpacity: 0.5,
              scaleX: 1.5,
              scaleY: 1.5
            }
          }
        }
      ]
    }
  ]
};

if (spec.marks[0].marks[0].transform[0].layoutConfig.placement === 'masked') {
  spec.marks[0].marks[0].encode.update.globalCompositeOperation = 'source-atop';
}

export const callback = (view: IView) => {
  // do nothing
  view.addEventListener('click', (event, element) => {
    console.log(event, element?.getGraphicItem());
  });
};

function visualizeSegmentation(labels: number[], canvasWidth = 500, canvasHeight = 500) {
  // 获取 Canvas 元素
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 设置 Canvas 尺寸
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 创建 ImageData 对象以存储像素数据
  const imageData = ctx.createImageData(canvasWidth, canvasHeight); // 宽度和高度

  // 填充 ImageData 的像素数据
  for (let i = 0; i < labels.length; i++) {
    const color = labels[i] === 0 ? 255 : 0; // 0 为白色 (255, 255, 255)，1 为黑色 (0, 0, 0)
    const alpha = labels[i] === 0 ? 0 : 255; // 0 为透明 (0)，1 为不透明 (255)
    // 每个像素在 ImageData 中占 4 个字节 (RGBA)
    const pixelIndex = i * 4;
    imageData.data[pixelIndex] = color; // 红色通道
    imageData.data[pixelIndex + 1] = color; // 绿色通道
    imageData.data[pixelIndex + 2] = color; // 蓝色通道
    imageData.data[pixelIndex + 3] = alpha; // Alpha 通道
  }

  // 将 ImageData 绘制到 Canvas 上
  ctx.putImageData(imageData, 0, 0);

  // 放大 Canvas 显示效果
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  document.getElementById('footer').appendChild(canvas);
}
