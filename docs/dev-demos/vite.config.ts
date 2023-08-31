import { defineConfig } from 'vite';
import * as path from 'path';
import pkg from './package.json';
import react from '@vitejs/plugin-react';

const vGrammarPkgs = Object.keys(pkg.devDependencies).filter(pkgName => pkgName.startsWith('@visactor/vgrammar-'));


export default defineConfig({
  server: {
    open: true,
    port: 3010
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            '@babel/plugin-transform-react-jsx',
            {
              pragma: 'jsx',
              pragmaFrag: 'Fragment'
            }
          ]
        ]
      }
    })
  ],
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
