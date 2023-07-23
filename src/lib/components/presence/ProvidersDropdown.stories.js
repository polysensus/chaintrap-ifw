import ProvidersDropdown from '$lib/components/presence/ProvidersDropdown.svelte';
import { providers } from "./test.data.providers.js";

export default {
  component: ProvidersDropdown,
  title: 'providers/ProvidersDropdown',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {
  },
};

const Template = ({ ...args }) => ({
  Component: ProvidersDropdown,
  props: args,
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  providers,
  selected: providers[0].name
};

