<script>
  import { createEventDispatcher } from 'svelte';
  // import { Paginator } from '@skeletonlabs/skeleton';
  import Paginator from '$lib/components/pagination/Paginator.svelte';

  export let room = 0;
  export let limit = 1; // forcing limit to 1 is how we get page:room 1:1
  /** @type {{name:number,corridors:number[][], inter:boolean}[]|undefined}} */
  export let source = [];
  export let showFirstLastButtons = false;
  export let showPreviousNextButtons = true;
  export let showNumerals = true;
  export let maxNumerals = 1;

  let settings = {
    page: room,
    limit,
    size: source.length,
    amounts: [] // disables the amounts button
  };

  /** @type {{name:number,corridors:number[][], inter:boolean}[]|undefined}} */
  let paged = []
  $:{
    paged = source.slice(
      settings.page * settings.limit,
      settings.page * settings.limit + settings.limit
    )
    room = settings.page;
  }

  // --- event dispatch and handling
  // const dispatch = createEventDispatcher();
  // function onPage(event) {
  //   console.log(`FurnishLocationsPager2# onPage: ${a.detail}`);
  // }

  // $: {
  //   settings.page = page;
  //   settings.limit = limit;
  // }
</script>
<Paginator
  on:amount
  on:page
  bind:settings={settings}
  {showFirstLastButtons}
  {showPreviousNextButtons}
  {showNumerals}
  {maxNumerals}/>
<!--
  because we set limit to 1, there will always be exactly one row
<ul>
  {#each paged as row}
    <li>{row}</li>
  {/each}
</ul>
-->