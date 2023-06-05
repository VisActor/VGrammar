const path = require('path');
const baseJestConfig = require('@internal/jest-config/jest.base');

module.exports = {
  ...baseJestConfig,
  moduleNameMapper: {
    ...baseJestConfig.moduleNameMapper,
    '@visactor/vgrammar-util': path.resolve(__dirname, '../vgrammar-util/src/index.ts'),
    '@visactor/vgrammar-projection': path.resolve(__dirname, '../vgrammar-projection/src/index.ts'),
    '@visactor/vgrammar-coordinate': path.resolve(__dirname, '../vgrammar-coordinate/src/index.ts')
  }
};
