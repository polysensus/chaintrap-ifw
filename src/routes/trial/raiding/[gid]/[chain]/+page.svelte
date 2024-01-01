<script>
  import { onMount, setContext, getContext } from "svelte";
  import { derived } from "svelte/store";
  import { Trial, CODEX_INDEXED_ITEMS, ABIName } from "@polysensus/chaintrap-arenastate";

  import { BlobCodex } from '@polysensus/blobcodex';

  import TrialistAvatarStatusBadge from '$lib/components/avatars/TrialistAvatarStatusBadge.svelte';
  import TrialistChoiceEntryCard from "$lib/components/trials/TrialistChoiceEntryCard.svelte";
  import SceneChoices from "$lib/components/trials/SceneChoices.svelte";

  import PreviewMapCard from '$lib/components/creator/PreviewMapCard.svelte';
  import PageGameCommands from '$lib/components/PageGameCommands.svelte';
  import {createTrialistCommands} from '$lib/console/gamecommandsets.js';
  import { newEventDispatcher } from '$lib/clientdata/storetrials/eventdispatcher.js';
  import { newEventParser } from '$lib/clientdata/storetrials/eventparser.js';
  import { newTrialistJournal } from '$lib/clientdata/storetrials/trialistjournal.js';
  import { newFeed } from '$lib/clientdata/storetrials/gamefeed.js';
  import { newChoiceContext } from "$lib/clientdata/storetrials/choicecontext.js";
  import { newChoiceFeed } from "$lib/clientdata/storetrials/choicefeed.js";


  /**
   * @type {{request:{href?:string,origin?:string}}}
   */
  export let data; // see +page.js:load
  setContext('data', data);

  let gid;

  // --- stores for participation
  const arena = getContext('arena');

  let eventParser = newEventParser(arena);
  setContext('eventParser', eventParser);

  const eventDispatcher = newEventDispatcher(eventParser);
  setContext('eventDispatcher', eventDispatcher);
  
  const trialist = newTrialistJournal(eventDispatcher, handleUpdate);
  setContext('trialist', trialist);

  trialist.subscribe(async ($trialist) => {
    console.log(`processing trialist change: ${gid}`);
    if (!gid) return;
    if (!$trialist) return;
    await $trialist.startListening(gid);

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


  /** @type{Object.<string,object>} */

  const feedLIFO = false;
  const choiceFeedLIFO = false;

  $: feed = newFeed($trialist?.journal, gid, {limit:undefined, lifo:feedLIFO});

  let walletAddress = getContext('walletAddress');

  $: trialFeeds = newChoiceFeed(feed, walletAddress, {feedLIFO, lifo:true});
  $: trialistEntries = $trialFeeds?.trialists;

  let activeRaider;
  $: {
    const len = trialistEntries?.[$walletAddress]?.length;
    if (len)
      activeRaider = trialistEntries[$walletAddress][len - 1];
  }
  $: finalEntry = $trialFeeds?.victoryEntry;
  $: uriEntry = $trialFeeds?.uriEntry;
  $: metadataURI = uriEntry?.arenaEvent?.parsedLog?.args[0];

  async function handleUpdate(updatedGid, eid, key, arenaEvent, state) {
    await feed.handleEvent(updatedGid, eid, key, arenaEvent, state);
  }

  let codex;
  let trial;
  let trialImg;

  onMount(async () => {

    console.log(`page data: ${Object.keys(data?.page)}`);

    const metadata = data?.page?.metadata;

    gid = data?.page?.gid;
    console.log(`hex gid: ${gid.toHexString()}`);

    // XXX: TODO the blob passwords are going to need to be plumbed in.
    // We want to allow for:
    // 1. fully encrypted dungeons, both the map and the furnishings are invisible to the trialist
    // 2. partially encrypted, the map is visible but the furnishings remain secret.

    codex = await BlobCodex.hydrate(
      metadata?.properties?.trialsetup?.serialized, [null], CODEX_INDEXED_ITEMS);
    trial = Trial.fromCodex(codex, gid, {ikey:0});
    trialImg = trial?.svg?.content;
  });

</script>
<!--
<p> num feed entries {Object.keys(feed).length}</p>
<p> current entry {JSON.stringify($choiceContext)}</p>
-->
<div class="w-full grid grid-cols-1 gap-10">
<div class="h-full grid grid-rows-[1fr_auto] gap-1">
  {#if gid}
  <SceneChoices {gid} entry={activeRaider} finalEntry={finalEntry} metadataURI={metadataURI} />
  {/if}
	<div class="bg-surface-500/30 p-4">
  {#if gid}
  <PageGameCommands commands={createTrialistCommands({gid})}/>
  {/if}

  </div>

	<div class="bg-surface-500/30 p-4 overflow-y-auto">

    <section class="max-h-[500px] p-4 overflow-y-auto space-y-4">
      {#if $trialFeeds?.trial}
      {#each $trialFeeds?.trial as entry}
        {#if entry?.eid !== finalEntry?.eid}
        {#if ($walletAddress && entry?.address === $walletAddress)}
          <div class="grid grid-cols-[auto_1fr] gap-2">
            {#if (entry?.state?.nickname && entry.address)}
            <TrialistAvatarStatusBadge nickname={entry?.state?.nickname} address={entry.address}/>
            {/if}
            <TrialistChoiceEntryCard {entry} active={true}/>
          </div>
        {:else}
          <div class="grid grid-cols-[1fr_auto] gap-2">
            <TrialistChoiceEntryCard {entry}/>
            <!-- <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" /> -->
            {#if (entry?.state?.nickname && entry.address)}
            <TrialistAvatarStatusBadge nickname={entry?.state?.nickname} address={entry.address}/>
            {/if}
          </div>
        {/if}
        {/if}
      {/each}
      {/if}
    </section>

  </div>
</div>
</div>
<br/>
{#if trialImg}
  <PreviewMapCard mapImg={trialImg} mapScale={1.0}/>
{/if}
