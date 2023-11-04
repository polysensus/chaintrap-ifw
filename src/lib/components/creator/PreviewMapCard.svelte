<script>
  // --- lib deps
  // --- external components
  import { twMerge } from 'tailwind-merge';
  // --- components
  import SVGBox from '$lib/components/atoms/SVGBox.svelte';
  // --- app lib
  // import { getLogger } from '$lib/log.js'
  // --- app stores
  // --- constants
  // const log = getLogger('CreateMap')
  // --- data imports
  // --- component properties
  export let mapImg = '';
  export let mapScale = 1.0;

  // --- component state properties
  let reverse = false;
  let horizontal = true;
  let imgClass = '';
  $: imgClass = twMerge(
    'offset1',
    // reverse ? 'rounded-b-lg' : 'rounded-t-lg',
    horizontal && 'object-cover h-96 w-full'
    // horizontal && (reverse ? 'md:rounded-r-lg' : 'md:rounded-l-lg')
  );
  let innerPadding = 'max-w-lg'; // md
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
{#if mapImg}
<div class="flex justify-center">
<SVGBox svg={mapImg} scale={mapScale}/>
</div>
{:else}
<div class={innerPadding}>
<p class="mb-3 leading-tight">Generate a map, it will preview here</p>
</div>
{/if}
