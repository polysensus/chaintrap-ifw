<script>
  import {
    Input,
    Label,
  } from "flowbite-svelte";

  /** @type string*/
  export let id;
  /** @type string*/
  export let label;
  /** @type number */
  export let value=0;
  /** @type string*/
  export let placeholder="0.0";
  /** @type string*/
  export let labelClass="mb-2";
</script>
<div>
 <Label for={id} class={labelClass}>{label}</Label>
 <Input type="number" id={id} placeholder={placeholder} required bind:value={value}/>
</div>