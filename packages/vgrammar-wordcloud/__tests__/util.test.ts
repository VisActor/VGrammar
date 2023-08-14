import { isSupported, getMinFontSizeOfEnv, randomHslColor, functor } from '../src/util';

test('isSupported()', () => {
  expect(isSupported()).toBe(true);
});

test('getMinFontSizeOfEnv()', () => {
  expect(getMinFontSizeOfEnv()).toBe(12);
});

test('randomHslColor()', () => {
  expect(randomHslColor(0, 100).indexOf('hsl(')).toBe(0);
});

test('functor()', () => {
  const a = () => 0;
  expect(functor(a)).toBe(a);
  expect(typeof functor('a')).toBe('function');
});
