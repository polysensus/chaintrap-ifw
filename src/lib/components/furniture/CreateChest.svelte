<script>
import { onMount } from 'svelte';
import { ButtonGroup, SpeedDial, SpeedDialButton } from 'flowbite-svelte';
import { getLogger } from '$lib/log.js'

const log = getLogger('CreateChest')

/** @type {{chestTypes:string[],chestType:string}|undefined}*/
export let props;

/**
 * 
 * @param {{type:string,choiceType:string,labels:string[],data?:object}} value
 */
export let validSelection = async (value) => {}

// --- component state properties
let open = false;
/** @type {string[]|undefined}*/
let chestTypes = [];
/** @type {string|undefined}*/
let chestType = '';

$: chestTypes = props?.chestTypes;
$: chestType = props?.chestType;

/**
 * @param {{type:string,choiceType:string,labels:string[]}} typeInfo 
 */
function onClickChestType(typeInfo) {
  chestType = typeInfo.type;
  if (validSelection)
    validSelection(typeInfo)
}
onMount(async () =>{
  if (chestType) {
    for (const chest of chestTypes)
      if (chest.type === chestType) {
        validSelection(chest);
        return
      }
  }
  if (chestTypes.length)
    await validSelection(chestTypes[0]);
})
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