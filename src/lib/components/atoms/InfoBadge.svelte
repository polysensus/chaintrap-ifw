<script>
  import { Badge } from 'flowbite-svelte';

  // @type boolean
  export let selected = false;
  // @type string
  export let selectedColor = 'primary';
  // @type string
  export let offColor = 'dark';
</script>

{#if selected}
  <Badge border color={selectedColor}><slot /></Badge>
{:else}
  <Badge border color={offColor}><slot /></Badge>
{/if}
