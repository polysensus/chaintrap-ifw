import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { searchForWorkspaceRoot } from 'vite';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

import path from 'path'

export default defineConfig({
	build: {
    rollupOptions: {
        plugins: [
            // Enable rollup polyfills plugin
            // used during production bundling
            rollupNodePolyFill()
        ]
    }
	},
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

	// https://medium.com/@ftaioli/using-node-js-builtin-modules-with-vite-6194737c2cd2
	// for resolve, optimizeDeps, build.rollupOptions
	resolve: {
		alias: {
      $assets: path.resolve('./static'),
			// Errors like,
			//  RollupError: "Buffer" is not exported by "__vite-browser-external"
			// can be resolved by adding the appropriate polyfill alias here
			// process: 'rollup-plugin-node-pollyfills/polyfills/process-es6',
			// buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6' OK but this package is sort of abandoned
			path: 'rollup-plugin-polyfill-node/dist/polyfills.js',
			buffer: 'rollup-plugin-polyfill-node/dist/polyfills.js'
		}
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis'
			},
      // Enable esbuild polyfill plugins
      plugins: [
          NodeGlobalsPolyfillPlugin({
              process: true,
              buffer: true
          }),
          NodeModulesPolyfillPlugin()
      ]
		}
	},
	server: {
		fs: {
			allow: [
				searchForWorkspaceRoot(process.cwd())
			]
		}
	}
});
