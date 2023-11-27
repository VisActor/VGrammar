import type { IPointLike } from '@visactor/vutils';
import { Factory } from '../core/factory';
import type { WaveEncoderSpec } from '../types';
import { registerGlyphGraphic } from '../graph/mark/graphic';

export const registerWaveGlyph = () => {
  Factory.registerGlyph<WaveEncoderSpec>('wave', {
    wave0: 'area',
    wave1: 'area',
    wave2: 'area'
  })
    .registerChannelEncoder('wave', (channel, encodeValue, encodeValues, datum, element) => {
      const originPoints: IPointLike[] = new Array(21).fill(0).map((v, index) => {
        const waveHeight = index % 2 === 0 ? 20 : 0;
        return { x: -500 + 50 * index, y: encodeValues.y + waveHeight, y1: encodeValues.y + encodeValues.height };
      });
      const points0 = originPoints.map(point => {
        return { x: point.x + encodeValue * 100, y: point.y, y1: point.y1 };
      });
      const points1 = originPoints.map(point => {
        return { x: point.x + encodeValue * 200 - 40, y: point.y, y1: point.y1 };
      });
      const points2 = originPoints.map(point => {
        return { x: point.x + encodeValue * 300 - 20, y: point.y, y1: point.y1 };
      });
      return {
        wave0: { points: points0, x: 0, y: 0 },
        wave1: { points: points1, x: 0, y: 0 },
        wave2: { points: points2, x: 0, y: 0 }
      };
    })
    .registerDefaultEncoder(() => {
      return {
        wave0: { curveType: 'monotoneX', fillOpacity: 1 },
        wave1: { curveType: 'monotoneX', fillOpacity: 0.66 },
        wave2: { curveType: 'monotoneX', fillOpacity: 0.33 }
      };
    });
  registerGlyphGraphic();
};
