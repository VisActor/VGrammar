const path = require('path');
const baseJestConfig = require('@internal/jest-config/jest.base');

module.exports = {
  ...baseJestConfig,
  moduleNameMapper: {
    '@visactor/vgrammar-util': path.resolve(__dirname, '../vgrammar-util/src/index.ts'),
    '@visactor/vgrammar': path.resolve(__dirname, '../vgrammar/src/index.ts')
  }
};
