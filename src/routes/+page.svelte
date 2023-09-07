<script>
  import { onMount } from 'svelte';

  import { Alert, Chevron, Navbar, NavBrand, NavHamburger, NavUl, NavLi } from 'flowbite-svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';

  import ProvidersDropdown from '$lib/components/presence/ProvidersDropdown.svelte';
  import CreateMap from '$lib/components/workflowsteps/CreateMap.svelte';

  import { ChainPresence } from '$lib/chains/presence.js';
  import { all } from '$lib/chains/supportedproviders.js';

  import { newMapCodex } from '$lib/maptool.js';
  // import {FetchProviderContext } from '$lib/chains/fetchprovidercontext.js';
  // import {Web3AuthModalProviderContext } from '$lib/chains/web3authprovidercontext.js';
  // import {Web3AuthModalProviderSwitch } from '$lib/chains/web3authproviderswitch.js';
  // import {Web3Auth} from "@web3auth/modal";

  const presence = new ChainPresence({ networks: all });
  let providers = [];
  let cfg;
  let mapParams = {};
  let maptoolUrl = '/api/maptool';
  let mapImg = '';
  let mapJson;
  let codex;
  let data;
  let committedJson;
  let providerButtonText;


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
    console.log(result.mapSVG);
    if(!result.ok)
      return;
    mapJson = result.mapJson;
    mapImg = result.mapSVG;
    codex = result.codex;
    data = result.data;
    committedJson = result.committedJson;
  }

  // $:{
  // 	if (presence?.providerSwitch?.available)
  // 		providers = Object.values(presence.providerSwitch.available)
  // }

  onMount(async () => {
    // window.getPixiApp = getPixiApp; /** test support hook */
    providers = Object.values(await presence.refreshProviders());
    console.log('mounted');
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
    <ProvidersDropdown width={"w-80"} bind:buttonText={providerButtonText} {providers} bind:cfg />
  </NavUl>
</Navbar>

<div>
  <CreateMap {mapImg} {onClickGenerate} bind:mapParams />
</div>
