<script>
  // --- lib deps
  // --- external components
  import { twMerge } from 'tailwind-merge';
  import * as Icon from "svelte-heros-v2";
  // --- components
  import NumberInput from '$lib/components/atoms/NumberInput.svelte';
  import StringInput from '$lib/components/atoms/StringInput.svelte';
  // --- app lib
  // import { getLogger } from '$lib/log.js'
  // --- app stores
  // --- constants
  // const log = getLogger('CreateMap')
  // --- data imports
  // --- component properties
  export let params = {};
  export let onClickGenerate = ({}) => {};
  export let passwordPrompt = false;

  export let hidden = false;
  export let btnClass="btn variant-ghost w-48 justify-between";
  export let generateBtnClass="btn variant-ghost-success w-48 justify-between";
  export let closeBtnClass="btn-icon variant-ghost";
  export let showCloseButton=false;
  /** @type {string|undefined}*/
  export let headlineText=undefined;

  $: {
    params = {
      ...params,
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
      password
    };
  }

  // --- component state properties
  let reverse = false;
  let horizontal = true;
  let imgClass = '';
  $: imgClass = twMerge(
    'offset1',
    // reverse ? 'rounded-b-lg' : 'rounded-t-lg',
    horizontal && 'object-cover h-96 w-full'
    // horizontal && (reverse ? 'md:rounded-r-lg' : 'md:rounded-l-lg')
  );
  let innerPadding = 'max-w-lg'; // md
  // --- svelte bound variables
  let arena_size = 2048;
  let rooms = 12;
  let tile_snap_size = 4.0;
  let room_szmax = 1024.0;
  let room_szmin = 512.0;
  let room_szratio = 1.8;
  let min_separation_factor = 1.7;
  let corridor_redundancy = 15.0;
  let main_room_thresh = 0.8;
  let tan_fudge = 0.0001;
  let model = 'tinykeep';
  /** @type string|null*/
  let password = null; // null is save in clear
  
  export let edditingGuidance = false;

  // let instance = undefined
  // --- svelte lifecycle callbacks
  // test support hook
  // function getPixiApp() { return instance; }
  // onMount(async () => {})
  // --- on dom event callbacks
  // --- contract state callbacks
  // --- component helpers
</script>

{#if !hidden}
<div class="flex justify-center">
<div class='max-w-lg'>
  {#if showCloseButton}
  <button class={closeBtnClass} on:click={() => (hidden = true)}><Icon.XMark/></button>
  {/if}
  {#if headlineText}
  <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
    Create a dungeon
  </h5>
  {/if}
  <p class="mb-3 text-gray-700 dark:text-gray-400 leading-tight">
    Adjust these to influence how the dungeon is generated
  </p>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
  </div>
  <button class={btnClass} color="alternative" on:click={() => {edditingGuidance = !!!edditingGuidance}}>{edditingGuidance ? "Hide Inputs" : "Adjust Inputs"}</button>
  <p class='italic break-all'>arena_size={arena_size},rooms={rooms},tile_snap_size={tile_snap_size},room_szmax={room_szmax},room_szmin={room_szmin},room_szratio={room_szratio},min_separation_factor={min_separation_factor},corridor_redundancy={corridor_redundancy},main_room_thresh={main_room_thresh}</p>
  {#if edditingGuidance}
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <NumberInput id="arena_size" label="Arena size" bind:value={arena_size} />
    <NumberInput id="rooms" label="Rooms" bind:value={rooms} />
    <NumberInput id="tile_snap_size" label="Tile snap" bind:value={tile_snap_size} />
    <NumberInput id="room_szmax" label="Room szmax" bind:value={room_szmax} />
    <NumberInput id="room_szmin" label="Room szmin" bind:value={room_szmin} />
    <NumberInput id="room_szratio" label="Room szratio" bind:value={room_szratio} />
    <NumberInput
      id="min_separation_factor"
      label="Separation"
      bind:value={min_separation_factor}
    />
    <NumberInput id="corridor_redundancy" label="Redundancy" bind:value={corridor_redundancy} />
    <NumberInput id="main_room_thresh" label="Main threshold" bind:value={main_room_thresh} />
    <NumberInput id="tan_fudge" label="Tan fudge" bind:value={tan_fudge} />
    <StringInput id="model" label="Model" bind:value={model} readonly={true} />
  </div>
  {/if}
  <div class="grid gap-6 mb-6 md:grid-cols-1">
    {#if passwordPrompt}
    <StringInput
      id="chaintrap_map_password"
      label="Set a password to encrypt your map"
      bind:value={password}
      placeholder="Your password"
    />
    {/if}
  </div>
  <button class={generateBtnClass} on:click={() => onClickGenerate({ ...params })}>Generate</button>
</div>
</div>
{/if}