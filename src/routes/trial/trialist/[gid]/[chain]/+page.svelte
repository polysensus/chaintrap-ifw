<script>
  import {ethers} from 'ethers';
  import { writable } from 'svelte/store';
  import { onMount, setContext, getContext } from "svelte";
  import { derived } from "svelte/store";
  import { Trial, CODEX_INDEXED_ITEMS } from "@polysensus/chaintrap-arenastate";
  import { BlobCodex } from '@polysensus/blobcodex';

  import { Avatar, CodeBlock, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

  import PreviewMapCard from '$lib/components/creator/PreviewMapCard.svelte';
  import PageGameCommands from '$lib/components/PageGameCommands.svelte';
  import {createTrialistCommands} from '$lib/console/gamecommandsets.js';

  import {
    Trialist, EventParser, Dispatcher, ArenaEvent,
    // gameInstance
  } from '@polysensus/chaintrap-arenastate';

  /**
   * @type {{request:{href?:string,origin?:string}}}
   */
  export let data; // see +page.js:load
  setContext('data', data);

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

  let maxFeed = 5;
  /** @type{Object.<string,object>} */
  let feed = {};

  let trialist = undefined;
  let currentEntry = writable(undefined);

  let codex;
  let trial;
  let gid;
  let trialImg;

  let messageFeed = [
	{
		id: 0,
		host: true,
		avatar: 48,
		name: 'Jane',
		timestamp: 'Yesterday @ 2:30pm',
		message: 'Some message text.',
		color: 'variant-soft-primary'
	},
	{
		id: 1,
		host: false,
		avatar: 14,
		name: 'Michael',
		timestamp: 'Yesterday @ 2:45pm',
		message: 'Some message text.',
		color: 'variant-soft-primary'
	}
];

  function orderedFeed() {
    const ordered =  Object.keys(feed)
      .map((v) => Number(v))
      .sort((a, b) => a - b)
    // have the highest first, those are the newest
    ordered.reverse();
    return ordered;
  }
  
  trialist = derived(eventDispatcher, ($eventDispatcher) => {
    if (!$eventDispatcher) return undefined;
    return new Trialist($eventDispatcher.parser, {
      dispatcher:$eventDispatcher, updated:handleTrialistUpdate})
  });
  setContext('trialist', trialist);

  trialist.subscribe(async ($trialist) => {
    console.log(`processing trialist change: ${gid}`);
    if (!gid) return;
    $trialist?.startListening(gid);

    /*
    const user = await eventParser?.contract?.signer?.getAddress();
    const gidHex = gid.toHexString();
    console.log(` transcripts: ${Object.keys($trialist?.journal?.transcripts)}`);
    const t = $trialist?.journal?.transcripts[gidHex];
    if (!t) return;
    const state = t.trialist[user];
    if (!state) {
      console.log(`attemmpting initFeed, state not found for user; ${user}`);
      return;
    }
    console.log('initialising feed');
    await initFeed(state, user);*/
  });

  /**
   * 
   * @param {import('@polysensus/chaintrap-arenastate').TrialistState} trialistState
   * @param {import('@polysensus/chaintrap-arenastate').ArenaEvent} arenaEvent
   */
  function entryFromState(trialistState, eid) {
      const entry = {
        state:{...trialistState.state, nickname:trialistState.state.profile?.nickname},
      }
      if (eid) {
        entry.eid = eid;
        entry.delta = trialistState.entryDelta({eid});
      }
      return entry;
  }

  async function handleTrialistUpdate(updatedGid, eid, key, arenaEvent) {

    console.log(`${gid?.toHexString()} ${key} ${eid}`);
    if (!trialist || !gid || !gid.eq(updatedGid)) return;

    const gidHex = updatedGid.toHexString();

    if (eid && feed[eid]) return;

    const user = await $eventParser?.contract?.signer?.getAddress();
    if (arenaEvent.subject != user) return;

    // build the new entry
    const t = $trialist.journal.transcripts[gidHex];
    const state = t.trialists[user];
    if (!state) {
      console.log(`state not found for user; ${user}, have ${Object.keys(t.trialists)}`);
      return;
    }
    const entry = entryFromState(state, eid);
    entry.address = arenaEvent.subject;

    // prune older entries
    if (Object.keys(feed).length > maxFeed - 1) {
      const ordered = orderedFeed();
      const n = ordered.length - (maxFeed -1);
      for (let i=0; i< n; i++)
        delete feed[ordered[ordered.length - i]];
    }
    // Add the new entry
    if (eid)
      feed[eid] = entry;
    $currentEntry = entry;
    console.log(`set entry ${JSON.stringify(entry)}`);
    console.log(`set entry ${JSON.stringify($currentEntry)}`);
  }


  onMount(async () => {

    console.log(`page data: ${Object.keys(data?.page)}`);

    const metadata = data?.page?.metadata;

    gid = data?.page?.gid;
    console.log(`hex gid: ${gid.toHexString()}`);

    // XXX: TODO the blob passwords are going to need to be plumbed in.
    // We want to allow for:
    // 1. fully encrypted dungeons, both the map and the furnishings are invisible to the trialist
    // 2. partially encypted, the map is visible but the furnishings remain secret.

    codex = await BlobCodex.hydrate(
      metadata?.properties?.trialsetup?.serialized, [null], CODEX_INDEXED_ITEMS);
    trial = Trial.fromCodex(codex, gid, {ikey:0});
    trialImg = trial?.svg?.content;
  });

</script>

{#if gid}
<p>{gid.toHexString()}</p>
{/if}
<div class="w-full grid grid-cols-2 gap-10">
<div class="h-full grid grid-rows-[auto_1fr_auto] gap-1">
	<div class="bg-surface-500/30 p-4">(search)</div>
	<div class="bg-surface-500/30 p-4">(list)</div>
	<div class="bg-surface-500/30 p-4">(footer)</div>
</div>
<div class="h-full grid grid-rows-[1fr_auto] gap-1">
	<div class="bg-surface-500/30 p-4 overflow-y-auto">

    <section class="max-h-[500px] p-4 overflow-y-auto space-y-4">
      {#each messageFeed.slice(0, 2) as bubble}
        {#if bubble.host === true}
          <div class="grid grid-cols-[auto_1fr] gap-2">
            <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" />
            <div class="card p-4 variant-soft rounded-tl-none space-y-2">
              <header class="flex justify-between items-center">
                <p class="font-bold">{bubble.name}</p>
                <small class="opacity-50">{bubble.timestamp}</small>
              </header>
              <p>{bubble.message}</p>
            </div>
          </div>
        {:else}
          <div class="grid grid-cols-[1fr_auto] gap-2">
            <div class="card p-4 rounded-tr-none space-y-2 {bubble.color}">
              <header class="flex justify-between items-center">
                <p class="font-bold">{bubble.name}</p>
                <small class="opacity-50">{bubble.timestamp}</small>
              </header>
              <p>{bubble.message}</p>
            </div>
            <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" />
          </div>
        {/if}
      {/each}
    </section>

  </div>
      <div class="grid grid-cols-[1fr_auto] gap-2">
        <div class="card p-4 rounded-tr-none space-y-2">
          <header class="flex justify-between items-center">
            <p class="font-bold">Scene Choices</p>
            <small class="opacity-50">eid</small>
          </header>
          <p>pending choices</p>
        </div>
      </div>

	<div class="bg-surface-500/30 p-4">
  {#if gid}
  <PageGameCommands commands={createTrialistCommands({gid})}/>
  {/if}

  </div>
</div>
</div>
<br/>
{#if trialImg}
  <PreviewMapCard mapImg={trialImg} mapScale={1.0}/>
{/if}
<p> num feed entries {Object.keys(feed).length}</p>
<p> current entry {JSON.stringify($currentEntry)}</p>