import { IView } from "@visactor/vgrammar";

export const spec = {
  description: 'A basic area chart example.',
  width: 500,
  height: 200,
  padding: 5,

  data: [
    {
      id: 'table',
      values: [
        { u: 1, v: 28 },
        { u: 2, v: 55 },
        { u: 3, v: 43 },
        { u: 4, v: 91 },
        { u: 5, v: 81 },
        { u: 6, v: 53 },
        { u: 7, v: 19 },
        { u: 8, v: 87 },
        { u: 9, v: 52 },
        { u: 10, v: 48 },
        { u: 11, v: 24 },
        { u: 12, v: 49 },
        { u: 13, v: 87 },
        { u: 14, v: 66 },
        { u: 15, v: -17 },
        { u: 16, v: -27 },
        { u: 17, v: -68 },
        { u: 18, v: -16 },
        { u: 19, v: 49 },
        { u: 20, v: 15 }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.width];
        },
        dependency: ['width']
      },
      zero: false,
      domain: { data: 'table', field: 'u' }
    },
    {
      id: 'yscale',
      type: 'linear',
      range: {
        callback: (scale: any, params: any) => {
          return [params.height, 0];
        },
        dependency: ['height']
      },
      nice: true,
      zero: true,
      domain: [-100, 100]
    }
  ],

  marks: [
    {
      type: 'area',
      id: 'area',
      from: { data: 'table' },
      enableSegments: true,
      encode: {
        update: {
          x: { scale: 'xscale', field: 'u' },
          y: { scale: 'yscale', value: 0 },
          y1: { scale: 'yscale', field: 'v' },
          fill: (datum) => datum.u > 10 ? 'red' : 'steelblue',
          fillOpacity: 1
        },
        hover: {
          fillOpacity: 0.5
        }
      },
      animation: {
        enter: { type: 'fadeIn', duration: 500 },
        update: { type: 'update', duration: 2000 },
      }
    }
  ]
};

export const callback = (view: IView) => {
  const updateButton = document.createElement('button');
  updateButton.innerText = 'update data';
  document.getElementById('footer')?.appendChild(updateButton);

  const originData = [
    { u: 1, v: 28 },
    { u: 2, v: 55 },
    { u: 3, v: 43 },
    { u: 4, v: 91 },
    { u: 5, v: 81 },
    { u: 6, v: 53 },
    { u: 7, v: 19 },
    { u: 8, v: 87 },
    { u: 9, v: 52 },
    { u: 10, v: 48 },
    { u: 11, v: 24 },
    { u: 12, v: 49 },
    { u: 13, v: 87 },
    { u: 14, v: 66 },
    { u: 15, v: -17 },
    { u: 16, v: -27 },
    { u: 17, v: -68 },
    { u: 18, v: -16 },
    { u: 19, v: 49 },
    { u: 20, v: 15 }
  ];

  updateButton.addEventListener('click', () => {
    const data = view.getDataById('table');
    data.values(originData.map(datum => {
      datum.v = datum.v + (Math.random() * 20 - 10);
      return datum;
    }));
    view.run();
  });
};
