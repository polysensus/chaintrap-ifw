<script>
// --- lib deps
// --- framework
// --- external components
import { ButtonGroup, SpeedDial, SpeedDialButton } from 'flowbite-svelte';
// --- components
import CreateChest from './CreateChest.svelte';
import CreateVictoryExit from './CreateVictoryExit.svelte';
// --- app lib
import {getLogger} from '$lib/log.js'
import {chestTypes} from '$lib/trialsetup/chests.js'
// --- app stores
// --- constants
const log = getLogger('CreateFurniture')
// --- data imports
// --- component properties

export let exitCounts = [0, 0, 0, 0];
export let furnishing = {};
/** @type {Function|undefined} */
export let furniturePut = undefined;

let furnitureComponents = [
  {
    choiceType: "open_chest",
    component: CreateChest,
    props: {
      chestTypes,
    },
  },
  {
    choiceType: "finish_exit",
    component: CreateVictoryExit,
    props: {
      exitCounts,
    },
  }
];

export let selectedChoiceType = furnitureComponents[0].choiceType;
let selected = {
  furnitureType: furnitureComponents[0],
  props: { }
}

$:{
  for (const c of furnitureComponents) {
    if (c.choiceType !== selectedChoiceType)
      continue

    selected.furnitureType = c;
    selected.props = {
      ...c.props,
    }
    switch (selected.furnitureType.choiceType) {
      case "open_chest": {
        selected.props.chestType = furnishing.type ?? chestTypes?.[0].type
        break;
      }
    }
    break;
  }
}

// --- component state properties

let open = false;

// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks

/**
 * @param {{type:string,choiceType:string,labels:string[]}} item 
 */
function onClickFurnitureType(type) {
  selectedChoiceType = type;
}

/**
 * 
 * @param {{type:string,choiceType:string,labels:string[],data?:object}} selection
 */
async function validSelection(typeInfo) {
  console.log(`--- validSelection: ${typeInfo.type}`);
  if (!furniturePut)
    return;

  let unique_name = furnishing.unique_name;
  if (typeInfo.type === "finish_exit")
    unique_name = "finish_exit";

  let data = {location:furnishing.data.location, ...typeInfo.data}
  const update = {
    unique_name,
    map:furnishing.map,
    meta:furnishing.meta,
    ...typeInfo, data
  }
  await furniturePut(update);
}

// --- component helpers
</script>

<ButtonGroup>
<SpeedDial bind:open defaultClass="flex" pill={false} tooltip="none">
  <div slot="icon">
    {selectedChoiceType ?? 'undefined'}
  </div>
  {#each furnitureComponents as furn, i}
    <SpeedDialButton  btnDefaultClass='w-full h-full shadow-sm !p-2' on:click={()=>onClickFurnitureType(furn.choiceType)} name={furn.choiceType}> </SpeedDialButton>
  {/each}
</SpeedDial>
</ButtonGroup>
{#if selected?.furnitureType?.component}
  <svelte:component this={selected.furnitureType.component} {validSelection} {...selected.props}/>
{/if}
<style>
</style>