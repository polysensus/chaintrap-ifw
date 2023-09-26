import FurnitureSummaryList from '$lib/components/furniture/FurnitureSummaryList.svelte';

export default {
  component: FurnitureSummaryList,
  title: 'furniture/FurnitureSummaryList',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: FurnitureSummaryList,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  furnishings: [
    {
      type: 'fatal_chest_trap',
      data: {
        location:0
      }
    },
    {
      type: 'chest_treat_gain_life',
      data: {
        location:0
      }
    },
    {
      type: 'chest_treat_gain_life',
      data: {
        location:3
      }
    }
  ]
};


