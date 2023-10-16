import GenerateGameIconCard from '$lib/components/creator/GenerateGameIconCard.svelte';
import { action } from '@storybook/addon-actions';

export const actionsData = {
  onGenerateGameIcon: action('onGenerateGameIcon')
}

export default {
  component: GenerateGameIconCard,
  title: 'creator/GenerateGameIconCard',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {
    onGenerateGameIcon: { action: 'onGenerateGameIcon'}
  }
};

const Template = ({ ...args }) => ({
  Component: GenerateGameIconCard,
  props: args,
  on: {
    ...actionsData,
  },
});

export const Default = Template.bind({});
Default.args = {};

export const Update = Template.bind({});
Update.args = {
  img: '/static/nft-defaults/game-ico-2.png'
};

