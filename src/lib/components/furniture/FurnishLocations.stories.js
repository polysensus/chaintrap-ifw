import FurnishLocations from '$lib/components/furniture/FurnishLocations.svelte';
import {map02} from "../../../../static/content/maps/map02.js";
import {furnishings} from "../../../../static/content/maps/map02-furnishings.js";

export default {
  component: FurnishLocations,
  title: 'furniture/FurnishLocations',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {}
};

const Template = ({ ...args }) => ({
  Component: FurnishLocations,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  map:map02,
  furnishings:furnishings.items,
  pageStart: 0,
  selection: 0
  // pageStart:5,
  // selection: 8
};

/** crappy issues with storybook x babel config make it impossible to use import assertions */