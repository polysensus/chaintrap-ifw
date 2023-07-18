import {ethers} from "ethers";
import TrialsTable from './TrialsTable.svelte';

export default {
  component: TrialsTable,
  title: 'trials/TrialTable',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {
  },
};

const Template = ({ ...args }) => ({
  Component: TrialsTable,
  props: args,
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  viewName: "The view",
  trials: [
    { // chaintrap-arenastate/trialsetup.js:TrialSetup defines this format
      gid: ethers.BigNumber.from(1),
      tokenUri: 'ipfs://xxx/yyy',
      codex: {},
      metadata: {
        // chaintrap-arenastate/erc1155metadata/gamecreator.js:configureMetadataOptions defines this format
        name: "game one",
        description: "The first game of chaintrap",
        image: "ipfs://zzz/bbb"
      }
    }, {
      gid: ethers.BigNumber.from(2),
      codex: {},
      tokenUri: 'ipfs://12345aaa/yyy',
      metadata: {
        // chaintrap-arenastate/erc1155metadata/gamecreator.js:configureMetadataOptions defines this format
        name: "game two",
        description: "The first game of chaintrap",
        image: "ipfs://zzz/bbb"
      }
    }],
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