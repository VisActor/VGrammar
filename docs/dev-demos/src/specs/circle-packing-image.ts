/* eslint-disable no-console */
import { registerCirclePackingTransforms, flattenNodes } from '@visactor/vgrammar-hierarchy';
import { category20 } from '../color-utils';

registerCirclePackingTransforms();

export const spec = {
  width: 800,
  height: 600,
  padding: 5,

  signals: [
    {
      id: 'gapRadius',
      value: 0,
      bind: { input: 'range', min: 0, max: 20, step: 1 }
    }
  ],

  data: [
    {
      id: 'data',
      values: [
        { value: 10000, url: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg' },
        { value: 15000, url: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_motuo.jpeg' },
        { value: 12000, url: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg' },
        { value: 16000, url: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_motuo.jpeg' },
        { value: 10800, url: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg' },
        { value: 13000, url: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/shape_motuo.jpeg' },
        { value: 19000, url: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg' }
      ],
      dependency: ['padding'],
      transform: [
        {
          type: 'circlePacking',
          // width: { signal: 'viewWidth' },
          // height: { signal: 'viewHeight' },
          x0: {
            // "chartWidth + chartPad"
            callback: (params: any) => {
              return params.padding.left;
            },
            // dependency: ['padding']
          },
          x1: {
            // "chartWidth + chartPad"
            callback: (params: any) => {
              return params.padding.left + params.viewWidth;
            },
            dependency: ['padding', 'viewWidth']
          },
          y0: {
            // "chartWidth + chartPad"
            callback: (params: any) => {
              return params.padding.top;
            },
            dependency: ['padding']
          },
          y1: {
            // "chartWidth + chartPad"
            callback: (params: any) => {
              return params.padding.top + params.viewHeight;
            },
            dependency: ['padding', 'viewHeight']
          },
          padding: 10,
          label: [
            { rotate: 'tangential' },
            { rotate: 'radial', align: 'end' },
            { rotate: 'radial', align: 'start', offset: 10 }
          ]
        }
      ]
    },
    {
      id: 'flattenData',
      source: 'data',
      transform: [
        {
          type: 'map',
          all: true,
          callback: (datum: any) => {
            const res: any[] = [];
            flattenNodes(datum, res, { maxDepth: 2 });
            console.log(res);
            return res;
          }
        }
      ]
    },
    {
      id: 'text',
      source: 'flattenData',
      transform: [
        {
          type: 'filter',
          callback: (datum: any) => {
            return !!datum.label;
          }
        }
      ]
    }
  ],
  marks: [
    {
      type: 'group',

      marks: [
        {
          type: 'rect',
          encode: {
            update: {
              x: {
                // "chartWidth + chartPad"
                callback: (datum: any, el: any, params: any) => {
                  return params.padding.left;
                },
                dependency: ['padding']
              },
              y: {
                // "chartWidth + chartPad"
                callback: (datum: any, el: any, params: any) => {
                  return params.padding.top;
                },
                dependency: ['padding']
              },
              width: {
                signal: 'viewWidth'
              },
              height: {
                signal: 'viewHeight'
              },
              fill: '#e8e8e8'
            }
          }
        },

        {
          type: 'circle',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y' },
              radius: { field: 'radius' },
              lineWidth: (datum: any) => {
                return datum.depth % 2 ? 1 : 2;
              },
              background: (datum: any) => {
                return datum.datum?.[0]?.url;
              },
              // stroke: '#fff',
              stroke: (datum: any) => {
                return category20[datum.flattenIndex] ?? '#ccc';
              }
              // stroke: '#ccc'
            }
          }
        }

        // {
        //   type: 'text',
        //   from: { data: 'text' },
        //   key: 'flattenIndex',
        //   encode: {
        //     update: {
        //       x: { field: 'label.x' },
        //       y: { field: 'label.y' },
        //       textAlign: { field: 'label.textAlign' },
        //       textBaseline: { field: 'label.textBaseline' },
        //       text: (datum: any) => {
        //         return datum.datum[datum.datum.length - 1].name;
        //       },
        //       angle: { field: 'label.angle' },
        //       maxLineWidth: { field: 'label.maxLineWidth' },
        //       fill: '#333'
        //     }
        //   }
        // }
      ]
    }
  ]
};

export const binds = [
  {
    id: 'gapRadius',
    value: 0,
    bind: { input: 'range', min: 0, max: 20, step: 1 }
  }
];
