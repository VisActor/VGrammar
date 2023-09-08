import type { IView, FeatureCollectionData } from '@visactor/vgrammar';
import { Projection } from '../src/index';
import { getMockedView } from './utils';
import { collectGeoJSON } from '../src/projection';
import { testData } from './data';

test('new Projection', () => {
  const projeciton = new Projection(getMockedView() as unknown as IView);

  expect(projeciton.grammarType).toBe('projection');
  expect(projeciton.getSpec()).toEqual({});

  const specA = {
    type: 'albersUsa'
  };
  projeciton.parse(specA);
  projeciton.evaluate([], {});
  expect(projeciton.getSpec()).toEqual(specA);
  expect(projeciton.output()).not.toBeUndefined();

  const specB = {
    type: 'albers',
    center: [20, 40] as [number, number],
    clipAngle: 180,
    pointRadius: 5,
    fit: testData as FeatureCollectionData,
    size: [400, 600] as [number, number]
  };
  projeciton.parse(specB);
  projeciton.evaluate([], {});
  expect(projeciton.getSpec()).toEqual(specB);
  expect(projeciton.output()).not.toBeUndefined();
  expect(projeciton.output().center()).toEqual(specB.center);
  expect(projeciton.output().clipAngle()).toEqual(specB.clipAngle);
  expect(projeciton.output().path).not.toBeUndefined();
  expect(projeciton.output().path.pointRadius()).toEqual(specB.pointRadius);
});

test('config projection by api', () => {
  const projeciton = new Projection(getMockedView() as unknown as IView);

  expect(projeciton.grammarType).toBe('projection');
  expect(projeciton.getSpec()).toEqual({});
  const specA = {
    type: 'albersUsa'
  };

  projeciton.configure(specA);
  projeciton.evaluate([], {});
  expect(projeciton.getSpec()).toEqual(specA);
  expect(projeciton.output()).not.toBeUndefined();

  const specB = {
    type: 'albers',
    center: [20, 40] as [number, number],
    clipAngle: 180
  };
  projeciton.configure(specB);
  projeciton.evaluate([], {});
  expect(projeciton.getSpec()).toMatchObject(specB);
  expect(projeciton.getSpec().pointRadius).toBeUndefined();
  projeciton.pointRadius(10);
  expect(projeciton.getSpec().pointRadius).toBe(10);
  const specC = {
    type: 'albersUsa',
    center: [10, 20] as [number, number],
    clipAngle: 150
  };
  projeciton.configure(specC);

  expect(projeciton.getSpec()).toMatchObject(specC);
  projeciton.configure(null);
  expect(projeciton.getSpec().center).toBeUndefined();
  expect(projeciton.getSpec().clipAngle).toBeUndefined();
});

test('collectGeoJSON()', () => {
  expect(collectGeoJSON({ any: 1 })).toEqual({ any: 1 });
  expect(collectGeoJSON([{ any: 1 }])).toEqual({ any: 1 });

  const fc = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: [{ type: 'Point' }, { type: 'Point' }]
        // properties: {}
      },
      {
        type: 'Feature',
        geometry: [{ type: 'Point' }, { type: 'Point' }]
        //properties: {}
      }
    ]
  };
  expect(collectGeoJSON(fc)).toEqual(fc);
  expect(collectGeoJSON([fc])).toEqual(fc);
  expect(collectGeoJSON(fc.features)).toEqual(fc);
  expect(collectGeoJSON([[fc.features[0].geometry], [fc.features[1].geometry]])).toEqual(fc);
});
