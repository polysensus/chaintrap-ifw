<script>
// --- lib deps
//import * as PIXI from 'pixi.js'
// --- framework
import { onMount, setContext, getContext, onDestroy } from 'svelte'
// --- external components
import * as Icon from "svelte-heros-v2";
// --- components
import Badge from '$lib/components/atoms/Badge.svelte';
import ButtonIcon from '$lib/components/atoms/ButtonIcon.svelte';
import ButtonIconAdd from '$lib/components/atoms/ButtonIconAdd.svelte';
import FurnishLocationsPager2 from './FurnishLocationsPager2.svelte';
import CreateFurnishing from './CreateFurnishing.svelte';
// --- app lib
import { getLogger } from '$lib/log.js'
// --- app stores
// --- constants
const log = getLogger('FurnishRooms');
const pageSize = 5;

// --- data imports
// --- component properties
// --- component state properties

export let select = (room) => {selection = room.name}
/** @type {number|undefined}*/
export let selection = undefined;

/** @type {{model:{rooms:{corridors:number[][], inter:boolean}[]}}|undefined} */
export let map=undefined;

/** @type {{map:{name:string,beta:string},items:{unique_name?:string,labels:string[],type:string,data:any,meta:any}[]}|undefined}*/
export let furnishings=undefined;

export let pageStart = 0;
export let pageEnd = pageStart + pageSize;

export let furnitureDel = async function (furn) {
  console.log(`override this method to implement removal of furniture item`);
}

export let furnitureAdd = async function (location) {
  console.log(`override this method to implement addition of a furniture item.`);
}
export let furniturePut  = async function (location) {
  console.log(`override this method to implement update of a furniture item.`);
}

/** @type {{name:number,corridors:number[][], inter:boolean}[]|undefined}} */
let rooms = [];
let selected = undefined;

$: {
  const updated = [];
  for (let i=0; i<(map?.model?.rooms.length ?? 0); i++) {
    if (map?.model.rooms[i].inter)
      continue;

    // the .name property indexes the original model.rooms array
    const location = {...map?.model.rooms[i], name: i};
    updated.push(location)
  }
  rooms = updated;

  if (typeof selection === 'undefined')
    selection =  0;

  selected = {
    location: selection,
    exitCounts: map?.model?.rooms[selection]?.corridors?.map((exits)=>exits?.length ?? 0),
    furnishings: (furnishings?? []).filter((item) => {
      // console.log(`considering furnishing for selection ${item.map.beta} ${selection}`);
      if (item.map.beta !== map?.vrf_inputs?.proof?.beta)
        return false;
      return item?.data?.location === selection
    })
  }
  // console.log(`updated: #furnishings ${selected.furnishings.length} for location ${selection}`);
  // console.log(`updated: #rooms ${rooms.length}`);
}

// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// function getPixiApp() { return instance; }
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers

function onPage(a) {
  console.log(`FurnishLocations# onPage: ${a.detail}`);
}

</script>
<div class="mt-2">
  <div class="flex justify-center mb-2">
    <FurnishLocationsPager2 on:page={onPage} source={rooms} bind:room={selection}/>
  </div>
{#if selected}
  <div class="flex justify-center mb-2">
    <Badge>Map {map.name}</Badge>
    <Badge>Location {selection}</Badge>
  </div>
  {#if selected?.furnishings?.length > 0}
  {#each (selected.furnishings) as furn, i}
  <div class="flex justify-center space-x-4 mb-1">
  {#if i===0}
  <ButtonIconAdd on:click={async () => await furnitureAdd(selected)}><Icon.Plus variation='outline'/></ButtonIconAdd>
  {/if}
  <CreateFurnishing {furniturePut} selectedChoiceType={furn.choiceType} exitCounts={selected.exitCounts} furnishing={furn}></CreateFurnishing>
  <ButtonIcon on:click={async () => await furnitureDel(furn)}><Icon.XMark variation='outline'/></ButtonIcon>
  </div>
  {/each}
  {:else}
  <div class="flex justify-center space-x-4">
  <ButtonIconAdd on:click={async () => await furnitureAdd(selected)}><Icon.Plus variation='outline'/></ButtonIconAdd>
  <p class="text-gray-700 dark:text-gray-400">Click to add a furnishing</p>
  </div>
  {/if}
{/if}
</div>
<style>
</style>