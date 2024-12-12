import { registerWordCloudShapeTransforms } from '@visactor/vgrammar-wordcloud-shape';
import longText from '../data/wordcloud/longText.json';
import fewData from '../data/wordcloud/fewData.json';
// 用来调试中英区别的
// import fewData2 from '../data/wordcloud/fewData2.json';
import siteData from '../data/wordcloud/siteData.json';
import siteData2 from '../data/wordcloud/siteData2.json';
import siteData3 from '../data/wordcloud/siteData3.json';
import webData from '../data/wordcloud/webData.json';
// 大部分单词位于权重 0.8-1
import webData2 from '../data/wordcloud/webData2.json';
import movieData from '../data/wordcloud/movieData.json';

registerWordCloudShapeTransforms();

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export const spec = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  padding: 0,
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
  data: [
    {
      id: 'table',
      values: fewData,
      transform: [
        {
          type: 'map',
          as: 'name',
          callback: (datum: any) => {
            return datum.challenge_name;
          }
        },
        {
          type: 'map',
          as: 'value',
          callback: (datum: any) => {
            return datum.sum_count;
          }
        },
      ]
    },
    // {
    //   id: 'keywords',
    //   source: 'table',
    //   transform: [
    //     {
    //       type: 'filter',
    //       callback: (datum: any) => {
    //         return !datum.isFillingWord;
    //       }
    //     }
    //   ]
    // },
    // {
    //   id: 'filling',
    //   source: 'table',
    //   transform: [
    //     {
    //       type: 'filter',
    //       callback: (datum: any) => {
    //         return datum.isFillingWord;
    //       }
    //     }
    //   ]
    // }
  ],
  scales: [
    {
      id: 'keyWordsColor',
      type: 'ordinal',
      range: ['#d5a928', '#652c90', '#939597']
    },
    {
      id: 'fillingWordsColor',
      type: 'ordinal',
      range: ['#000']
    }
  ],
  marks: [
    // keywords
    {
      type: 'text',
      from: { data: 'table' },
      transform: [
        {
          type: 'wordcloudShape',
          dataIndexKey: 'text_key',
          size: [CANVAS_WIDTH, CANVAS_HEIGHT],
          fontFamily: { field: 'font' },
          fontSize: { field: 'value' },

          // rotateList: [0, 90],
          text: { field: 'name' },
          colorMode: 'ordinal',
          // colorField: 'value',
          // colorMode: 'linear',
          // colorRange: [
          //   '#5145CE',
          //   '#146F94',
          //   '#146F94',
          //   '#0A9798',
          //   '#4CB38E',
          //   '#B2CE7D',
          // ],
          padding: 1,
          fillingPadding: 0.4,
          // fillingColorList: ['#5145CE'],
          // colorList: ['#7065D7'],
          colorList: [
            '#e5352b',
            '#e990ab',
            '#ffd616',
            '#96cbb3',
            '#91be3e',
            '#39a6dd',
            '#eb0973',
            '#949483',
            '#f47b7b',
            '#9f1f5c',
            '#ef9020',
            '#00af3e',
            '#85b7e2',
            '#29245c',
            '#00af3e'
          ],
          shape: `${window.location.origin}/src/image/shape_logo.png`,
          // 熊掌
          // shape: `${window.location.origin}/src/image/shape_bears.png`,
          // shape: `${window.location.origin}/src/image/shape_bears2.png`,
          // 胡子
          // "shape": `${window.location.origin}/src/image/shape_moustache.png`,
          // 海豚
          // "shape": `${window.location.origin}/src/image/shape_dolphin.png`,
          // 蝴蝶结
          // "shape": `${window.location.origin}/src/image/shape_tie.png`,
          // family
          // shape: `${window.location.origin}/src/image/shape_man2.png`,
          // shape: `${window.location.origin}/src/image/shape_man4.png`,
          // shape: `${window.location.origin}/src/image/shape_recycle.png`,
          // shape: `${window.location.origin}/src/image/shape_test2.png`,

          fillingRatio: 0.7,
          ratio: 1,

          "fillingTimes": 1,
          // "fillingFontWeight": "bold",
          // "fillingFontStyle": "italic",
          fillingRotateList: ['0'],
          // "fillingRotateList":["0","45","-45","90","-90"],
          // "fillingInitialOpacity": 0.6,
          // "fillingDeltaOpacity": 0,
          // "fillingInitialFontSize": 7,
          // "fillingDeltaFontSize":1.5,
          // fillingColor: '#537EF5',
          // "fillingPadding":0.05,
          // removeWhiteBorder: true,
          // fillingColor: 'black',

          // colorField: 'value',
          // // "colorMode":"linear",
          // // "colorRange":["#5a76a6","#20589B"],
          // colorMode: 'ordinal',
          // colorList: ['#496897'],
          // // fontSizeRange: [15, 20],
          // fontOpacity: 1,
          // fillingColor: '#315785',
          // fillingRotateList: ['0', '30', '-30', '45', '-45', '75', '-75'],
          // // fillingRotateList: ['0', '90'],
          // fillingInitialOpacity: 1,
          // fillingDeltaOpacity: 0.1,
          // fillingTimes: 6,
          // fillingInitialFontSize: 4.5,
          // fillingDeltaFontSize: 0.6,
          // fillingWordsFontSizeRatio: 0.7,
          random: false,
          textLayoutTimes: 1,
          fontSizeShrinkFactor: 0.9,
          stepFactor: 4,
          layoutMode: 'ensureMappingEnlarge',
          fontSizeEnlargeFactor: 1.2,
          // fillingXStep: 2,
          // fillingYStep: 2,
          fillingXRatioStep: 0.008, // 步长为宽度的比例
          fillingYRatioStep: 0.008
        }
      ],
      key: 'text_key',
      encode: {
        enter: {
          // "text": { "field": "challenge_name" },
          text: { field: 'name' },
          textAlign: 'center',
          textBaseline: 'alphabetic',
          fill: { field: 'color' },
          fontFamily: { field: 'fontFamily' },
          fontWeight: { field: 'fontWeight' },
          fontStyle: { field: 'fontStyle' },
          // visible: { field: 'visible' }
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          angle: { field: 'angle' },
          fontSize: { field: 'fontSize' },
          // fillOpacity: { field: 'opacity' }
        },
        hover: {
          fillOpacity: { value: 0.5 }
        }
      }
    },
    // fillingwords
    // {
    //   type: 'text',
    //   from: { data: 'filling' },
    //   encode: {
    //     enter: {
    //       text: { field: 'name' },
    //       textAlign: 'center',
    //       textBaseline: 'alphabetic',
    //       fill: { field: 'color' },
    //       fontFamily: { field: 'fontFamily' },
    //       fontWeight: { field: 'fontWeight' },
    //       fontStyle: { field: 'fontStyle' },
    //       fillOpacity: { field: 'opacity' }
    //     },
    //     update: {
    //       x: { field: 'x' },
    //       y: { field: 'y' },
    //       angle: { field: 'angle' },
    //       fontSize: { field: 'fontSize' }
    //     }
    //   }
    // }
    // {
    //   id: 'marks',
    //   type: 'symbol',
    //   from: { data: 'keywords' },
    //   encode: {
    //     enter: {
    //       fill: { value: 'red' },
    //     },

    //     update: {
    //       x: { field: 'x' },
    //       y: { field: 'y' },
    //       shape: { value: 'circle' },
    //       size: { value: 10 },
    //       opacity: { value: 1 },
    //     },
    //   },
    // },
    // {
    //   id: 'marks2',
    //   type: 'symbol',
    //   from: { data: 'filling' },
    //   encode: {
    //     enter: {
    //       fill: { value: 'blue' },
    //     },

    //     update: {
    //       x: { field: 'x' },
    //       y: { field: 'y' },
    //       shape: { value: 'circle' },
    //       size: { value: 10 },
    //       opacity: { value: 1 },
    //     },
    //   },
    // },
  ]
};
