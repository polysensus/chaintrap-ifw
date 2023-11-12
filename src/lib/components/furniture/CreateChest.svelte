<script>

// framework imports
import { createEventDispatcher } from 'svelte';

// framework components
import { ButtonGroup, SpeedDial, SpeedDialButton } from 'flowbite-svelte';

// constants
const dispatch = createEventDispatcher();

// component props
export let chestTypes = [];
export let chestType = chestTypes[0]?.type ?? '';

// --- component state properties
let open = false;

</script>

<ButtonGroup outline>
<SpeedDial outline bind:open defaultClass="flex" pill={false} tooltip="none" name="">
  <div slot="icon">
    {chestType}
  </div>
  {#each chestTypes as chest, i}
    <SpeedDialButton
      btnDefaultClass='w-full h-full shadow-sm !p-2'
      on:click={() => {open = false; chestType = chest.type; dispatch('validSelection', chest)}} name={chest.type}/>
  {/each}
</SpeedDial>
</ButtonGroup>
<style>
</style>