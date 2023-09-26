<script>
// --- lib deps
//import * as PIXI from 'pixi.js'
// --- framework
import { getContext } from 'svelte'
// --- external components
// --- components
import FurnishLocations from './furniture/FurnishLocations.svelte';
// --- app lib
import { getLogger } from '$lib/log.js'
// --- app stores
// --- constants
const log = getLogger('FurnishLocationsContextStore')
// --- data imports
// --- component properties
// --- component state properties
let map = getContext('map');
let furnishings = getContext('furnishings');
// --- svelte bound variables
// let instance = undefined

// --- svelte lifecycle callbacks
// test support hook
// function getPixiApp() { return instance; }
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
async function furnitureDel(furn) {
  console.log(`removing furniture item ${furn.unique_name ?? 'un-named'} from location ${furn?.data?.location ?? 'un-known'}`);
  await furnishings.remove(furn.unique_name)
}
/**
 * 
 * @param {{location:number,exitCounts:number[],furnishings:{unique_name:string,labels:string[],choiceType:string,data:any,meta:any}[]}} selected
 */
async function furnitureAdd(selected) {

  console.log(`adding furniture item at location ${selected.location}`);

  // TODO: want a better way of chosing the furnishing type to add, currently we
  // pick an arbitrary type and then just expect the user to update it.
  // probably make the (+) itself a component, eg CreateNewFurnishing.svelte or something
  await furnishings.add($map, selected.location, {
    labels: ["death_condition"],
    choiceType: "open_chest",
    type: "fatal_chest_trap",
    data: {
      location: selected.location
    },
    meta: { }
  }, {});
}

async function furniturePut(furn) {
  console.log(`updating ${JSON.stringify(furn)}`);
  await furnishings.put(furn);
}

// --- component helpers
</script>
{#if ($map && $furnishings)}
<FurnishLocations
  {furnitureDel}
  {furnitureAdd}
  {furniturePut}
  map={$map} furnishings={$furnishings}/>
{:else}
<p>map or furnishings not available</p>
{/if}
<style>
</style>