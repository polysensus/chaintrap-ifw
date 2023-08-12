<script>
  import { onMount } from 'svelte';

  import { Alert, Chevron, Navbar, NavBrand, NavHamburger, NavUl, NavLi } from 'flowbite-svelte';
  import ProvidersDropdown from '$lib/components/presence/ProvidersDropdown.svelte';
  import CreateMap from '$lib/components/workflowsteps/CreateMap.svelte';

  import { ChainPresence } from '$lib/chains/presence.js';
  import { all } from '$lib/chains/supportedproviders.js';

  import { newMapCodex } from '$lib/maptool.js';
  // import {FetchProviderContext } from '$lib/chains/fetchprovidercontext.js';
  // import {Web3AuthModalProviderContext } from '$lib/chains/web3authprovidercontext.js';
  // import {Web3AuthModalProviderSwitch } from '$lib/chains/web3authproviderswitch.js';
  // import {Web3Auth} from "@web3auth/modal";

  import { providers as testProviders } from '$lib/components/presence/test.data.providers.js';

  const presence = new ChainPresence({ networks: all });
  let providers = [];
  let cfg;
  let mapImg = '/content/maps/map.svg';
  let mapParams = {};
  let maptoolUrl = '/api/maptool';
  let result;

  async function onClickGenerate() {
    console.log(`${JSON.stringify(mapParams)}`);
    const { password } = mapParams;
    const params = { ...mapParams };
    delete params.password;
    console.log('calling newMapCodex');
    result = await newMapCodex(params, {
      maptoolUrl,
      svg: true,
      codexPassword: password,
      codexGeneratePassword: false
    });
    console.log(result.mapJson);
    console.log(`ok: ${result.ok}`);
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
  <NavHamburger on:click={toggle} />
  <NavUl {hidden} class="ml-3">
    <!--<NavLi href="/contact"><a href="https://www.polysensus.com" target="_blank" >Contact</a></NavLi> -->
    <ProvidersDropdown {providers} bind:cfg />
  </NavUl>
</Navbar>

<div>
  <p>selected provider {cfg?.name} {cfg?.chainId}</p>
  <br />
  <CreateMap {mapImg} {onClickGenerate} bind:mapParams />
</div>
