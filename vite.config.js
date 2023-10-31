import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vitest/config';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import { configDefaults } from "vitest/config";

import { nodePolyfills } from 'vite-plugin-node-polyfills';
// // only needed for npm run dev as it uses esbuild rather than rollup
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

import path from 'path';

export default defineConfig({
  plugins: [
    sveltekit(),
    purgeCss(),
    nodePolyfills({
      // globals: {
      // 	global: true,
      // 	Buffer: 'dev'
      // },
      protocolImports: true
    })
  ],
  // esbuild: {
  //   plugins: [NodeGlobalsPolyfillPlugin({buffer:true}), NodeModulesPolyfillPlugin()]
  // },

  test: {
    exclude: [...configDefaults.exclude, "tests/**", "src/**/*.mocha.js"],
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
  // https://medium.com/@ftaioli/using-node-js-builtin-modules-with-vite-6194737c2cd2
  // for resolve, optimizeDeps, build.rollupOptions
  resolve: {
    alias: {
      $assets: path.resolve('./static'),
      $api: path.resolve('/src/routes/api'),
      // Errors like,
      //  RollupError: "Buffer" is not exported by "__vite-browser-external"
      // can be resolved by adding the appropriate polyfill alias here
      // process: 'rollup-plugin-node-pollyfills/polyfills/process-es6',
      // buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6' OK but this package is sort of abandoned
      // path: 'rollup-plugin-polyfill-node/dist/polyfills.js',
      // buffer: 'rollup-plugin-polyfill-node/dist/polyfills.js'
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      assert: 'assert',
      ethers: 'ethers'
    }
  },
  optimizeDeps: {
    include: [],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: []
    }
  },
  server: {
    port: 3000,
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())]
    },
    cors: {
      origin: [
        'http://localhost:3000', 'http://localhost', 'http:127.0.0.1',
        'https://hoy.polysensus.io',
        'https://chains.hoy.polysensus.io',
        'https://chaintrap.hoy.polysensus.io'
      ],
      methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
    },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      external: [
        // It seems that the external prevents un-necessary bundling of node js
        // only things which are needed for cli utilities. But anything that is
        // actually used can't be listed here, or rather can only be listed if
        // some other mysterious bit of config is also adjusted. Typical error
        // when externing something that is used:
        // .  TypeError: The specifier “@polysensus/blobcodex” was a bare specifier, but was not remapped to anything. Relative module specifiers must start with “./”, “../” or “/”.
        // "ethers",
        "commander",
        // "@msgpack/msgpack",
        "@eth-optimism/sdk",
        // "@openzeppelin/merkle-tree",
        // "nft.storage",
        // "@polysensus/blobcodex",
        // "@polysensus/chaintrap-contracts",
        "@polysensus/diamond-deploy",
        "ethereum-cryptography"
      ],
      plugins: []
    }
  }
});
