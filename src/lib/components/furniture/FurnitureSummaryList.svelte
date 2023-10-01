<script>
// --- framework
import { twMerge } from 'tailwind-merge';
// --- external components
import { Badge, Listgroup, ListgroupItem } from 'flowbite-svelte';
import { HeartOutline, ThumbsDownOutline, SunOutline } from 'flowbite-svelte-icons';
// --- components
// --- app lib
// --- constants
// --- data imports
// --- component properties
/** @type {{map:{name:string,beta:string},items:{unique_name?:string,labels:string[],type:string,data:{location:number},meta:any}[]}|undefined}*/
export let furnishings=undefined;
export let map=undefined;

let locations=[];
let types=[];

$: {
  const collateTypes = {}
  const collate = {}
  for (const furn of (furnishings ?? [])) {

    console.log(`furn beta ${furn.map.beta} map ${map?.vrf_inputs?.proof?.beta}`);
    if (furn.map.beta !== map?.vrf_inputs?.proof?.beta)
      continue;

    const loc = collate[furn.data.location] ?? {};
    const locType = loc[furn.type] ?? {};
    locType.count = (locType?.count ?? 0) + 1;
    switch (furn.type) {
      case 'fatal_chest_trap': {
        locType.icon = ThumbsDownOutline;
        break;
      }
      case 'chest_treat_gain_life': {
        locType.icon = HeartOutline;
        break;
      }
      case 'finish_exit': {
        locType.icon = SunOutline
        break;
      }
    }
    loc[furn.type] = locType;
    loc.location = furn.data.location;
    collate[furn.data.location] = loc;
    collateTypes[furn.type] = true;
  }
  locations = Object.values(collate);
  types = Object.keys(collateTypes);
}

// --- component state properties
// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// function getPixiApp() { return instance; }
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers
</script>
{#if locations?.length}
<div class="flex justify-center">
<Listgroup active class="w-96">
{#each locations as loc}
<ListgroupItem class="flex justify-center text-base font-semibold gap-2">
  <Badge>Location {loc.location}</Badge>
  {#each types as type}
  {#if (loc[type]?.icon && loc[type]?.count)}
  <svelte:component this={loc[type].icon}/>
  <p>{loc[type].count}</p>
  {/if}
  {/each}
</ListgroupItem>
{/each}
</Listgroup>
</div>
{/if}
<style>
</style>