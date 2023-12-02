<script>
	import '../app.postcss';

  // framework imports
  import { twMerge } from 'tailwind-merge';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { clipboard } from '@skeletonlabs/skeleton';
  import { storePopup } from '@skeletonlabs/skeleton';
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  import { setContext } from 'svelte';
  import { get, writable, derived } from 'svelte/store';

  // framework components
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
  import { Navbar, NavBrand, NavUl, NavLi } from 'flowbite-svelte';

  // application components
  import PagePresence from '$lib/components/presence/PagePresence.svelte';

  // application imports
  import { ChainPresence } from '$lib/chains/presence.js';
  import { all } from '$lib/chains/supportedproviders.js';
  // contexts

  /** @type {{request:{href?:string,origin?:string}}} */
  export let data; // see +layout.js:load
  setContext('data', data);

  let arena = writable(undefined);
  setContext('arena', arena);

  const presence = new ChainPresence({ networks: all });
  setContext('presence', presence);

  const walletAddress = derived(arena, async ($arena, set) => {
    if (!$arena) {
      set(undefined);
      return;
    }
    const address = await $arena?.signer?.getAddress();
    set(address);
  });
  setContext('walletAddress', walletAddress);

  let walletAddressAbbrev = undefined;

  $: walletAddressAbbrev = abbrevAddr($walletAddress)

  function abbrevAddr(address, sep='..') {
    if (!address) return "";
    return address.slice(0, 6) + sep + address.slice(address.length -2)
  }

  // state vars
  let providerButtonText;
  let providerButtonClass = 'btn variant-filled';
  $: providerButtonClass = $arena ? 'btn variant-ringed xl' : 'btn variant-filled xl';

</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
        <img src="/apple-icon-120x120-white.png" class="mr-3 h-6 sm:h-9" alt="Polysensus Logo" />
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
          ><a href="https://www.polysensus.com" target="_blank"><strong class="text-xl uppercase">Polysensus</strong></a></span
        >

			</svelte:fragment>
			<svelte:fragment slot="trail">
        <PagePresence bind:providerButtonText={providerButtonText} />
        {#if !$walletAddress}
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://discord.gg/ytn98NnchE"
					target="_blank"
					rel="noreferrer"
				>
					Discord
				</a>
        {:else}
          <p class="invisible w-0" data-clipboard="walletAddress">{$walletAddress}</p>
          <button use:clipboard={{ element: 'walletAddress' }}>{walletAddressAbbrev}</button>
        {/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>