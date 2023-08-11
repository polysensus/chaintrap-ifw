<script>
// --- lib deps
// --- external components
// --- components
import GenerateMapCard from "$lib/components/workflowsteps/GenerateMapCard.svelte";
import PreviewMapCard from "$lib/components/workflowsteps/PreviewMapCard.svelte";
// --- app lib
// import { getLogger } from '$lib/log.js'
// --- app stores
// --- constants
// const log = getLogger('CreateMap')
// --- data imports
// --- component properties
export let mapImg = "";
export let mapParams = {};
export let onClickGenerate = ({}) => {}
// --- component state properties
// --- svelte bound variables

// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// function getPixiApp() { return instance; }
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers

</script>
<div class="flex flex-row">
<PreviewMapCard {mapImg}/> 
<GenerateMapCard bind:params={mapParams} {onClickGenerate}></GenerateMapCard>
</div>
<p>
  {JSON.stringify(mapParams, null, '  ')}
</p>
