<script>
  import * as Icon from 'svelte-heros-v2';
  import { Button } from 'flowbite-svelte';

  /**
   * @type string
   */
  export let text = '';
  export let width = 'w-30';

  /**
   * @type function
   */
  export let onClick = () => {};

  // --- component state properties
</script>

<Button on:click={onClick} class="p-2 {width}" outline={true}>
  {#if text}
    <div class="p-2">{text}</div>
  {/if}
  <div class="p-2">
    <Icon.Signal size="20" />
  </div>
</Button>

<style>
</style>
