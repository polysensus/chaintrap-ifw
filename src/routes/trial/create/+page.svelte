<script>
  // framework imports
  import { localStorageStore } from '@skeletonlabs/skeleton';
  import { onMount, onDestroy, setContext, getContext } from 'svelte';
  import { derived } from 'svelte/store';

  // framework components

  // application components
  import TrialCreateStepper from '$lib/components/trials/TrialCreateStepper.svelte';

  // application imports
  import { TrialContent } from '$lib/clientdata/trialcontent.js';
  import {
    Guardian, Trialist,
    EventParser, Dispatcher, ArenaEvent
  } from '@polysensus/chaintrap-arenastate';

  // -- dungeon creation local state stores
  import { newMapStore } from '$lib/clientdata/storemap.js';
  import { newFurnitureStore } from '$lib/clientdata/storefurnishings.js';
  import { newTrialPosterStore } from '$lib/clientdata/storetrialposter.js';

  import { newRecentlyCreated } from '$lib/clientdata/storetrials/recent.js';
  import { newActiveTrials } from '$lib/clientdata/storetrials/active.js';

  // --- constants
  
  // contexts
  /**
   * @type {{request:{href?:string,origin?:string}}}
   */
  export let data; // see +page.js:load
  setContext('data', data);

  let pageState = localStorageStore('root:', {trialCreationStep:0});
  let trialCreationStep = $pageState?.trialCreationStep ?? 0;

  $: pageState.set({trialCreationStep: trialCreationStep !== 0 ? trialCreationStep - 1 : 0});

  // --- stores for dungeon creation
  /** @type {{connect:Function,subscribe:Function,add:Function}|undefined}*/
  let map = newMapStore();
  setContext('map', map);
  /** @type {{connect:Function,subscribe:Function,add:Function,put:Function}|undefined}*/
  let furnishings = newFurnitureStore();
  setContext('furnishings', furnishings);

  let trialPoster = newTrialPosterStore();
  setContext('trialPoster', trialPoster);

  // --- stores for participation
  const arena = getContext('arena');

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

  // let ownedGames = newOwnerTrials(eventParser);
  // setContext('ownedGames', ownedGames);

  const recentGames = newRecentlyCreated(eventParser);
  setContext('recentGames', recentGames);

  const presence = getContext('presence');

  const activeGames = newActiveTrials(guardian, presence);
  setContext('activeGames');


  // state vars

  let trialdb;

  onMount(async () => {

    trialdb = new TrialContent({name: 'trial_content'});

    await trialdb.create();
    await map.connect(trialdb);
    await furnishings.connect(trialdb);
    await trialPoster.connect(trialdb);
  });
  onDestroy(async () => {
    if (trialdb)
      trialdb.close();
    trialdb = undefined;
    pageState.set({trialCreationStep: trialCreationStep !== 0 ? trialCreationStep - 1 : 0});
  });

</script>
<div class="container h-full mx-auto flex justify-center">
	<div class="space-y-2 text-center flex flex-col">
    <!-- <h2 class="h2">Welcome to Chaintrap.</h2> -->
    <TrialCreateStepper bind:step={trialCreationStep}/>
	</div>
</div>