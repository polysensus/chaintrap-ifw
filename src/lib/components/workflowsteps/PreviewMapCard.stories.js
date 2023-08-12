import PreviewMapCard from '$lib/components/workflowsteps/PreviewMapCard.svelte';

export default {
  component: PreviewMapCard,
  title: 'workflowsteps/PreviewMapCard',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: PreviewMapCard,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  mapImg: '/static/content/maps/map.svg'
};
