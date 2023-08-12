import { loadConfigFromFile, mergeConfig } from 'vite';
import path from 'path';

// import { sveltekit } from '@sveltejs/kit/vite'
// import { nodePolyfills } from 'vite-plugin-node-polyfills';
// import { fileURLToPath } from 'url';
// const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type { import('@storybook/sveltekit').StorybookConfig } */
const config = {
  logLevel: 'debug',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  core: {
    disableTelemetry: true
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling',
      options: {
        // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
        // For more details on this addon's options.
        // postCss: true
      }
    },
    '@storybook/addon-mdx-gfm'
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },

  async viteFinal(config, { configType }) {
    const { config: userConfig } = await loadConfigFromFile(
      path.resolve(__dirname, '../vite.config.js')
    );

    return mergeConfig(config, {
      ...userConfig,
      // manually specify plugins to avoid conflict
      plugins: [
        // sveltekit({ hot: !process.env.VITEST }),
        // nodePolyfills({protocolImports: true}),
      ]
    });
  }
};
export default config;
