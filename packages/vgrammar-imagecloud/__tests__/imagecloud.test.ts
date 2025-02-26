import { transform } from '../src/imagecloud';
import { initBrowserEnv } from '@visactor/vrender-kits';

initBrowserEnv();

test('imagecloud should indicate when size is invalid', async () => {
  const data = [{ image: 'https://visactor.io/logo.png' }];
  const result = transform(
    {
      size: [0, 0],
      image: { field: 'image' }
    },
    data
  );
  expect(result).toEqual([]);
});
