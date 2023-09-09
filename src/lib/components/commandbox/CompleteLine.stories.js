import CompleteLine from './CompleteLine.svelte';
import {snippetCompletion} from "@codemirror/autocomplete";

import { action } from '@storybook/addon-actions';

export const actionsData = {
  onChange: action('onChange'),
  onPick: action('onPick'),
  onNewline: action('onNewline'),
}

export default {
  component: CompleteLine,
  title: 'commandbox/CompleteLine',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {
    onChange: {action: 'onChange'},
    onPick: {action: 'onPick'},
    onNewline: {action: 'onNewline'}
  }
};

const Template = ({ onChange, onPick, onNewline, ...args }) => ({
  Component: CompleteLine,
  props: args,
  on: {
    ...actionsData,
  },
});

export const Default = Template.bind({});
Default.args = {
  completions: [
    snippetCompletion(
      'create game for \{${count}\} players',
        {label: "create game", type: "keyword", custom: "xxx"}),
    snippetCompletion(
      'select game ${number}',
        {label: "select game", type: "keyword"}),
    snippetCompletion(
      'join game as ${nickname}',
        {label: "join game", type: "keyword"}),
    snippetCompletion(
      'start game',
        {label: "start game", type: "keyword"}),

    snippetCompletion(
      'use exit ${number} on the ${side}',
        {label: "use exit", type: "keyword"}),

    snippetCompletion(
      'open chest ${number}',
        {label: "open chest", type: "keyword"})
  ]
};
