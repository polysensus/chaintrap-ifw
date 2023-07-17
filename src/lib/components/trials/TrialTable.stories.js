import {ethers} from "ethers";
import TrialTable from './TrialTable.svelte';

export default {
  component: TrialTable,
  title: 'trials/TrialTable',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {
  },
};

const Template = ({ ...args }) => ({
  Component: TrialTable,
  props: args,
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  viewName: "The view",
  trials: [{gid: ethers.BigNumber.from(1)}, {gid: ethers.BigNumber.from(2)}],
  selected: {
    gid: ethers.BigNumber.from(1),
  },
};

/*
export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
}*/