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
  <label for={id} class={labelClass}><span>{label}</span></label>
  {#if !readonly}
    <input type="text" {id} {placeholder} required {value} />
  {:else}
    <input type="text" {id} {placeholder} readonly {value} />
  {/if}
</div>
