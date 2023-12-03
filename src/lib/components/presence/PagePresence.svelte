<script>

  import { awaitable } from '@polysensus/chaintrap-arenastate';
  import { arenaConnect } from '@polysensus/chaintrap-arenastate';

  import { onMount, getContext } from 'svelte';
  import { page } from '$app/stores';
  import ProvidersList from '$lib/components/presence/ProvidersList.svelte';
  import { namedProviderRoute } from '$lib/chains/supportedproviders.js';

  export let providerButtonText = '';

  let providers;
  let selected;
  let lastName = undefined;

  const data = getContext('data');
  const presence = getContext('presence');
  const arena = getContext('arena');

  async function providerSelected(event) {
    console.log(`PagePresence# event.detail ${JSON.stringify(event)}`);

    if (!event.detail || event.detail.name === lastName) {
      console.log(`PagePresence# logout ${lastName}`);
      presence.logout();
      lastName = undefined;
      await arena.set(undefined);
      selected = undefined;
      return;
    }

    await presence.selectProvider(event.detail.name);
    await connectCurrent();
  }

  async function connectCurrent() {

    const current = presence?.providerSwitch?.getCurrent()
    if (!current?.signer) {
      console.log(`PagePresence# no current signer, not connected`);
      return;
    }

    const address = data.arenaAddress[current.cfg.name];
    if (!address) {
      console.log(`PagePresence# no address for provider config: ${current.cfg.name} ${JSON.stringify(data.arenaAddress)}`);
      return;
    }
    $arena = arenaConnect(address, current.signer)
    lastName = current.cfg.name;

  }

  async function refreshConnectedProvider() {
    if (!presence?.providerSwitch) return;
    console.log(`PagePresence# refreshing login status`);
    const connectedName = await presence.providerSwitch.refreshLoginStatus(true);
    const routedName = namedProviderRoute($page);
    if (!(connectedName || routedName)) return;

    // The web3auth provider remains connected until explicitly logged out. But
    // we want to prefer the routed provider for the presence selection
    let routedProvider, connectedProvider;
    for (const p of providers) {
      if (routedName && !routedProvider && p.name === routedName) routedProvider = p;
      if (!connectedProvider && p.name === connectedName) connectedProvider = p;
      if (connectedProvider && (!routedName || routedProvider)) break;
    }
    return routedProvider ?? connectedProvider;
  }

  onMount(async () => {
    providers = Object.values(await presence.refreshProviders());

    // Note: we have to do this because we are using web3auth in re-direct mode
    // (for maximum mobile compat). which means we lose state when we redirect &
    // callback
    selected = await refreshConnectedProvider()
    await connectCurrent();
  });
</script>
<ProvidersList on:providerSelected={providerSelected} {providers} bind:selected={selected}>

</ProvidersList>

