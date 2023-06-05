import { registerWordCloudTransforms } from '@visactor/vgrammar-wordcloud';
import { RotateBySphereAnimate } from '@visactor/vrender';
import baseData from '../data/wordcloud/social-media.json';
import type { IElement } from '@visactor/vgrammar';
registerWordCloudTransforms();

const depth_3d = 10;

export const spec = {
  
  //   "name": "WordcloudShape",
  //   "width": CANVAS_WIDTH,
  //   "height": CANVAS_HEIGHT,
  //   "padding": {
  //     "top": 0,
  //     "bottom": 0,
  //     "left": 0,
  //     "right": 0
  //   },
  //   "autosize": "none",
  width: 300,
  height: 300,
  padding: 5,

  data: [
    {
      id: 'baseData',
      values: baseData.slice(0, 50),
      transform: [
        {
          type: 'map',
          as: 'weight',
          callback: (datum: any) => {
            return 300;
          }
        },
        {
          type: 'wordcloud',
          size: [300, 300],
          postProjection: 'StereographicProjection',
          depth_3d,
          // "size": [{"signal": "width"}, {"signal": "height"}],
          text: { field: 'challenge_name' },
          fontFamily: 'HuaWenHeiTi',
          fontSize: { field: 'sum_count' },
          fontWeight: { field: 'weight' },
          fontSizeRange: [10, 40], // 字体范围
          padding: { signal: 'wordPadding' },
          rotate: { field: 'rotate' },
          shrink: true, // 是否支持缩小显示单词
          enlarge: false, // 是否支持放大填满画布
          minFontSize: 2, // 缩放时最小字号
          clip: false,
          // "spiral": "rectangular",
          randomVisible: false,
          shape: 'circle',
          layoutType: 'fast'
          // progressiveStep: 50
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
      support3d: true,
      type: 'text',
      from: { data: 'baseData' },
      encode: {
        enter: {
          text: { field: 'challenge_name' },
          textAlign: 'center',
          baseline: 'alphabetic',
          fill: { scale: 'color', field: 'challenge_name' },
          // font: 'Helvetica Neue, Arial',
          fontFamily: { field: 'fontFamily' },
          fontWeight: { field: 'weight' }
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          angle: { field: 'angle' },
          fontSize: { field: 'fontSize' },
          z: { field: 'z' }
        },
        hover: {
          fillOpacity: 0.5
        }
      },
      animation: {
        enter: {
          // type: 'fadeIn',
          options: { orient: 'negative' },
          duration: 6000,
          loop: Infinity,
          custom: RotateBySphereAnimate,
          customParameters: (datum: any, element: IElement) => {
            const r = 150;
            return { center: { x: r, y: r, z: depth_3d }, r };
          },
          easing: 'linear'
        },
        loop: {
          loop: true,
          startTime: 0,
          totalTime: 2000,
          timeSlices: [
            {
              effects: {
                channel: {
                  fillColor: { to: 'pink' }
                },
                easing: 'linear'
              },
              duration: 1000
            },
            {
              // delay: 1000,
              effects: {
                channel: {
                  // fillColor: { to: 'orange' }
                  fillOpacity: { to: 0.5 }
                },
                easing: 'linear'
              },
              duration: 1000
            }
          ]
        }
      }
    }
  ]
};
