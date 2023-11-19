<script>
  import {ethers} from 'ethers';
  import { onMount, setContext, getContext } from "svelte";
  import { derived } from "svelte/store";
  import { Trial, CODEX_INDEXED_ITEMS } from "@polysensus/chaintrap-arenastate";
  import { BlobCodex } from '@polysensus/blobcodex';
  import PreviewMapCard from '$lib/components/creator/PreviewMapCard.svelte';
  import PageGameCommands from '$lib/components/PageGameCommands.svelte';
  import {createGuardianCommands} from '$lib/console/gamecommandsets.js';

  import {
    Guardian, Trialist,
    EventParser, Dispatcher, ArenaEvent,
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

  let guardian = derived(eventDispatcher, ($eventDispatcher) => {
    if (!$eventDispatcher) return undefined;
    return new Guardian($eventDispatcher.parser, {dispatcher:$eventDispatcher})
  });
  setContext('guardian', guardian);

  let codex;
  let trial;
  /** @type {ethers.BigNumber|undefined}*/
  let gid;
  /** @type {string|undefined}*/
  let trialImg;

  onMount(async () => {

    console.log(`page data: ${Object.keys(data?.page)}`);

    const metadata = data?.page?.metadata;

    gid = data?.page?.gid;
    // XXX: TODO the blob passwords are going to need to be plumbed in
    codex = await BlobCodex.hydrate(
      metadata?.properties?.trialsetup?.serialized, [null], CODEX_INDEXED_ITEMS);
    trial = Trial.fromCodex(codex, gid, {ikey:0});
    trialImg = trial?.svg?.content;
  });

</script>

{#if gid}
<p>{gid.toHexString()}</p>
{/if}
{#if trialImg}
  <PreviewMapCard mapImg={trialImg} mapScale={1.0}/>
{/if}
{#if gid}
<PageGameCommands commands={createGuardianCommands({gid})}/>
{/if}
