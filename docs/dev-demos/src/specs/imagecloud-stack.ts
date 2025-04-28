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
      from: { data: 'baseData' },
      transform: [
        {
          type: 'imagecloud',
          size: [600, 400],
          padding: { signal: 'wordPadding' },
          // mask: "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_logo.png",
          // mask:'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_motuo_mini.png',
          mask: {
            type: 'text',
            text: '狗',
            fontWeight: 'bold',
          },
          layoutConfig: {
            layoutMode:'stack',
            // placement:"masked",
            // placement:"edge"
          },
        onUpdateMaskCanvas:(canvas: any) => {
            document.getElementById('footer')?.appendChild(canvas)
          },
          as:{
            angle:'customAngle',
          },
          weight:{ field: 'count'},
          image: { field:'url' },
          imageConfig:{
            imageSize:40,
            // imageSizeRange:[50,200]
            // removeWhiteBorder: true,
          },
          ratio: 0.08,
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
          stroke:'white',
          lineWidth: 2,
          shadowBlur: 10,
          shadowColor: 'grey'
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          width: {field: 'width'},
          height: {field: 'height'},
          angle: { field: 'customAngle' },
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
}