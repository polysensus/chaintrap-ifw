
import { action } from '@storybook/addon-actions';
import ProvidersList from '$lib/components/presence/ProvidersList.svelte';
import { providers } from './test.data.providers.js';

export const actionsData = {
  providerSelected: action('providerSelected')
}


export default {
  component: ProvidersList,
  title: 'providers/ProvidersList',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {
    providerSelected: {action: 'providerSelected'}
  }
};

const Template = ({ ...args }) => ({
  Component: ProvidersList,
  props: args
  // on: {
  //   ...actionsData,
  // },
});

export const Default = Template.bind({});
Default.args = {
  providers,
  selected: providers[0].name
};
