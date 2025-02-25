/* eslint-disable no-console */
import { type IView,  } from '@visactor/vgrammar';
// import data from '../data/imagecloud/baisc.json';
import data from '../data/imagecloud/weight.json';
import vipImages from '../data/imagecloud/vip-images.json';
import dogs from '../data/imagecloud/dogs.json';



import { registerImageCloudTransforms } from '@visactor/vgrammar-imagecloud';
import { createRect, Image } from '@visactor/vrender';



registerImageCloudTransforms();

export const spec = {
  width: 600,
  height: 400,
  background:'rgba(0,0,0,0)',
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
      type: 'image',
      encode: {
        enter: {
          // image: "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_logo.png",
          image:'http://localhost:3000/shape_motuo_mini__1_-removebg-preview.png',
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
          opacity: 0.2,
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
          mask:'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_motuo_mini.png',
          // mask: {
          //   type: 'text',
          //   text: '大',
          //   fontWeight: 'bold',
          // },
          layoutConfig: {
            layoutMode:'stack',
            // cellType:"rect",
            // cellType:"circle",
            // placement:"masked",
            // placement:"edge"
          },
        onUpdateMaskCanvas:(canvas: any) => {
            document.getElementById('footer')?.appendChild(canvas)
          },
          weight:{ field: 'count'},
          image: { field:'url' },
          imageConfig:{
            imageSize:100,
            // imageSizeRange:[50,200]
            // removeWhiteBorder: true,
          },
          ratio: 0.1,
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
          // stroke:'red',
          // lineWidth: 4,

        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          width: {field: 'width'},
          height: {field: 'height'},
          angle: { field: 'angle' },
          clipPath:{field:'clipPath'},
          visible: { field: 'visible' },
          zIndex: { field: 'zIndex' },
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
    console.log(event, element?.graphicItem)
  });
  setTimeout(()=> {
    const images = view.renderer.stage().getElementsByType('image') as Image[];
    let index = 0;
    images.sort((a, b) => a.attribute.zIndex-b.attribute.zIndex);
    for (const image of images) {
      if (image.attribute.visible) {
        const {x, y, width, height,angle, zIndex} = image.attribute
        const rect = createRect({
          x,
          y,
          width,
          height,
          angle,
          fill: false,
          fillOpacity: 1,
          stroke: 'white',
          lineWidth: 4,
          zIndex: index++,
          shadowBlur: 10,
          shadowColor: 'grey'
        });
        image.setAttributes({zIndex: index++, _zIndex: zIndex,});
        image.parent.appendChild(rect);
      }
    }
    console.log('mock stroke done');
    view.renderer.stage().renderNextFrame()
  }, 2000)


};
