import CreateChest from '$lib/components/furniture/CreateChest.svelte';
import {chestTypes} from '$lib/trialsetup/chests.js'

export default {
  component: CreateChest,
  title: 'furniture/CreateChest',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: CreateChest,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  chestTypes
};
