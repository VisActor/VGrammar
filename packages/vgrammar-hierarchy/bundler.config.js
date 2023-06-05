/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es', 'umd'],
  name: 'VGrammar.Hierarchy',
  external: ['@visactor/vgrammar', '@visactor/vgrammar-util', '@visactor/vutils', '@visactor/vrender'],
  globals: {
    '@visactor/vrender': 'VRender',
    '@visactor/vgrammar': 'VGrammar',
    '@visactor/vgrammar-util': 'VGrammar.Util',
    '@visactor/vutils': 'VUtils'
  },
  umdOutputFilename: 'vgrammar-hierarchy.js',
};
