import type { ITheme } from '../types';
import { defaultComponentTheme } from './common/component';
import { defaultMarkTheme } from './common/mark';

export const defaultTheme: ITheme = {
  name: 'default',
  padding: 10,
  palette: {
    blue: ['#6690F2', '#70D6A3', '#B4E6E2', '#63B5FC', '#FF8F62', '#FFDC83', '#BCC5FD', '#A29BFE', '#63C4C7', '#F68484']
  },
  marks: defaultMarkTheme,
  components: defaultComponentTheme
};
