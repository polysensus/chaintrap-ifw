import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { searchForWorkspaceRoot } from 'vite';
import path from 'path'

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	resolve: {
		alias: {
      $assets: path.resolve('./static'),
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
