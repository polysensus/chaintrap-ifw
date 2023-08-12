import TrialsCard from './TrialsCard.svelte';
import { trials2Basic } from './test.data.trials';

export default {
  component: TrialsCard,
  title: 'trials/TrialsCard',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: TrialsCard,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  viewName: 'The view',
  trials: trials2Basic,
  selected: {
    gid: trials2Basic[0].gid
  }
};
