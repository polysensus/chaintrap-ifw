<script>
  export let hidden = false; // bind this to get the close state
  export let btnClass = "btn-icon variant-ghost";
  import { XMark } from "svelte-heros-v2";
</script>
<button class={btnClass} on:click={() => (hidden = true)}><XMark/></button>