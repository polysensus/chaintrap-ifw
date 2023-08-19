<script>
  // --- lib deps
  // --- external components
  // --- components
  import GenerateMapCard from '$lib/components/workflowsteps/GenerateMapCard.svelte';
  import PreviewMapCard from '$lib/components/workflowsteps/PreviewMapCard.svelte';
  // --- app lib
  // import { getLogger } from '$lib/log.js'
  // --- app stores
  // --- constants
  // const log = getLogger('CreateMap')
  // --- data imports
  // --- component properties
  export let mapImg = '';
  export let mapParams = {};
  export let onClickGenerate = ({}) => {};
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

<div class="grid grid-rows-5 grid-cols-10 grid-flow-col gap-1">
  <div class="row-span-5 col-span-3">
    <GenerateMapCard bind:params={mapParams} {onClickGenerate} />
  </div>
  <div class="row-start-1 row-end-7 col-start-4 col-span-8">
    <PreviewMapCard {mapImg} mapScale={0.8}/>
  </div>
</div>
