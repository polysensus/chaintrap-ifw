<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import { Navbar, NavBrand, NavUl, NavLi } from 'flowbite-svelte';

  import ProvidersDropdown from '$lib/components/presence/ProvidersDropdown.svelte';
  import CreateMapDrawer from '$lib/components/creator/CreateMapDrawer.svelte';
  import PreviewMapCard from '$lib/components/creator/PreviewMapCard.svelte';
  import BottomBar from '$lib/components/bottombar/BottomBar.svelte';

  import { ChainPresence } from '$lib/chains/presence.js';
  import { all } from '$lib/chains/supportedproviders.js';

  import { newMapCodex, hydrateCodex } from '$lib/maptool.js';
  import { TrialContent } from '$lib/clientdata/trialcontent.js';
  import { updated } from '$app/stores';

  const presence = new ChainPresence({ networks: all });
  let providers = [];
  let cfg;
  let mapParams = {};
  let maptoolUrl = '/api/maptool';
  let mapImg = writable('');
  let codex = undefined;
  /** @type {string|undefined}*/
  let providerButtonText;
  let createOn = false;
  /** @type {TrialContent|undefined}*/
  let trialdb = undefined;

  $: {

    // TODO: password handling, check for password being used by iterating over
    // keys and checking if any != null If there are passwords, assume only one
    // and use the password from the current Create dungeon card. Not great, but
    // will serve for now.
    if(codex)
      mapImg.set(codex.objectFromData(codex.getIndexedItem('svg', {ikey:0})).content ?? '');
  }

  async function codexUpdate() {
    if (!trialdb) return;
    const serialized = await trialdb.lastCodex();
    if (!serialized) {
      codex = undefined
      return;
    }
    codex = await hydrateCodex(serialized);
  }

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
    console.log('calling newMapCodex');
    const result = await newMapCodex(params, {
      maptoolUrl,
      svg: true,
      codexPassword: password,
      codexGeneratePassword: false
    });
    console.log(`ok: ${result.ok}`);
    if(!(trialdb && result && result.ok && result.codex))
      return;

    const map = result.codex.objectFromData(result.codex.getIndexedItem('map', {ikey:0})).content;
    await trialdb.addMap(map);
    // @ts-ignore
    await trialdb.addCodex(result.codex.serialize());
    await codexUpdate();
    console.log(`#maps ${(await trialdb.mapCount())}`)
    console.log(`#codices ${(await trialdb.codexCount())}`)
  }

  // $:{
  // 	if (presence?.providerSwitch?.available)
  // 		providers = Object.values(presence.providerSwitch.available)
  // }

  onMount(async () => {
    // window.getPixiApp = getPixiApp; /** test support hook */
    providers = Object.values(await presence.refreshProviders());
    console.log('mounted');
    trialdb = new TrialContent({name: 'trial_content'});
    await trialdb.create();
    await codexUpdate();
  });
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

  {#if $mapImg}
    <PreviewMapCard mapImg={$mapImg} mapScale={1.0}/>
  {/if}
  <CreateMapDrawer {onClickGenerate} bind:mapParams bind:hidden={createOn} />
  <BottomBar bind:createOn/>
</div>
