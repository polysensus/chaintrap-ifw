import PasswordInput from '$lib/components/atoms/PasswordInput.svelte';

export default {
  component: PasswordInput,
  title: 'atoms/PasswordInput',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: PasswordInput,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  // Note: we need the /static prefix here, but it should be ommited from svelte rendered pages
  id: 'a_password',
  label: 'Password',
  value: undefined
};
