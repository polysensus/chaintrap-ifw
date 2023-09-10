import CreateMap from '$lib/components/creator/CreateMap.svelte';

export default {
  component: CreateMap,
  title: 'creator/CreateMap',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: CreateMap,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  // Note: we need the /static prefix here, but it should be ommited from svelte rendered pages
  mapImg: '/static/content/maps/map.svg'
};
