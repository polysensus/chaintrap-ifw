import CreateFurnishing from '$lib/components/furniture/CreateFurnishing.svelte';

export default {
  component: CreateFurnishing,
  title: 'furniture/CreateFurnishing',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: CreateFurnishing,
  props: args
});

export const Default = Template.bind({});
Default.args = {
  exitCounts: [2, 0, 3, 0]
};
