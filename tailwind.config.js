import { join } from 'path'

import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import forms from '@tailwindcss/forms';
/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {},
	},
	plugins: [
    // twFormsPlug(),
    forms,
		typography,
		skeleton({
			themes: {
				preset: [
					{
						name: 'vintage',
						enhancements: true,
					},
				],
			},
		}),
	],
};
