import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { searchForWorkspaceRoot } from 'vite';

import { nodePolyfills } from 'vite-plugin-node-polyfills';

import path from 'path'

export default defineConfig({
	plugins: [sveltekit(), nodePolyfills({protocolImports: true})],
	test: {
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
		}
	},
	optimizeDeps: {
  	include: ['ethers', '@web3auth/modal'],
		esbuildOptions: {
			define: {
				global: 'globalThis'
			}
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
