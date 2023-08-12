<script>
  import { Input, Label } from 'flowbite-svelte';

  /** @type string*/
  export let id;
  /** @type string*/
  export let label;
  /** @type string*/
  export let placeholder = 'enter a string';
  /** @type string*/
  export let labelClass = 'mb-2';

  /** @type string|undefined*/
  export let value = undefined;

  /** @type boolean*/
  export let readonly = false;
</script>

<div>
  <Label for={id} class={labelClass}>{label}</Label>
  {#if !readonly}
    <Input type="text" {id} {placeholder} required bind:value />
  {:else}
    <Input type="text" {id} {placeholder} readonly bind:value />
  {/if}
</div>
