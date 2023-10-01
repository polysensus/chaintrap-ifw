<script>
  import { onMount, onDestroy, setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';

  import { Navbar, NavBrand, NavUl, NavLi } from 'flowbite-svelte';

  import ProvidersDropdown from '$lib/components/presence/ProvidersDropdown.svelte';
  import CreateMapDrawer from '$lib/components/creator/CreateMapDrawer.svelte';
  import PreviewMapCard from '$lib/components/creator/PreviewMapCard.svelte';
  import BottomBar from '$lib/components/bottombar/BottomBar.svelte';
  import FurnitureSummaryList from '$lib/components/furniture/FurnitureSummaryList.svelte';

  import { ChainPresence } from '$lib/chains/presence.js';
  import { all } from '$lib/chains/supportedproviders.js';

  import { newMap } from '$lib/maptool.js';
  import { TrialContent } from '$lib/clientdata/trialcontent.js';
  import { newMapStore } from '$lib/clientdata/storemap.js';
  import { newFurnitureStore } from '$lib/clientdata/storefurnishings.js';

  import FurnishLocationsContextStore from '$lib/components/FurnishLocationsContextStore.svelte';
  import GenerateMap from '$lib/components/creator/GenerateMap.svelte';

  const  maptoolUrl = '/api/maptool';
  const presence = new ChainPresence({ networks: all });
  let trialdb;
  let providers = [];
  let cfg;
  let mapParams = {};
  /** @type {string|undefined}*/
  let providerButtonText;
  let showFurnishingControl = true;

  /** @type {{connect:Function,subscribe:Function,add:Function}|undefined}*/
  let map = newMapStore();
  setContext('map', map);
  /** @type {{connect:Function,subscribe:Function,add:Function,put:Function}|undefined}*/
  let furnishings = newFurnitureStore();
  setContext('furnishings', furnishings);

  async function onProviderSelect(cfg) {
    await presence.selectProvider(cfg.name);
  }
  async function onProviderDeselect(cfg) {
    presence.logout();
  }

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

  // $:{
  // 	if (presence?.providerSwitch?.available)
  // 		providers = Object.values(presence.providerSwitch.available)
  // }

  onMount(async () => {

    providers = Object.values(await presence.refreshProviders());
    trialdb = new TrialContent({name: 'trial_content'});
    await trialdb.create();
    await map.connect(trialdb);
    await furnishings.connect(trialdb);

    // force open the create drawer if there are no local maps
    if (!$map)
      showFurnishingControl = false;
  });
  onDestroy(async () => {
    if (trialdb)
      trialdb.close();
    trialdb = undefined;
  })
</script>

<Navbar let:hidden let:toggle>
  <NavBrand href="/">
    <img src="/apple-icon-120x120.png" class="mr-3 h-6 sm:h-9" alt="Polysensus Logo" />
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
      ><a href="https://www.polysensus.com" target="_blank">Polysensus</a></span
    >
  </NavBrand>
  <!--<NavHamburger on:click={toggle} /> -->
  <NavUl {hidden} >
    <!--<NavLi href="/contact"><a href="https://www.polysensus.com" target="_blank" >Contact</a></NavLi> -->
    <NavLi id="providers-toggle" class="cursor-pointer">
      {providerButtonText}<!--<ChevronDownOutline class="w-3 h-3 ml-2 text-primary-800 dark:text-white inline" /> -->
    </NavLi>
    <!--
      onSelect={onProviderSelect},
      onDeselect={onProviderDeselect},
    -->
    <ProvidersDropdown width={"w-80"}
      {providers}
      onSelect={onProviderSelect}
      onDeselect={onProviderDeselect}
      bind:buttonText={providerButtonText}
      bind:cfg />
  </NavUl>
</Navbar>

<div>
  <!--
  <Skeleton class="py-4" />
  <ImagePlaceholder class="pb-20" />
  -->

  {#if $map?.meta?.svg}
    <PreviewMapCard mapImg={$map.meta.svg} mapScale={1.0}/>
  {/if}
  <!--<CreateMapDrawer {onClickGenerate} bind:mapParams bind:hidden={createDrawerClosed} /> -->
  {#if showFurnishingControl}
  <FurnitureSummaryList map={$map} furnishings={$furnishings}/>
  <br/>
  <FurnishLocationsContextStore />
  {:else}
  <GenerateMap {onClickGenerate} bind:params={mapParams} bind:hidden={showFurnishingControl} />
  {/if}
  <BottomBar bind:createOn={showFurnishingControl}/>
</div>
