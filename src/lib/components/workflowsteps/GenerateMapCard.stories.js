import GenerateMapCard from '$lib/components/workflowsteps/GenerateMapCard.svelte';

export default {
  component: GenerateMapCard,
  title: 'workflowsteps/GenerateMapCard',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: GenerateMapCard,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {};
