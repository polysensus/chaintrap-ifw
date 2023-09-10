import BottomBar from "./BottomBar.svelte";

export default {
  component: BottomBar,
  title: 'bottombar/BottomBar',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: { }
};

/*
export default {
  component: BottomBar,
  title: 'bottombar/BottomBar',
  excludeStores /.*Data$/,
  argTypes: {}
};*/

const Template = ({...args}) => ({
  Component: BottomBar,
  props: args,
  // on: { ...actionData}
});

export const Default = Template.bind({});