import { defineConfig } from 'vite';
import * as path from 'path';
import pkg from '../../packages/vgrammar/package.json';

const vGrammarPkgs = Object.keys(pkg.dependencies).filter(pkgName => pkgName.startsWith('@visactor/vgrammar-'));

vGrammarPkgs.push('@visactor/vgrammar-projection');
vGrammarPkgs.push('@visactor/vgrammar-wordcloud');
vGrammarPkgs.push('@visactor/vgrammar-wordcloud-shape');
vGrammarPkgs.push('@visactor/vgrammar-sankey');
vGrammarPkgs.push('@visactor/vgrammar-hierarchy');

export default defineConfig({
  server: {
    open: true,
    port: 3010
  },
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(pkg.version),
  },
  optimizeDeps: {},
  resolve: {
    alias: {
      '@visactor/vgrammar': path.resolve('../../packages/vgrammar/src/index.ts'),
      ...vGrammarPkgs.reduce((res, pkgName) => {
        return {
          ...res,
          [pkgName]: path.resolve(`../../packages/${pkgName.replace('@visactor/', '')}/src/index.ts`)
        };
      }, {})
    }
  }
});
