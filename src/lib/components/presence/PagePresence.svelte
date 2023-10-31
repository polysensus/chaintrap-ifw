<script>
  import { onMount, getContext } from 'svelte';
  import { arenaConnect } from '@polysensus/chaintrap-arenastate';
  import ProvidersList from '$lib/components/presence/ProvidersList.svelte';

  export let providerButtonText = '';

  let providers;
  let lastName = undefined;

  const data = getContext('data');
  const presence = getContext('presence');
  const arena = getContext('arena');

  async function providerSelected(event) {
    if (!event.detail) {
      presence.logout();
      return;
    }
    console.log(`** event.detail ${event.detail}`);

    await presence.selectProvider(event.detail.name);
    const current = presence?.providerSwitch?.getCurrent()

    if (!current?.signer) return;

    const address = data.arenaAddress[current.cfg.name];
    if (!address) {
      console.log(`no address for provider config: ${current.cfg.name} ${JSON.stringify(data.arenaAddress)}`);
      return;
    }
    $arena = arenaConnect(address, current.signer)
  }

  onMount(async () => {
    providers = Object.values(await presence.refreshProviders());
  });
</script>
<ProvidersList on:providerSelected={providerSelected} {providers}>

</ProvidersList>

