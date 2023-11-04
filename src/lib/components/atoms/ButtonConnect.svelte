<script>
  import * as Icon from 'svelte-heros-v2';

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

<button on:click={onClick} class="p-2 {width} variant-ringed">
  {#if text}
    <div class="p-2">{text}</div>
  {/if}
  <div class="p-2">
    <Icon.Signal size="20" />
  </div>
</button>

<style>
</style>
