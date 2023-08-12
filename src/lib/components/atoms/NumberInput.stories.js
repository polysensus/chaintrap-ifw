import NumberInput from '$lib/components/atoms/NumberInput.svelte';

export default {
  component: NumberInput,
  title: 'atoms/NumberInput',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: NumberInput,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  // Note: we need the /static prefix here, but it should be ommited from svelte rendered pages
  id: 'a_number',
  label: 'A Number'
};
