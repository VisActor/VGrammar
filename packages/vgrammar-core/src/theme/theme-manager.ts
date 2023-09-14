import type { ITheme } from '../types';
import { darkTheme } from './dark';
import { defaultTheme } from './default';

export class ThemeManager {
  private static _themes: Map<string, ITheme> = new Map();

  static registerTheme(name: string, theme: Partial<ITheme>) {
    if (!name) {
      return;
    }
    ThemeManager._themes.set(name, theme);
  }

  static unregisterTheme(name: string) {
    ThemeManager._themes.delete(name);
  }

  static getTheme(name: string) {
    return ThemeManager._themes.get(name);
  }

  static getDefaultTheme() {
    return ThemeManager.getTheme('default');
  }
}

ThemeManager.registerTheme('default', defaultTheme);
ThemeManager.registerTheme('dark', darkTheme);
