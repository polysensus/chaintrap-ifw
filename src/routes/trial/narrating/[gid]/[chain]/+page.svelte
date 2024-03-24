<script>
  import {ethers} from 'ethers';
  import { onMount, setContext, getContext, onDestroy } from "svelte";
  import { derived } from "svelte/store";
  import { Trial, CODEX_INDEXED_ITEMS } from "@polysensus/chaintrap-arenastate";
  import { BlobCodex } from '@polysensus/blobcodex';
  import PreviewMapCard from '$lib/components/creator/PreviewMapCard.svelte';
  import PageGameCommands from '$lib/components/PageGameCommands.svelte';
  import TrialistAvatarButton from '$lib/components/avatars/TrialilstAvatarButton.svelte';
  import {createGuardianCommands} from '$lib/console/gamecommandsets.js';
  import { newEventDispatcher } from '$lib/clientdata/storetrials/eventdispatcher.js';
  import { newEventParser } from '$lib/clientdata/storetrials/eventparser.js';
  import { newGuardianJournal } from '$lib/clientdata/storetrials/guardianjournal.js';
  import { newFeed } from '$lib/clientdata/storetrials/gamefeed.js';
  import { newRegistrations } from '$lib/clientdata/storetrials/gameregistrations.js';
  import { newStarted } from '$lib/clientdata/storetrials/gamestarted.js';

  /**
   * @type {{request:{href?:string,origin?:string}}}
   */
  export let data; // see +page.js:load
  setContext('data', data);

  // --- stores for participation
  const arena = getContext('arena');

  const eventParser = newEventParser(arena);
  setContext('eventParser', eventParser);

  const eventDispatcher = newEventDispatcher(eventParser);
  setContext('eventDispatcher', eventDispatcher);

  const guardian = newGuardianJournal(eventDispatcher, handleUpdate)
  setContext('guardian', guardian);

  /** @type {ethers.BigNumber|undefined}*/
  let gid;

  let feed;
  $: feed = newFeed($guardian?.journal, gid, {limit:undefined, lifo:false})

  let registrations;
  $: registrations = newRegistrations(feed);
  
  let started;
  $: started = newStarted(feed);

  let codex;
  $: {
    if (data?.page?.metadata)
      BlobCodex.hydrate(
        data.page.metadata?.properties?.trialsetup?.serialized, [null], CODEX_INDEXED_ITEMS)
        .then(result=>codex=result)
  }
  let trial;
  $: {
    if (gid && codex) {
      console.log(`*** Trial.fromCodex reactive ${gid?.toHexString()}`);
      trial = Trial.fromCodex(codex, gid, {ikey:0});
      trialImg = trial?.svg?.content;
    }
  }

  $: {
    if (trial && trial.gid && $guardian) {
      console.log(`guardian/[gid]/[chain]# trialStartListening ${trial?.gid?.toHexString()}`)
      $guardian.trialStartListening(trial);
    }
  }
  /** @type {string|undefined}*/
  let trialImg;

  async function handleUpdate(gid, eid, key, arenaEvent, state) {
    await feed.handleEvent(gid, eid, key, arenaEvent, state);
  }

  onMount(async () => {

    console.log(`page data: ${Object.keys(data?.page)}`);

    const metadata = data?.page?.metadata;

    gid = data?.page?.gid;
    // XXX: TODO the blob passwords are going to need to be plumbed in
    codex = await BlobCodex.hydrate(
      metadata?.properties?.trialsetup?.serialized, [null], CODEX_INDEXED_ITEMS);
    trial = Trial.fromCodex(codex, gid, {ikey:0});
    console.log(`*** Trial.fromCodex onMount ${gid?.toHexString()} ${trial.gid}`);
    trialImg = trial?.svg?.content;
  });

  onDestroy(async () => {
    if ($guardian && gid)
      $guardian.stopListening(gid);
  })

</script>
{#if $feed?.length > 0}
  <div class="flex justify-center">
    {#each $registrations as entry, i}
    <TrialistAvatarButton startIndex={i} nickname={entry.state.nickname} address={entry.address}/>
    {/each}
  </div>
  <div class="flex justify-center">
    <p>The game is {(!$started) ? "not" : ""} started</p>
    <p>{gid.toHexString()}</p>
  </div>
{/if}
{#if gid}
<PageGameCommands commands={createGuardianCommands({gid})}/>
{/if}
{#if trialImg}
  <PreviewMapCard mapImg={trialImg} mapScale={1.0}/>
{/if}
