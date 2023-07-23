<Button color="blue" on:click={onClick} class="p-2 {width}" outline={false}>
  {#if text}
  <div class="p-2">{text}</div>
  {/if}
  <div class="p-2">
   <Icon.ArrowRightOnRectangle size="20"></Icon.ArrowRightOnRectangle>
  </div> 
</Button>

<script>
import * as Icon from 'svelte-heros-v2';
import { Button } from 'flowbite-svelte';

/**
 * @type string
 */
export let text="";
export let width="w-30";

/**
 * @type function
*/
export let onClick=() => {};

</script>
<style>
</style>