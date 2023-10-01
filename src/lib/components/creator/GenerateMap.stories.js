import GenerateMap from '$lib/components/creator/GenerateMap.svelte';

export default {
  component: GenerateMap,
  title: 'creator/GenerateMap',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: GenerateMap,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {};
