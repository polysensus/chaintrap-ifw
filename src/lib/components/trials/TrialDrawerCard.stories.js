import TrialDrawerCard from './TrialDrawerCard.svelte';

export default {
  component: TrialDrawerCard,
  title: 'trials/TrialDrawerCard',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: TrialDrawerCard,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {};
