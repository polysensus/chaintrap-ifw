<script>
  import CompleteLine from '$lib/components/commandbox/CompleteLine.svelte';
  export let completions=[];
  let classes = "border-2 rounded-md";
  export {classes as class };

</script>

<CompleteLine class={classes} on:onChange on:onNewline on:onPick {completions}></CompleteLine>