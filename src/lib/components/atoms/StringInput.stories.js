import StringInput from '$lib/components/atoms/StringInput.svelte';

export default {
  component: StringInput,
  title: 'atoms/StringInput',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: StringInput,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  // Note: we need the /static prefix here, but it should be ommited from svelte rendered pages
  id: 'a_string',
  label: 'A String',
  value: undefined
};
