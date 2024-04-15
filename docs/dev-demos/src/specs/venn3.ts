/* eslint-disable no-console */
import { registerVennTransforms } from '@visactor/vgrammar-venn';

registerVennTransforms();

export const spec = {
  width: 800,
  height: 600,
  padding: 5,

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
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
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
              x: { field: 'x' },
              y: { field: 'y' },
              innerRadius: 0,
              outerRadius: { field: 'radius' },
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
              path: { field: 'path' },
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
              x: { field: 'labelX' },
              y: { field: 'labelY' },
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

