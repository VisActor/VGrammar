import type { IView } from '@visactor/vgrammar';
import { Projection } from '../src/index';
import { getMockedView } from './utils';
import type { GeometryData } from '../src/interface';

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
    fit: [{ type: 'Point' }] as GeometryData[]
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
