import { Signal } from '../../src/view/signal';
import { getMockedView } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

const view = getMockedView();

test('Signal maintains signal value', function () {
  const signal = new Signal(view as any).update({
    callback: () => 'appear',
    dependency: 'signalA'
  });
  expect(signal.output()).toEqual(undefined);
  signal.run();
  expect(signal.output()).toEqual('appear');
  signal.value('disappear').update(undefined);
  expect(signal.output()).toEqual('appear');
  signal.run();
  expect(signal.output()).toEqual('disappear');
});

test('Signal parse spec and collect dependencies', function () {
  const signal = new Signal(view as any);

  const spec0 = {
    id: 'animationState',
    update: {
      callback: () => 'appear',
      dependency: 'signalA'
    }
  };
  signal.parse(spec0 as any);
  const references0 = [] as any[];
  signal.references.forEach((count, reference) => references0.push({ count, reference }));
  expect(signal.references.size).toEqual(1);
  expect(references0[0].count).toEqual(1);
  expect(references0[0].reference.id()).toEqual('signalA');

  const spec1 = {
    id: 'animationState',
    value: 'appear'
  };
  signal.parse(spec1 as any);
  expect(signal.references.size).toEqual(0);
});

test('Signal sets configs by api', function () {
  const signal = new Signal(view as any);

  signal.update({
    callback: () => 'appear',
    dependency: 'signalA'
  });
  const references0 = [] as any[];
  signal.references.forEach((count, reference) => references0.push({ count, reference }));
  expect(signal.references.size).toEqual(1);
  expect(references0[0].count).toEqual(1);
  expect(references0[0].reference.id()).toEqual('signalA');

  signal.value('appear').update(undefined);
  expect(signal.references.size).toEqual(0);
});
