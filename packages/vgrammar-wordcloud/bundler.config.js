/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es'],
  name: 'VGrammar.Wordcloud',
  external: ['@visactor/vrender', '@visactor/vgrammar', '@visactor/vgrammar-util', '@visactor/vutils'],
  globals: {
    '@visactor/vrender': 'VRender',
    '@visactor/vgrammar': 'VGrammar',
    '@visactor/vgrammar-util': 'VGrammar.Util',
    '@visactor/vutils': 'VUtils'
  },
  umdOutputFilename: 'index'
};
