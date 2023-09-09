import CommandBox from "./CommandBox.svelte";

export default {
  component: CommandBox,
  title: 'commandbox/CommmandBox',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: { }
};

const Template = ({ ...args }) => ({
  Component: CommandBox,
  props: args,
  // on: { ...actionsData },
});

export const Default = Template.bind({});
Default.args = { };
