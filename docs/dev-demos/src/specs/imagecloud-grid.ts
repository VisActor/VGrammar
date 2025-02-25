/* eslint-disable no-console */
import { type IView,  } from '@visactor/vgrammar';
// import data from '../data/imagecloud/baisc.json';
import data from '../data/imagecloud/weight.json';
import vipImages from '../data/imagecloud/vip-images.json';

import { registerImageCloudTransforms } from '@visactor/vgrammar-imagecloud';


const res = await fetch("https://cdn.jsdelivr.net/gh/xiaoluoHe/Resources/images/dogs/files.json");
const dogs = await res.json();

registerImageCloudTransforms();

export const spec = {
  width: 600,
  height: 400,
  background:'rgba(0,0,0,0)',
  data: [
    {
      id: 'baseData',
      values: vipImages,
      // values: dogs,
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
      type: 'image',
      encode: {
        enter: {
          // visible:false,
          // image: "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_logo.png",
          // image:'http://localhost:3000/shape_motuo_mini__1_-removebg-preview.png',
          image:'http://localhost:3003/logo.jpg',
          // image:'http://localhost:3000/shape_motuo_mini__1_-removebg-black.png',

          // _debug_bounds: true,
          // stroke:'red',
          // lineWidth:1

        },
        update: {
         x:104,
         y:0,
         width:391,
         height:400,
         opacity: 1,
        },
      }
    },
    {
      type: 'image',
      from: { data: 'baseData' },
      transform: [
        {
          type: 'imagecloud',
          size: [600, 400],
          padding: { signal: 'wordPadding' },
          // mask: "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_logo.png",
          // mask:'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_motuo_mini.png',
          // mask:'http://localhost:3003/logo.jpg',
          mask: {
            type: 'text',
            text: '大',
            fontWeight: 'bold',
          },
          layoutConfig: {
            layoutMode:'grid',
            // cellType:"rect",
            cellType:"circle",
            // cellType:"hexagonal",
            // placement:"masked",
            // placement:"edge"
          },
          maskConfig:{
            // threshold: 100,
            invert: true
          },
          onUpdateMaskCanvas:(canvas: any) => {
            document.getElementById('footer')?.appendChild(canvas)
          },
          onSegmentationReady:(segmentationOutput : any) => {
            visualizeSegmentation(
              segmentationOutput.segmentation.labels,
              segmentationOutput.size[0],
              segmentationOutput.size[1]
            );
          },
          weight:{ field: 'count'},
          image: { field:'url' },
          imageConfig:{
            padding: 2,
            // removeWhiteBorder: true,
          },
          ratio: 0.05,
          progressiveStep: 50,
        }
      ],
      encode: {
        enter: {
          image: { field: 'url' },
          // _debug_bounds: true,
          // stroke:'blue',
          // lineWidth:1,
          // globalCompositeOperation:'source-atop'
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          width: {field: 'width'},
          height: {field: 'height'},
          angle: { field: 'angle' },
          clipPath:{field:'clipPath'},
          visible: { field: 'visible' },
          cell:{field:'cell'},
          fillOpacity: 1,
          scaleX:1,
          scaleY:1
        },
        hover: {
          fillOpacity: 0.5,
          scaleX:1.5,
          scaleY:1.5
        }
      }
    }
   
  ]
};

export const callback = (view: IView) => {
  // do nothing
  view.addEventListener('click', (event, element) => {
    console.log(event, element?.getGraphicItem())
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
