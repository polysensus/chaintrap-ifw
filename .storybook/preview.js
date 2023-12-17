/** @type { import('@storybook/svelte').Preview } */

import '../src/app.postcss';
import '../node_modules/tailwindcss/tailwind.css';

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
};

export default preview;
