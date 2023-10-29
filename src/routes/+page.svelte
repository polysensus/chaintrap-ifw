<script>
  import { onMount, onDestroy, setContext, getContext } from 'svelte';
  import { get, writable, derived } from 'svelte/store';

  import { Navbar, NavBrand, NavUl, NavLi } from 'flowbite-svelte';

  import PagePresence from '$lib/components/presence/PagePresence.svelte';
  import PageGameIconGenerator from '$lib/components/creator/PageGameIconGenerator.svelte';
  import PageMapGenerator from '$lib/components/creator/PageMapGenerator.svelte';
  import PageGameCommands from '$lib/components/PageGameCommands.svelte';
  import PreviewMapCard from '$lib/components/creator/PreviewMapCard.svelte';
  import FurnitureSummaryList from '$lib/components/furniture/FurnitureSummaryList.svelte';
  import FurnishLocationsContextStore from '$lib/components/FurnishLocationsContextStore.svelte';

  import { ChainPresence } from '$lib/chains/presence.js';
  import {
    Guardian, Trialist,
    EventParser, Dispatcher, ArenaEvent,
    gameInstance
  } from '@polysensus/chaintrap-arenastate';

  import {BlobCodex} from '@polysensus/blobcodex';

  import { all } from '$lib/chains/supportedproviders.js';

  import { TrialContent } from '$lib/clientdata/trialcontent.js';

  import { newMapStore } from '$lib/clientdata/storemap.js';
  import { newFurnitureStore } from '$lib/clientdata/storefurnishings.js';
  import { newTrialPosterStore } from '$lib/clientdata/storetrialposter.js';

  import { newOwnerTrials } from '$lib/clientdata/storetrials/owned.js';
  import { newRecentlyCreated } from '$lib/clientdata/storetrials/recent.js';
  import { newActiveTrials } from '$lib/clientdata/storetrials/active.js';

  /**
   * @type {{request:{href?:string,origin?:string}}}
   */
  export let data; // see +page.js:load
  setContext('data', data);

  const presence = new ChainPresence({ networks: all });
  setContext('presence', presence);

  let trialdb;
  /** @type {string|undefined}*/
  let providerButtonText;
  let showFurnishingControl = true;

  /** @type {{connect:Function,subscribe:Function,add:Function}|undefined}*/
  let map = newMapStore();
  setContext('map', map);
  /** @type {{connect:Function,subscribe:Function,add:Function,put:Function}|undefined}*/
  let furnishings = newFurnitureStore();
  setContext('furnishings', furnishings);

  let trialPoster = newTrialPosterStore();
  setContext('trialPoster', trialPoster);

  let arena = writable(undefined);
  setContext('arena', arena);

  let eventParser = derived(arena, ($arena)=> {
    if (!$arena) return undefined;
    return new EventParser($arena, ArenaEvent.fromParsedEvent);
  });
  setContext('eventParser', eventParser);

  const eventDispatcher = derived(eventParser, ($eventParser, set) => {
    if (!$eventParser)  {
      set(undefined);
      return undefined;
    }
    const dispatcher = new Dispatcher($eventParser);
    set(dispatcher);
    return () => dispatcher.stopListening()
  });
  setContext('eventDispatcher', eventDispatcher);

  let guardian = derived(eventDispatcher, ($eventDispatcher) => {
    if (!$eventDispatcher) return undefined;
    return new Guardian($eventDispatcher.parser, {dispatcher:$eventDispatcher})
  });
  setContext('guardian', guardian);

  let trialist = derived(eventDispatcher, ($eventDispatcher) => {
    if (!$eventDispatcher) return undefined;
    return new Trialist($eventDispatcher.parser, {dispatcher:$eventDispatcher})
  });
  setContext('trialist', trialist);

  let ownedGames = newOwnerTrials(eventParser);
  setContext('ownedGames', ownedGames);

  const recentGames = newRecentlyCreated(eventParser);
  setContext('recentGames', recentGames);

  const activeGames = newActiveTrials(guardian, presence);
  setContext('activeGames');

  onMount(async () => {

    trialdb = new TrialContent({name: 'trial_content'});

    await trialdb.create();
    await map.connect(trialdb);
    await furnishings.connect(trialdb);
    await trialPoster.connect(trialdb);

    // force open the create drawer if there are no local maps
    if (!$map)
      showFurnishingControl = false;
  });
  onDestroy(async () => {
    if (trialdb)
      trialdb.close();
    trialdb = undefined;
  })
</script>

<Navbar let:hidden let:toggle>
  <NavBrand href="/">
    <img src="/apple-icon-120x120.png" class="mr-3 h-6 sm:h-9" alt="Polysensus Logo" />
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
      ><a href="https://www.polysensus.com" target="_blank">Polysensus</a></span
    >
  </NavBrand>
  <!--<NavHamburger on:click={toggle} /> -->
  <NavUl {hidden} >
    <!--<NavLi href="/contact"><a href="https://www.polysensus.com" target="_blank" >Contact</a></NavLi> -->
    <NavLi id="providers-toggle" class="cursor-pointer">
      {providerButtonText}<!--<ChevronDownOutline class="w-3 h-3 ml-2 text-primary-800 dark:text-white inline" /> -->
    </NavLi>
    <!--
      onSelect={onProviderSelect},
      onDeselect={onProviderDeselect},
    -->
    <PagePresence bind:providerButtonText={providerButtonText} />
  </NavUl>
</Navbar>

<div>
  <!--
  <Skeleton class="py-4" />
  <ImagePlaceholder class="pb-20" />
  -->
  <p>Found {$ownedGames.length} games for current wallet</p>
  <p>Found {$recentGames.length} games recently created</p>
  <p>There are {$recentGames.length} games currently active</p>
  {#each $ownedGames as gid}
  <p>{gameInstance(gid)}</p>
  {/each}

  <PageGameIconGenerator/>
  {#if $map?.meta?.svg}
    <PreviewMapCard mapImg={$map.meta.svg} mapScale={0.5}/>
  {/if}
  <!--<CreateMapDrawer {onClickGenerate} bind:mapParams bind:hidden={createDrawerClosed} /> -->
  {#if showFurnishingControl}
  <FurnitureSummaryList map={$map} furnishings={$furnishings}/>
  <br/>
  <FurnishLocationsContextStore />
  {:else}
  <PageMapGenerator bind:hidden={showFurnishingControl} />
  {/if}
  <PageGameCommands bind:showMapGenerator={showFurnishingControl}/>
</div>
