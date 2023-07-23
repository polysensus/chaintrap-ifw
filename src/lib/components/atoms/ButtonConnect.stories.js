import ButtonConnect from './ButtonConnect.svelte';

export default {
  component: ButtonConnect,
  title: 'atoms/ButtonConnect',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {
  },
};

const Template = ({ ...args }) => ({
  Component: ButtonConnect,
  props: args,
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  text: ""
};

