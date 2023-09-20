const path = require('path');
const baseJestConfig = require('@internal/jest-config/jest.base');

module.exports = {
  ...baseJestConfig,
  moduleNameMapper: {
    'd3-geo': path.resolve(__dirname, './node_modules/d3-geo/dist/d3-geo.js'),
    'd3-array': path.resolve(__dirname, './node_modules/d3-array/dist/d3-array.js'),
    '@visactor/vgrammar-util': path.resolve(__dirname, '../vgrammar-util/src/index.ts'),
    '@visactor/vgrammar-coordinate': path.resolve(__dirname, '../vgrammar-coordinate/src/index.ts'),
    '@visactor/vgrammar-core': path.resolve(__dirname, '../vgrammar-core/src/index.ts')
  }
};
