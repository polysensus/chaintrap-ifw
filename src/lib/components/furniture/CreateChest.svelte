<script>
import { ButtonGroup, SpeedDial, SpeedDialButton } from 'flowbite-svelte';
import { getLogger } from '$lib/log.js'

const log = getLogger('CreateChest')

export let chestTypes = [];
export let chestType = chestTypes[0]?.type ?? '';

/**
 * 
 * @param {{type:string,choiceType:string,labels:string[],data?:object}} value
 */
export let validSelection = async (value) => {}

// --- component state properties
let open = false;

/**
 * @param {{type:string,choiceType:string,labels:string[]}} typeInfo 
 */
function onClickChestType(typeInfo) {
  chestType = typeInfo.type;
  if (validSelection)
    validSelection(typeInfo)
}
// --- component helpers
</script>

<ButtonGroup outline>
<SpeedDial outline bind:open defaultClass="flex" pill={false} tooltip="none" name="">
  <div slot="icon">
    {chestType}
  </div>
  {#each chestTypes as chest, i}
    <SpeedDialButton  btnDefaultClass='w-full h-full shadow-sm !p-2' on:click={async ()=>await onClickChestType(chest)} name={chest.type}> </SpeedDialButton>
  {/each}
</SpeedDial>
</ButtonGroup>
<style>
</style>