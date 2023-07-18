import * as DarkPalettes from './dark';
import * as LightPalettes from './light';

export const getPalette = (name?: string, dark?: boolean) => {
  return dark ? DarkPalettes[name ?? 'blue'] : LightPalettes[name ?? 'blue'];
};
