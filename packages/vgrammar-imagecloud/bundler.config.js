/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es'],
  name: 'VGrammar.Imagecloud',
  external: ['@visactor/vrender-core', '@visactor/vgrammar', '@visactor/vgrammar-util', '@visactor/vutils'],
  globals: {
    '@visactor/vrender-core': 'VRenderCore',
    '@visactor/vgrammar': 'VGrammar',
    '@visactor/vgrammar-util': 'VGrammar.Util',
    '@visactor/vutils': 'VUtils'
  },
  umdOutputFilename: 'index'
};
