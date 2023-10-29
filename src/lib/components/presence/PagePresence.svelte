<script>
  import { onMount, getContext } from 'svelte';
  import { arenaConnect } from '@polysensus/chaintrap-arenastate';
  import ProvidersDropdown from '$lib/components/presence/ProvidersDropdown.svelte';

  export let providerButtonText = '';

  let cfg;
  let providers;

  const data = getContext('data');
  const presence = getContext('presence');
  const arena = getContext('arena');

  function updateCurrentProvider(current) {
    if (!current?.signer) return undefined;
    const address = data.arenaAddress[current.cfg.name];
    if (!address) {
      console.log(`no address for provider config: ${current.cfg.name} ${JSON.stringify(data.arenaAddress)}`);
      return undefined;
    }
    return arenaConnect(address, current.signer)
  }

  async function onProviderSelect(cfg) {
    await presence.selectProvider(cfg.name);
    $arena = updateCurrentProvider(presence?.providerSwitch?.getCurrent());
    console.log('arena:', $arena);
  }

  async function onProviderDeselect(cfg) {
    presence.logout();
  }

  onMount(async () => {
    providers = Object.values(await presence.refreshProviders());
  });
</script>

<ProvidersDropdown width={"w-80"}
  {providers}
  onSelect={onProviderSelect}
  onDeselect={onProviderDeselect}
  bind:buttonText={providerButtonText}
  bind:cfg />

