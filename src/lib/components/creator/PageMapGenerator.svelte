<script>
// Provides a single page level element for generating game maps

// --- lib deps
//import * as PIXI from 'pixi.js'
// --- framework
import { getContext } from 'svelte'
// --- external components
// --- components
import GenerateMap from '$lib/components/creator/GenerateMap.svelte';
// --- app lib
import { getLogger } from '$lib/log.js'
import { newMap } from '$lib/maptool.js';
// --- app stores

const map = getContext('map');

// --- constants
const log = getLogger('PageMapGenerator')
const maptoolUrl = '/api/maptool';
// --- data imports
// --- component properties
export let hidden = true;
// --- component state properties
let mapParams = {};
// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// function getPixiApp() { return instance; }
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers

async function onClickGenerate() {
  console.log(`${JSON.stringify(mapParams)}`);
  const { password } = mapParams;
  const params = { ...mapParams };
  delete params.password;
  console.log('calling newMap');
  const result = await newMap(params, {
    maptoolUrl,
    svg: true
  });
  console.log(`ok: ${result.ok}`);
  if(!(map && result && result.ok && result.map))
    return;

  await map.add({...result.map, meta: {svg: result.svg, maptoolUrl}});
}

</script>
<GenerateMap {onClickGenerate} bind:params={mapParams} bind:hidden={hidden} />
<style>
</style>