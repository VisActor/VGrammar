/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es'],
  name: 'VGrammar.Projection',
  umdOutputFilename: 'index',
  globals: {
    '@visactor/vgrammar': 'VGrammar',
    '@visactor/vgrammar-util': 'VGrammar.Util',
    '@visactor/vutils': 'VUtils'
  },
  external: ['@visactor/vgrammar', '@visactor/vgrammar-util', '@visactor/vutils']
};
