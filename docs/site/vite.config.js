import pkg from './package.json';
import * as path from 'path';

const { plugin: mdPlugin, Mode } = require('vite-plugin-markdown')

const vGrammarPkgs = Object.keys(pkg.devDependencies).filter(pkgName => pkgName.startsWith('@visactor/vgrammar-'));


export default {
  optimizeDeps: {
  },
  server: {
    host: '0.0.0.0',
    port: 3020,
    https: !!process.env.HTTPS
  },
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(pkg.version)
  },
  resolve: {
    alias: {
      '@visactor/vgrammar': path.resolve('../../packages/vgrammar/src/index.ts'),
      ...vGrammarPkgs.reduce((res, pkgName) => {
        return {
          ...res,
          [pkgName]: path.resolve(
            `../../packages/${pkgName.replace('@visactor/vgrammar', 'vgrammar')}/src/index.ts`
          )
        };
      }, {})
    }
  },
  plugins: [mdPlugin({ mode: [Mode.HTML, Mode.MARKDOWN, Mode.TOC] })]
};
