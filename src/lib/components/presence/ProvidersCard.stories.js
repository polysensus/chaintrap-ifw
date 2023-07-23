import ProvidersCard from './ProvidersCard.svelte';
import { providers } from "./test.data.providers.js";

export default {
  component: ProvidersCard,
  title: 'providers/ProvidersCard',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {
  },
};

const Template = ({ ...args }) => ({
  Component: ProvidersCard,
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

