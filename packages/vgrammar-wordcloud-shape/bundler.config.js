/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es', 'umd'],
  name: 'VGrammar.WordcloudShape',
  external: ['@visactor/vrender', '@visactor/vgrammar', '@visactor/vgrammar-util', '@visactor/vutils', '@visactor/vscale'],
  globals: {
    '@visactor/vrender': 'VRender',
    '@visactor/vgrammar': 'VGrammar',
    '@visactor/vgrammar-util': 'VGrammar.Util',
    '@visactor/vutils': 'VUtils',
    '@visactor/vscale': 'VScale'
  },
  umdOutputFilename: 'vgrammar-wordcloud-shape.js'
};
