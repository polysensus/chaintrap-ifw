<script>
// --- lib deps
//import * as PIXI from 'pixi.js'
// --- framework
import { onMount, setContext, getContext, onDestroy } from 'svelte'
// --- external components
import { Button, Badge  } from 'flowbite-svelte';
import { CloseOutline, PlusOutline  } from 'flowbite-svelte-icons';
// --- components
import FurnishLocationsPager from './FurnishLocationsPager.svelte';
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
let btnColorAdd = 'red';
let btnColorDel = 'light';

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

  // deal with degenerate cases.
  if (rooms.length < pageSize) {
    pageStart = 0;
    pageEnd = rooms.length === 0 ? 0 : rooms.length - 1;
  } else if (pageStart < 0) {
    pageStart = 0;
    pageEnd = pageSize;
  } else if (pageEnd >= rooms.length) {
    pageEnd = rooms.length === 0 ? 0 : rooms.length - 1;
    pageStart = pageEnd - pageSize;
  }

  if (typeof selection === 'undefined')
    selection =  pageStart;

  selected = {
    location: selection,
    exitCounts: map?.model?.rooms[selection]?.corridors?.map((exits)=>exits?.length ?? 0),
    furnishings: (furnishings?? []).filter((item) => {
      console.log(`considering furnishing for selection ${item.map.beta} ${selection}`);
      if (item.map.beta !== map?.vrf_inputs?.proof?.beta)
        return false;
      return item?.data?.location === selection
    })
  }
  console.log(`updated: #furnishings ${selected.furnishings.length} for location ${selection}`);
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
let previous = () => {

  // leave it to the reactive block to clip the range
  pageStart -= pageSize;
  pageEnd = pageStart + pageSize;
}

let next = () => {
  // leave it to the reactive block to clip the range
  pageEnd += pageSize;
  pageStart += pageSize;
}

</script>
{#if selected}
  <div class="flex justify-center mb-2">
    <Badge border color="none">Map {map.name}</Badge>
    <Badge border color="none">Location {selection}</Badge>
  </div>
  {#if selected?.furnishings?.length > 0}
  {#each (selected.furnishings) as furn, i}
  <div class="flex justify-center space-x-4 mb-1">
  {#if i===0}
  <Button on:click={async () => await furnitureAdd(selected)} color={btnColorAdd} outline pill class="!p-2"><PlusOutline class="w-2 h-2"></PlusOutline></Button>
  {/if}
  <CreateFurnishing {furniturePut} selectedChoiceType={furn.choiceType} exitCounts={selected.exitCounts} furnishing={furn}></CreateFurnishing>
  <Button on:click={async () => await furnitureDel(furn)} color={btnColorDel} outline pill class="!p-2"><CloseOutline class="w-2 h-2"></CloseOutline></Button>
  </div>
  {/each}
  {:else}
  <div class="flex justify-center space-x-4">
  <Button on:click={async () => await furnitureAdd(selected)} color={btnColorAdd} outline pill class="!p-2"><PlusOutline class="w-2 h-2"></PlusOutline></Button>
  <p>Click to add a furnishing</p>
  </div>
  {/if}
{/if}
<div class="mt-2">
<FurnishLocationsPager {next} {previous} {select} subject={'rooms'} pages={rooms?.slice(pageStart, pageEnd)} total={rooms.length}/>
</div>
<style>
</style>