/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es'],
  name: 'VGrammar.WordcloudShape',
  external: [
    '@visactor/vrender-core',
    '@visactor/vgrammar',
    '@visactor/vgrammar-util',
    '@visactor/vutils',
    '@visactor/vscale'
  ],
  globals: {
    '@visactor/vrender-core': 'VRenderCore',
    '@visactor/vgrammar': 'VGrammar',
    '@visactor/vgrammar-util': 'VGrammar.Util',
    '@visactor/vutils': 'VUtils',
    '@visactor/vscale': 'VScale'
  },
  umdOutputFilename: 'index'
};
