/* eslint-disable no-console */
import { type IView,  } from '@visactor/vgrammar';
// import data from '../data/imagecloud/baisc.json';
import data from '../data/imagecloud/weight.json';
import vipImages from '../data/imagecloud/vip-images.json';
import { registerImageCloudTransforms } from '@visactor/vgrammar-imagecloud';

registerImageCloudTransforms();

export const spec = {
  width: 600,
  height: 400,
  // background:'pink',
  data: [
    {
      id: 'baseData',
      values: data,
      // values: vipImages,
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
      id:'images',
      from: { data: 'baseData' },
      transform: [
        {
          type: 'imagecloud',
          size: [600, 400],
          mask: {
            type: 'text',
            text: '大',
            fontWeight: 'bold',
          },
            // mask:'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_motuo_mini.png',
          // mask:'http://localhost:3003/shape_motuo_mini__1_-removebg-preview.png',
          onUpdateMaskCanvas:(canvas: any) => {
            document.getElementById('footer')?.appendChild(canvas)
          },
          weight: 100,
          image: { field:'url' },
          imageConfig:{
            // imageSize: {field:'weight'},
            // imageSize:30

            // imageSizeRange:[10, 20]
          },
          layoutConfig:{
            fillingTimes: 10,
            minFillingImageSize:14
            // fillingOpacity :0.2
          },
          backgroundColor: 'pink',
          progressiveStep: 50,
        }
      ],
      encode: {
        enter: {
          image: { field: 'url' },
          // _debug_bounds: true,
          lineWidth:1
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          visible: { field: 'visible' },
          width: {field: 'width'},
          height: {field: 'height'},
          angle: { field: 'angle' },
          opacity: { field: 'opacity' },
          stroke: 'red',
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
    if(element && element.mark.markType === 'image') {
      console.log(element, element.getGraphicItem());
    }
  });
};
