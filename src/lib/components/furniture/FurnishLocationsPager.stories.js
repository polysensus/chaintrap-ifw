import FurnishLocationsPager from '$lib/components/furniture/FurnishLocationsPager.svelte';

export default {
  component: FurnishLocationsPager,
  title: 'furniture/FurnishLocationsPager',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: FurnishLocationsPager,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  subject: 'Locations',
  pages: [{name:5}, {name:6}, {name:7}],
  total: 16
};
