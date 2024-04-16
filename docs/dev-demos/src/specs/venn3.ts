/* eslint-disable no-console */
import { VGRAMMAR_VENN_CIRCLE_RADIUS, VGRAMMAR_VENN_CIRCLE_X, VGRAMMAR_VENN_CIRCLE_Y, VGRAMMAR_VENN_LABEL_X, VGRAMMAR_VENN_LABEL_Y, VGRAMMAR_VENN_OVERLAP_PATH, registerVennTransforms } from '@visactor/vgrammar-venn';

registerVennTransforms();

export const spec = {
  width: 500,
  height: 500,
  padding: 0,

  data: [
    {
      id: 'data',
      values: [
        {sets: ['A'], size: 12, label: 'A'},
        {sets: ['B'], size: 12, label: 'B'},
        {sets: ['C'], size: 12, label: 'C'},
        {sets: ['A','B'], size: 4, label: 'A,B', stroke: 'red'},
        {sets: ['A','C'], size: 4, label: 'A,C', stroke: 'red'},
        {sets: ['B','C'], size: 4, label: 'B,C', stroke: 'red'},
        {sets: ['A','B','C'], size: 2, label: 'A,B,C', stroke: 'blue'},
      ],
      transform: [
        {
          type: 'venn',
          x0: {
            // "chartWidth + chartPad"
            callback: (params: any) => {
              return params.padding.left;
            },
            dependency: ['padding']
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
        }
      ]
    }
  ],
  marks: [
    {
      type: 'group',
      marks: [
        {
          type: 'arc',
          from: {
            data: 'data'
          },
          transform: [
            {
              type: 'vennMark',
              datumType: 'circle'
            }
          ],
          encode: {
            update: {
              x: { field: VGRAMMAR_VENN_CIRCLE_X },
              y: { field: VGRAMMAR_VENN_CIRCLE_Y },
              innerRadius: 0,
              outerRadius: { field: VGRAMMAR_VENN_CIRCLE_RADIUS },
              startAngle: 0,
              endAngle: Math.PI * 2,
              fill: 'red',
              fillOpacity: 0.2
            }
          }
        },
        {
          type: 'path',
          from: {
            data: 'data'
          },
          transform: [
            {
              type: 'vennMark',
              datumType: 'overlap'
            }
          ],
          encode: {
            update: {
              x: 0,
              y: 0,
              path: { field: VGRAMMAR_VENN_OVERLAP_PATH },
              fill: 'blue',
              fillOpacity: 0.2,
              stroke: { field: 'stroke' },
              lineWidth: 2
            }
          }
        },
        {
          type: 'text',
          from: {
            data: 'data'
          },
          encode: {
            update: {
              x: { field: VGRAMMAR_VENN_LABEL_X },
              y: { field: VGRAMMAR_VENN_LABEL_Y },
              text: { field: 'label' },
              textAlign: 'center',
              textBaseLine: 'middle',
              fill: 'black'
            }
          }
        },
      ]
    }
  ]
};

