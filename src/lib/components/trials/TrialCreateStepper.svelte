<script>

  // framework imports
  import { onMount, onDestroy, setContext, getContext } from 'svelte';
  import { get, writable, derived } from 'svelte/store';

  import {ImageGeneratorOpenAI} from '$lib/generative/gameicon.js';

  // framework components

  // application components

  import { Stepper, Step } from '@skeletonlabs/skeleton';

  // import PageGameIconGenerator from '$lib/components/creator/PageGameIconGenerator.svelte';
  import GenerateGameIconCard from '$lib/components/creator/GenerateGameIconCard.svelte';
  import PreviewMapCard from '$lib/components/creator/PreviewMapCard.svelte';
  import PageMapGenerator from '$lib/components/creator/PageMapGenerator.svelte';
  import FurnishLocationsContextStore from '$lib/components/FurnishLocationsContextStore.svelte';
  import FurnitureSummaryList from '$lib/components/furniture/FurnitureSummaryList.svelte';

  /** @type {ImageGeneratorOpenAI} */
  let imageGenerator;


  // contexts
  const data = getContext('data');
  const map = getContext("map");
  const furnishings = getContext('furnishings');
  const trialPoster = getContext('trialPoster');


  /** @type {number|undefined}*/
  let step = 0;

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
  function onCompleteHandler() {
    console.log(`TrialCreateStepper# complete`);
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

  // --- svelte lifecycle callbacks
  onMount(async () => {
    imageGenerator = new ImageGeneratorOpenAI(fetch, `${data?.request?.origin}/api/openai/images/generation`);
  });
</script>
<Stepper
  start={step}
  buttonCompleteLabel="Mint"
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

	<Step class={stepClass} regionContent={stepContentClass}>
		<svelte:fragment slot="header">Mint your dungeon trial</svelte:fragment>
    <input class="input" title="Max Trialists" type="number" placeholder="Set the maximum number of trialists" />
    <input class="input" title="Call to arms" type="text" placeholder="A short challenge to provoke or entice trialists" />
	</Step>
	<!-- ... -->
</Stepper>

{#if (step===0)}
  {#if trialPosterImg}
    <img src={trialPosterImg} class="bg-black/50 w-full aspect-[1/1]" alt="Trial Poster" /> 
  {/if}
{:else if (step >=1 && step <=3)}
  {#if $map?.meta?.svg}
    <PreviewMapCard mapImg={$map.meta.svg} mapScale={1.0}/>
  {/if}
{:else}
  {#if trialPosterImg}
    <img src={trialPosterImg} class="bg-black/50 w-full aspect-[1/1]" alt="Trial Poster" /> 
  {/if}
{/if}