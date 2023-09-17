import { vitePreprocess } from '@sveltejs/kit/vite';
// import adapter from '@sveltejs/adapter-auto';
// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
// vercel is our only production target

import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter()
  },
  preprocess: [vitePreprocess({})]
};

export default config;
