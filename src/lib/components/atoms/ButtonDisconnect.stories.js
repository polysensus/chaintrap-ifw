import ButtonDisconnect from './ButtonDisconnect.svelte';

export default {
  component: ButtonDisconnect,
  title: 'atoms/ButtonDisconnect',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: ButtonDisconnect,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  text: ''
};
