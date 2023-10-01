import CreateVictoryFurnishing from '$lib/components/furniture/CreateVictoryExit.svelte';

export default {
  component: CreateVictoryFurnishing,
  title: 'furniture/CreateVictoryFurnishing',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: CreateVictoryFurnishing,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  exitCounts: [0, 1, 0, 2]
};
