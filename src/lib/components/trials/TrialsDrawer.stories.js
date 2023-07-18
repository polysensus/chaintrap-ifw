import TrialsDrawer from './TrialsDrawer.svelte';
import { trials2Basic } from './test.data.trials.js';

export default {
  component: TrialsDrawer,
  title: 'trials/TrialsDrawer',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {
  },
};

const Template = ({ ...args }) => ({
  Component: TrialsDrawer,
  props: args,
  // on: {
  //   ...actionsData,
  // },
});


export const Default = Template.bind({});
Default.args = {
  hidden: false,
  trials: trials2Basic,
}
