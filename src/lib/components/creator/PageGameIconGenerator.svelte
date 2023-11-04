<script>
// Intended for use as a single page level element for generating game icons

// --- lib deps
// --- framework
import { onMount, getContext } from 'svelte'
// --- external components
// --- components
import GenerateGameIconCard from '$lib/components/creator/GenerateGameIconCard.svelte';
import {ImageGeneratorOpenAI} from '$lib/generative/gameicon.js';

// --- app lib
// --- app stores
const data = getContext('data');
const trialPoster = getContext('trialPoster');

// --- constants
// --- data imports
// --- component properties
// --- component state properties
/** @type {ImageGeneratorOpenAI} */
let imageGenerator;

/** @type string */
let trialPosterImg;
$:{
  if ($trialPoster)
    trialPosterImg = $trialPoster?.meta?.imgHeader + $trialPoster.base64;
}



// --- svelte bound variables
// --- svelte lifecycle callbacks
  onMount(async () => {
    imageGenerator = new ImageGeneratorOpenAI(fetch, `${data?.request?.origin}/api/openai/images/generation`);
  });

// --- component helpers
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
</script>
  <GenerateGameIconCard img={trialPosterImg} on:onGenerateGameIcon={generateTrialPoster}/>
<style>
</style>