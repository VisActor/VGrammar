import { Projection, registerGeoTransforms } from '../src';
import type { IView } from '@visactor/vgrammar';
import { getTransform } from '@visactor/vgrammar';
import { getMockedView } from './utils';
import { testData } from './data';
import type { FeatureCollectionData } from '../src/interface';

registerGeoTransforms();

test('return geo path when use geoPath()', () => {
  const transform = getTransform('geoPath');
  const projeciton = new Projection(getMockedView() as unknown as IView);
  const specB = {
    type: 'albers',
    fit: testData as FeatureCollectionData,
    size: [400, 600] as [number, number]
  };
  projeciton.parse(specB);
  projeciton.evaluate([], {});
  const proj = projeciton.output();

  expect(transform).not.toBeUndefined();

  const res = transform.transform(
    {
      projeciton: proj
    },
    [testData]
  );
  expect(res.length).toBe(1);
  expect(res[0]).toBeDefined();
});

test('return geo path when use geoPath()', () => {
  const transform = getTransform('geoPath');
  const projeciton = new Projection(getMockedView() as unknown as IView);
  const specB = {
    type: 'albers',
    pointRadius: 5,
    fit: testData as FeatureCollectionData,
    size: [400, 600] as [number, number]
  };
  projeciton.parse(specB);
  projeciton.evaluate([], {});
  const proj = projeciton.output();

  expect(transform).not.toBeUndefined();

  const res = transform.transform(
    {
      projeciton: proj,
      as: 'path'
    },
    [testData]
  );
  expect(res.length).toBe(1);
  expect(res[0].path).toBeDefined();
});
