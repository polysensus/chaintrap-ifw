<script>

  import {
    EventParser, ArenaEvent,
    gameInstance
  } from '@polysensus/chaintrap-arenastate';

  // framework imports
  import { onMount, getContext, tick } from 'svelte';
  import { get, writable, derived } from 'svelte/store';

  import {ImageGeneratorOpenAI} from '$lib/generative/gameicon.js';

  // framework components

  // application components

  import { Stepper, Step } from '@skeletonlabs/skeleton';
  import { ProgressRadial } from '@skeletonlabs/skeleton';

  // import PageGameIconGenerator from '$lib/components/creator/PageGameIconGenerator.svelte';
  import GenerateGameIconCard from '$lib/components/creator/GenerateGameIconCard.svelte';
  import PreviewMapCard from '$lib/components/creator/PreviewMapCard.svelte';
  import PageMapGenerator from '$lib/components/creator/PageMapGenerator.svelte';
  import FurnishLocationsContextStore from '$lib/components/FurnishLocationsContextStore.svelte';
  import FurnitureSummaryList from '$lib/components/furniture/FurnitureSummaryList.svelte';
  import { CreateGameCommandCtx } from '$lib/commandcontexts/creategame.js';

  import { findOwnedGames } from '$lib/chaintrap.js';

  const ownedGamesHistory = 5;

  /** @type {number|undefined}*/
  export let step = 0;

  // contexts
  const presence = getContext('presence');
  const arena = getContext('arena');
  const data = getContext('data');
  const guardian = getContext('guardian');
  const map = getContext("map");
  const furnishings = getContext('furnishings');
  const trialPoster = getContext('trialPoster');

  let eventParser = derived(arena, ($arena)=> {
    if (!$arena) return undefined;
    return new EventParser($arena, ArenaEvent.fromParsedEvent);
  });

  // ---
  let ownedEntries = [];
  $: refreshOwnedEntries($eventParser);

  /** @type {ImageGeneratorOpenAI} */
  let imageGenerator;
  let connected = false;
  let trialDescription = "This is my dungeon, there are many like it, but this one is mine.";
  let trialMaxParticipants = 2;
  let createGameCmd = new CreateGameCommandCtx({fetch});
  let trialCreating = false;
  let trialDetails;

  // --- display state
  let showPreview = false;
  $: showPreview = (step && (step >= 1) && (step <= 3)) ? true : false;

  let showPoster = false;
  $: showPoster = (step == 0) ? true : false;

  /** @type {string} */
  let trialPosterImg;
  $:{
    if ($trialPoster)
      trialPosterImg = $trialPoster?.meta?.imgHeader + $trialPoster.base64;
  }

  let chain = undefined;
  $: chain = presence?.providerSwitch?.getCurrent()?.cfg?.name;
  $: connected = chain !== undefined ? true : false;

  let stepperClass="h-500";
  let stepClass=""
  // let stepContentClass="min-h-full"
  let stepContentClass="min-h-[50%]"

  // -- event handling
  /** @param {{detail:{state:object, step:number}}} e*/
  function onStepHandler(e) {
    step = e?.detail?.state?.current + 1;
    console.log(`TrialCreateStepper# step: ${step}`)
  }

  async function onCompleteHandler() {
    console.log(`TrialCreateStepper# complete`);
    if (trialCreating)
      return;
    trialCreating = true;
    await tick();
    try {
      let name = "A chaintrap trial"
      if ($map.name)
        name = `A trial in map "${$map.name}"`;
      trialDetails = await createGameCmd.run(name, trialDescription, trialMaxParticipants);
      await refreshOwnedEntries($eventParser);
    } catch (err) {
      console.log(`TrialCreateStepper# complete: ${err}`);
    } finally {
      trialCreating = false;
    }
  }

  /**
   * @param {{detail:{prompt?:string}}} event 
   */
  async function generateTrialPoster(event) {
    if (!event?.detail?.prompt)
      return;

    // console.log(imageGenerator?.apiPath);
    const result = await imageGenerator.generate(event.detail.prompt)
    // console.log(`${JSON.stringify(resp.meta)}`);
    trialPoster.add(result);
  }

  async function refreshOwnedEntries(eventParser) {
    if (!eventParser) return;
    const cfg = presence?.providerSwitch?.getCurrent()?.cfg;
    const chainName = cfg?.name;
    if (!chainName) return;
    // let chainPath = chainName === cfg.id ? `${chainName}/default` : cfg.id;

    const entries = [];

    const gids = await findOwnedGames(eventParser, ownedGamesHistory, {incomplete:true});
    for (const gid of gids.reverse()) {
      entries.push({
        gameToken: gid.toHexString(),
        gameNumber: gameInstance(gid),
        narratingUrl:`/trial/narrating/${gameInstance(gid)}/${chainName}`,
        raidingUrl:`/trial/raiding/${gameInstance(gid)}/${chainName}`
      });
    }
    ownedEntries = entries;
  }

  // --- svelte lifecycle callbacks
  onMount(async () => {
    console.log(`COMPONENT MOUNT STEP: ${step}`);
    imageGenerator = new ImageGeneratorOpenAI(fetch, `${data?.request?.origin}/api/openai/images/generation`);
    chain = presence?.providerSwitch?.getCurrent()?.cfg?.name;
    console.log(`TrialCreateStepper# onMount: chain: ${chain}`);
    await refreshOwnedEntries($eventParser);
  });
