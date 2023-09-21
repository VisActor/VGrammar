/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es'],
  name: 'VGrammar.Hierarchy',
  external: ['@visactor/vgrammar', '@visactor/vgrammar-util', '@visactor/vutils', '@visactor/vrender-core'],
  globals: {
    '@visactor/vrender-core': 'VRenderCore',
    '@visactor/vgrammar': 'VGrammar',
    '@visactor/vgrammar-util': 'VGrammar.Util',
    '@visactor/vutils': 'VUtils'
  },
  umdOutputFilename: 'index'
};
