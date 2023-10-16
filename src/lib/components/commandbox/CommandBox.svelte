<script>
  import CompleteLine from '$lib/components/commandbox/CompleteLine.svelte';
  import {snippetCompletion} from "@codemirror/autocomplete";
  let classes = "border-2 rounded-md";
  export {classes as class };

  let completions = [
    snippetCompletion(
      'create game for \{${count}\} players',
        {label: "create game", type: "keyword", custom: "xxx"}),
    snippetCompletion(
      'select game \{${number}\}',
        {label: "select game", type: "keyword"}),
    snippetCompletion(
      'join game as \{${nickname}\}',
        {label: "join game", type: "keyword"}),
    snippetCompletion(
      'start game',
        {label: "start game", type: "keyword"}),

    snippetCompletion(
      'use exit \{${number}\} on the ${side}',
        {label: "use exit", type: "keyword"}),

    snippetCompletion(
      'open chest \{${number}\}',
        {label: "open chest", type: "keyword"})

  ]
</script>

<CompleteLine class={classes} on:onChange on:onNewline on:onPick {completions}></CompleteLine>