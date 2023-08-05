<script>
// --- lib deps
// --- external components
import {
  Button,
  Card,
} from "flowbite-svelte";
import { twMerge } from 'tailwind-merge';
// --- components
import NumberInput from '$lib/components/atoms/NumberInput.svelte';
import StringInput from '$lib/components/atoms/StringInput.svelte';
import PasswordInput from '$lib/components/atoms/PasswordInput.svelte';
// --- app lib
// import { getLogger } from '$lib/log.js'
// --- app stores
// --- constants
// const log = getLogger('CreateMap')
// --- data imports
// --- component properties
export let params = {};

$: {
  params = {...params,
    arena_size,
    rooms,
    tile_snap_size,
    room_szmax,
    room_szmin,
    room_szratio,
    min_separation_factor,
    corridor_redundancy,
    main_room_thresh,
    tan_fudge,
    model,
    password,
  }
}

// --- component state properties
let reverse = false;
let horizontal = true;
let imgClass = "";
$: imgClass = twMerge(
    'offset1',
    // reverse ? 'rounded-b-lg' : 'rounded-t-lg',
    horizontal && 'object-cover h-96 w-full',
    // horizontal && (reverse ? 'md:rounded-r-lg' : 'md:rounded-l-lg')
  );
let innerPadding = "max-w-lg"; // md 
// --- svelte bound variables
let arena_size=2048;
let rooms=12;
let tile_snap_size=4.0;
let room_szmax = 1024.0;
let room_szmin = 512.0;
let room_szratio = 1.8;
let min_separation_factor = 1.7;
let corridor_redundancy = 15.0;
let main_room_thresh = 0.8;
let tan_fudge = 0.0001;
let model="tinykeep";
/** @type string|null*/
let password=null; // null is save in clear

// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// function getPixiApp() { return instance; }
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers

</script>
<div class="card">
  <Card href="/" horizontal {reverse} >
    <div class={innerPadding}>
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Generation Parameters</h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
      Adjust these to influence how the dungeon is generated
    </p>
    <form>
      <div class="grid gap-6 mb-6 md:grid-cols-2">
        <NumberInput id="arena_size" label="Arena size" bind:value={arena_size}/>
        <NumberInput id="rooms" label="Rooms" bind:value={rooms}/>
        <NumberInput id="tile_snap_size" label="Tile snap" bind:value={tile_snap_size}/>
        <NumberInput id="room_szmax" label="Room szmax" bind:value={room_szmax}/>
        <NumberInput id="room_szmin" label="Room szmin" bind:value={room_szmin}/>
        <NumberInput id="room_szratio" label="Room szratio" bind:value={room_szratio}/>
        <NumberInput id="min_separation_factor" label="Separation" bind:value={min_separation_factor}/>
        <NumberInput id="corridor_redundancy" label="Redundancy" bind:value={corridor_redundancy}/>
        <NumberInput id="main_room_thresh" label="Main threshold" bind:value={main_room_thresh}/>
        <NumberInput id="tan_fudge" label="Tan fudge" bind:value={tan_fudge}/>
        <StringInput id="model" label="Model" bind:value={model} readonly={true}/>
      </div>
      <div class="grid gap-6 mb-6 md:grid-cols-1">
      <PasswordInput id="chaintrap_map_password" label="Set a password to encrypt your map" bind:value={password} placeholder="Your password"/>
      <Button type="submit">Generate</Button>
      </div>
    </form>
    </div>
  </Card>
</div>