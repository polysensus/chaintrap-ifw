import CreateMapDrawer from './CreateMapDrawer.svelte';

export default {
  component: CreateMapDrawer,
  title: 'creator/CreateMapDrawer',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: CreateMapDrawer,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  hidden: false
};
