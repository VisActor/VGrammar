import { jsx, VRichText, Fragment } from '@visactor/vrender'
import { textHtml, version, richXul } from "@visactor/vgrammar";

export const spec = {
  width: 400,
  height: 200,
  padding: 5,

  signals: [
    {
      id: 'text',
      value: 'Text Label',
      bind: { input: 'select', options: ['Text Label', ['Text Label', 'Second Line']] }
    },
    { id: 'x', value: 100, bind: { input: 'range', min: 0, max: 200, step: 1 } },
    { id: 'y', value: 100, bind: { input: 'range', min: 0, max: 200, step: 1 } },
    { id: 'dx', value: 0, bind: { input: 'range', min: -20, max: 20, step: 1 } },
    { id: 'angle', value: 0, bind: { input: 'range', min: -180, max: 180, step: 1 } },
    { id: 'fontSize', value: 18, bind: { input: 'range', min: 1, max: 36, step: 1 } },
    { id: 'limit', value: 150, bind: { input: 'range', min: 0, max: 150, step: 1 } },
    { id: 'align', value: 'left', bind: { input: 'select', options: ['left', 'center', 'right'] } },
    {
      id: 'baseline',
      value: 'alphabetic'
    },
    { id: 'font', value: 'sans-serif' },
    { id: 'fontWeight', value: 'normal' },
    { id: 'fontStyle', value: 'normal' },

    { id: 'lineWidth', value: 1 },
    { id: 'lineCap', value: 'butt' },
    {
      id: 'lineDash',
      value: [1, 0]
    },
    { id: 'lineDashOffset', value: 0 },
    { id: 'lineJoin', value: 'miter' },
    { id: 'miterLimit', value: 0 },
    {
      id: 'animationState',
      value: null
    }
  ],

  marks: [
    {
      type: 'symbol',
      interactive: false,
      encode: {
        enter: {
          fill: '#ff7300',
          size: 10
        },
        update: {
          x: {
            signal: 'x'
          },
          y: {
            signal: 'y'
          }
        }
      }
    },
    {
      type: 'text',
      animationState: {
        signal: 'animationState'
      },
      animation: {
        apprea: {
          type: 'printIn'
        },
        enter: {
          type: 'fadeIn',
          duration: 1000
        },
        exit: {
          type: 'fadeOut',
          duration: 1000
        },
        update: {
          channel: ['x', 'y', 'dx']
        }
      },
      encode: {
        enter: {
          fill: '#000',
          fillOpacity: 0.5,
          stroke: 'red',
          strokeOpacity: 0.8
        },
        update: {
          // text: {
          //   type: 'rich',
          //   text: (
          //     <VRichText>
          //       <VRichText.Text attribute={{ fill: 'red', text: '测试文本' }}>富文本全局</VRichText.Text>
          //       <VRichText.Image  attribute={{ image: `${window.location.origin}/src/image/shape_logo.png`,width: 30, height: 30,id: 'circle-0' }}/>
          //     </VRichText>
          //   ),
          // },
          // text: textHtml`<p>这是一个html字符串${version}</p>`,
          text: richXul`<tc>
          <text attribute="fill: red;">富文本全局</text>
          <image attribute="image: ${window.location.origin}/src/image/shape_logo.png; width: 30; height: 30; id: circle-0;"></image>
          </tc>`,
          opacity: 1,
          x: {
            signal: 'x'
          },
          y: {
            signal: 'y'
          },
          dx: {
            signal: 'dx'
          },
          angle: {
            signal: 'angle'
          },
          align: {
            signal: 'align'
          },
          baseline: {
            signal: 'baseline'
          },
          font: {
            signal: 'font'
          },
          fontSize: {
            signal: 'fontSize'
          },
          fontStyle: {
            signal: 'fontStyle'
          },
          fontWeight: {
            signal: 'fontWeight'
          },
          limit: {
            signal: 'limit'
          },
          lineWidth: {
            signal: 'lineWidth'
          },
          lineCap: {
            signal: 'lineCap'
          },
          lineDash: {
            signal: 'lineDash'
          },
          lineDashOffset: {
            signal: 'lineDashOffset'
          },
          lineJoin: {
            signal: 'lineJoin'
          },
          miterLimit: {
            signal: 'miterLimit'
          }
        },
        hover: {
          opacity: 0.5
        }
      }
    }
  ]
};

export const binds = [
  {
    id: 'text',
    value: 'Text Label',
    bind: { input: 'select', options: ['Text Label', ['Text Label', 'Second Line']] }
  },
  { id: 'x', value: 100, bind: { input: 'range', min: 0, max: 200, step: 1 } },
  { id: 'y', value: 100, bind: { input: 'range', min: 0, max: 200, step: 1 } },
  { id: 'dx', value: 0, bind: { input: 'range', min: -20, max: 20, step: 1 } },
  { id: 'angle', value: 0, bind: { input: 'range', min: -180, max: 180, step: 1 } },
  { id: 'fontSize', value: 18, bind: { input: 'range', min: 1, max: 36, step: 1 } },
  { id: 'limit', value: 0, bind: { input: 'range', min: 0, max: 150, step: 1 } },
  { id: 'align', value: 'left', bind: { input: 'select', options: ['left', 'center', 'right'] } },
  {
    id: 'baseline',
    value: 'alphabetic',
    bind: { input: 'select', options: ['alphabetic', 'top', 'middle', 'bottom'] }
  },
  { id: 'font', value: 'sans-serif', bind: { input: 'select', options: ['sans-serif', 'serif', 'monospace'] } },
  { id: 'fontWeight', value: 'normal', bind: { input: 'select', options: ['normal', 'bold'] } },
  { id: 'fontStyle', value: 'normal', bind: { input: 'select', options: ['normal', 'italic'] } },

  { id: 'lineWidth', value: 1, bind: { input: 'range', min: 0, max: 10, step: 0.5 } },
  { id: 'lineCap', value: 'butt', bind: { input: 'radio', options: ['butt', 'round', 'square'] } },
  {
    id: 'lineDash',
    value: [1, 0],
    bind: {
      input: 'select',
      options: [
        [1, 0],
        [8, 8],
        [8, 4],
        [4, 4],
        [4, 2],
        [2, 1],
        [1, 1]
      ]
    }
  },
  { id: 'lineDashOffset', value: 0, bind: { input: 'range', min: 0, max: 50, step: 1 } },
  { id: 'lineJoin', value: 'miter', bind: { input: 'radio', options: ['miter', 'round', 'bevel'] } },
  { id: 'miterLimit', value: 0, bind: { input: 'range', min: 0, max: 50, step: 1 } },
  {
    id: 'animationState',
    bind: { input: 'radio', options: ['appear'] }
  }
];
