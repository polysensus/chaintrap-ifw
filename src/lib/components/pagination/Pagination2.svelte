<script>
  import { Paginator } from '@skeletonlabs/skeleton';

  export let page = 0;
  export let limit = 5;
  /** @type {{name:number,corridors:number[][], inter:boolean}[]|undefined}} */
  export let source = [];
  export let showFirstLastButtons = false;
  export let showPreviousNextButtons = true;
  export let showNumerals = false;
  export let maxNumerals = 1;

  let settings = {
    page,
    limit,
    size: source.length,
    amounts: [1, 2, 5, 10],
  };

  /** @type object[]*/
  let paged = []
  $:{
    paged = source.slice(
      settings.page * settings.limit,
      settings.page * settings.limit + settings.limit
    )
  }

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

<ul>
  {#each paged as row}
    <li>{row}</li>
  {/each}
</ul>