</script>
<Stepper
  start={step}
  buttonCompleteLabel="Mint"
  on:complete={onCompleteHandler}
  on:step={onStepHandler} on:complete={onCompleteHandler} class={stepperClass}>

	<Step class={stepClass} regionContent={stepContentClass}>
		<svelte:fragment slot="header">Create a trial poster</svelte:fragment>
    <GenerateGameIconCard on:onGenerateGameIcon={generateTrialPoster}/>
	</Step>

	<Step class={stepClass} regionContent={stepContentClass}>
		<svelte:fragment slot="header">Generate or choose a dungeon</svelte:fragment>
    <PageMapGenerator hidden={false}/>
	</Step>

	<Step class={stepClass} regionContent={stepContentClass}>
		<svelte:fragment slot="header">Place dungeon features</svelte:fragment>
    <p class="text-gray-700 dark:text-gray-400">You must place at least one finish exit</p>
    {#if $map?.meta?.svg}
      <FurnitureSummaryList map={$map} furnishings={$furnishings}/>
      <FurnishLocationsContextStore />
    {:else}
      <p>go back and create a dungeon</p>
    {/if}
	</Step>

	<Step class={stepClass} regionContent={stepContentClass} locked={trialCreating}>
		<svelte:fragment slot="header">Mint your dungeon trial</svelte:fragment>
    {#if !trialCreating}
    <input class="input" title="Call to arms" bind:value={trialDescription} type="text" placeholder="A short challenge to provoke or entice trialists" />
    <input class="input" title="Max Trialists" bind:value={trialMaxParticipants} type="number" placeholder="Set the maximum number of trialists" />
    {:else}
      <ProgressRadial />
    {/if}
    {#if trialDetails?.tokenURI}
    <!--

      <div data-clipboard="tokenURI">{trialDetails?.tokenURI}</div>
      <button use:clipboard={{ element: 'tokenURI' }}>Copy</button>
    -->
    {/if}

    {#if (!($trialPoster && $map && $furnishings && $guardian))}
    <p>Missing some prep for your trial</p>
    {/if}
    {#if !$trialPoster}
    <p>You need to create a trial poster</p>
    {/if}
    {#if !$map}
    <p>You need to create a map</p>
    {/if}
    {#if !$furnishings}
    <p>You need to furnish your dungeon</p>
    {/if}
    {#if !$guardian}
    <p>You need to connect to mint</p>
    {/if}
    <ol class="list">
      {#if (ownedEntries?.length ?? 0) === 0}
      <li><p>You currently own no trials.</p></li>
      {/if}
      {#each ownedEntries as owned}
      <li>
        <span class="badge variant-filled-primary">{owned.gameNumber}</span>
				<a
          data-sveltekit-preload-data="tap"
					class="btn btn-sm variant-ghost-surface"
					href={owned.narratingUrl}
				>
         Narrate
				</a>
				<a
          data-sveltekit-preload-data="tap"
					href={owned.raidingUrl}
				>
          Raid 
				</a>

      </li>
      {/each}
      <!-- ... -->
    </ol>
	</Step>
	<!-- ... -->
</Stepper>
{#if (step===1)}
  {#if trialPosterImg}
    <img src={trialPosterImg} class="bg-black/50 w-full aspect-[1/1]" alt="Trial Poster" /> 
  {/if}
{:else if (step > 1 && step <=3)}
  {#if $map?.meta?.svg}
    <PreviewMapCard mapImg={$map.meta.svg} mapScale={1.0}/>
  {/if}
{:else}
  {#if trialPosterImg}
    <img src={trialPosterImg} class="bg-black/50 w-full aspect-[1/1]" alt="Trial Poster" /> 
  {/if}
{/if}