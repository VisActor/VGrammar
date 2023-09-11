/* eslint-disable no-console */
import type { IView, IPlot } from '@visactor/vgrammar-simple';
import { category10 } from '../color-utils';

const data = [
  // 2000
  [
    { country: '美国', value: 37 },
    { country: '俄罗斯', value: 32 },
    { country: '中国', value: 28 },
    { country: '澳大利亚', value: 16 },
    { country: '德国', value: 13 },
    { country: '法国', value: 13 },
    { country: '意大利', value: 13 },
    { country: '荷兰', value: 12 },
    { country: '古巴', value: 11 },
    { country: '英国', value: 11 }
  ],
  // 2004
  [
    { country: '美国', value: 36 },
    { country: '中国', value: 32 },
    { country: '俄罗斯', value: 28 },
    { country: '澳大利亚', value: 17 },
    { country: '日本', value: 16 },
    { country: '德国', value: 13 },
    { country: '法国', value: 11 },
    { country: '意大利', value: 10 },
    { country: '韩国', value: 9 },
    { country: '英国', value: 9 }
  ],
  // 2008
  [
    { country: '中国', value: 48 },
    { country: '美国', value: 36 },
    { country: '俄罗斯', value: 24 },
    { country: '英国', value: 19 },
    { country: '德国', value: 16 },
    { country: '澳大利亚', value: 14 },
    { country: '韩国', value: 13 },
    { country: '日本', value: 9 },
    { country: '意大利', value: 8 },
    { country: '法国', value: 7 }
  ],
  // 2012
  [
    { country: '美国', value: 46 },
    { country: '中国', value: 39 },
    { country: '英国', value: 29 },
    { country: '俄罗斯', value: 19 },
    { country: '韩国', value: 13 },
    { country: '德国', value: 11 },
    { country: '法国', value: 11 },
    { country: '澳大利亚', value: 8 },
    { country: '意大利', value: 8 },
    { country: '匈牙利', value: 8 }
  ],
  //2016
  [
    { country: '美国', value: 46 },
    { country: '英国', value: 27 },
    { country: '中国', value: 26 },
    { country: '俄罗斯', value: 19 },
    { country: '德国', value: 17 },
    { country: '日本', value: 12 },
    { country: '法国', value: 10 },
    { country: '韩国', value: 9 },
    { country: '意大利', value: 8 },
    { country: '澳大利亚', value: 8 }
  ],
  // 2020
  [
    { country: '美国', value: 39 },
    { country: '中国', value: 38 },
    { country: '日本', value: 27 },
    { country: '英国', value: 22 },
    { country: '俄罗斯奥林匹克委员会', value: 20 },
    { country: '澳大利亚', value: 17 },
    { country: '荷兰', value: 10 },
    { country: '法国', value: 10 },
    { country: '德国', value: 10 },
    { country: '意大利', value: 10 }
  ]
];

export const runner = (plot: IPlot) => {
  plot.interval()
    .encode('x', 'country')
    .encode('y', 'value')
    .animate('update', { type: 'update' })
    .axis('x', true)
    .axis('y', true)
    .label('y', { textStyle: { fill: 'red'} })
    .player(data, true);
};

export const callback = (view: IView) => {
  // do nothing
};
