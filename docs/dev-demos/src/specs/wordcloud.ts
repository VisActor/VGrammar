import { registerWordCloudTransforms } from '@visactor/vgrammar-wordcloud';
import baseData from '../data/wordcloud/social-media.json';
registerWordCloudTransforms();

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
  width: 500,
  height: 500,
  padding: 5,

  data: [
    {
      id: 'baseData',
      values: [
        {
          "name": "螺蛳粉",
          "value": 957,
          "__VCHART_DEFAULT_DATA_SERIES_FIELD": "wordCloud_5",
          "__VCHART_DEFAULT_DATA_INDEX": 0,
          "__VCHART_DEFAULT_DATA_KEY": "_0",
          "__VCHART_WORD_CLOUD_WEIGHT": 500,
          "__VCHART_WORD_CLOUD_ANGLE": 0,
          "__VCHART_WORD_CLOUD_FILLING_ANGLE": 0,
          "VGRAMMAR_DATA_ID_KEY_16": 0
        },
        {
          "name": "钵钵鸡",
          "value": 942,
          "__VCHART_DEFAULT_DATA_SERIES_FIELD": "wordCloud_5",
          "__VCHART_DEFAULT_DATA_INDEX": 1,
          "__VCHART_DEFAULT_DATA_KEY": "_1",
          "__VCHART_WORD_CLOUD_WEIGHT": 488.2506527415144,
          "__VCHART_WORD_CLOUD_ANGLE": 0,
          "__VCHART_WORD_CLOUD_FILLING_ANGLE": 0,
          "VGRAMMAR_DATA_ID_KEY_16": 1
        },
        {
          "name": "板栗",
          "value": 842,
          "__VCHART_DEFAULT_DATA_SERIES_FIELD": "wordCloud_5",
          "__VCHART_DEFAULT_DATA_INDEX": 2,
          "__VCHART_DEFAULT_DATA_KEY": "_2",
          "__VCHART_WORD_CLOUD_WEIGHT": 409.92167101827675,
          "__VCHART_WORD_CLOUD_ANGLE": 0,
          "__VCHART_WORD_CLOUD_FILLING_ANGLE": 0,
          "VGRAMMAR_DATA_ID_KEY_16": 2
        },
        {
          "name": "胡辣汤",
          "value": 828,
          "__VCHART_DEFAULT_DATA_SERIES_FIELD": "wordCloud_5",
          "__VCHART_DEFAULT_DATA_INDEX": 3,
          "__VCHART_DEFAULT_DATA_KEY": "_3",
          "__VCHART_WORD_CLOUD_WEIGHT": 398.95561357702354,
          "__VCHART_WORD_CLOUD_ANGLE": 0,
          "__VCHART_WORD_CLOUD_FILLING_ANGLE": 0,
          "VGRAMMAR_DATA_ID_KEY_16": 3
        },
        {
          "name": "关东煮",
          "value": 665,
          "__VCHART_DEFAULT_DATA_SERIES_FIELD": "wordCloud_5",
          "__VCHART_DEFAULT_DATA_INDEX": 4,
          "__VCHART_DEFAULT_DATA_KEY": "_4",
          "__VCHART_WORD_CLOUD_WEIGHT": 271.27937336814625,
          "__VCHART_WORD_CLOUD_ANGLE": 0,
          "__VCHART_WORD_CLOUD_FILLING_ANGLE": 0,
          "VGRAMMAR_DATA_ID_KEY_16": 4
        },
        {
          "name": "羊肉汤",
          "value": 627,
          "__VCHART_DEFAULT_DATA_SERIES_FIELD": "wordCloud_5",
          "__VCHART_DEFAULT_DATA_INDEX": 5,
          "__VCHART_DEFAULT_DATA_KEY": "_5",
          "__VCHART_WORD_CLOUD_WEIGHT": 241.51436031331593,
          "__VCHART_WORD_CLOUD_ANGLE": 0,
          "__VCHART_WORD_CLOUD_FILLING_ANGLE": 0,
          "VGRAMMAR_DATA_ID_KEY_16": 5
        },
        {
          "name": "热干面",
          "value": 574,
          "__VCHART_DEFAULT_DATA_SERIES_FIELD": "wordCloud_5",
          "__VCHART_DEFAULT_DATA_INDEX": 6,
          "__VCHART_DEFAULT_DATA_KEY": "_6",
          "__VCHART_WORD_CLOUD_WEIGHT": 200,
          "__VCHART_WORD_CLOUD_ANGLE": 0,
          "__VCHART_WORD_CLOUD_FILLING_ANGLE": 0,
          "VGRAMMAR_DATA_ID_KEY_16": 6
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
      domain: { data: 'baseData', field: 'name' }
    }
  ],
  marks: [
    {
      type: 'text',
      from: { data: 'baseData' },
      transform: [
        {
          type: 'wordcloud',
          size: [170, 10],
          // "size": [{"signal": "width"}, {"signal": "height"}],
          text: { field: 'name' },
          "padding": 1,
          "spiral": "archimedean",
          "shape": "circle",
          "fontFamily": "sans-serif",
          "fontStyle": "normal",
          "shrink": true,
          "clip": false,
          "enlarge": true,
          "minFontSize": 0,
          "random": true
        }
      ],
      encode: {
        enter: {
          text: { field: 'name' },
          textAlign: 'center',
          baseline: 'alphabetic',
          fill: { scale: 'color', field: 'name' },
          // font: 'Helvetica Neue, Arial',
          fontFamily: { field: 'fontFamily' },
          fontWeight: { field: 'weight' }
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          angle: { field: 'angle' },
          fontSize: { field: 'fontSize' },
          fillOpacity: 1
        },
        hover: {
          fillOpacity: 0.5
        }
      }
    }
  ]
};
