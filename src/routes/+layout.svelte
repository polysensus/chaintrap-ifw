<script>
	import '../app.postcss';

  // framework imports
  import { twMerge } from 'tailwind-merge';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  import { setContext } from 'svelte';
  import { get, writable } from 'svelte/store';

  // framework components
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
  import { Navbar, NavBrand, NavUl, NavLi } from 'flowbite-svelte';

  // application components
  import PagePresence from '$lib/components/presence/PagePresence.svelte';
  import ProvidersList from '$lib/components/presence/ProvidersList.svelte';

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
        <!--
        <ProvidersList {providers}/>
        <button id="providers-toggle" type="button" class="{providerButtonClass}">{providerButtonText}</button>
        -->
        <PagePresence bind:providerButtonText={providerButtonText} />
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://discord.gg/ytn98NnchE"
					target="_blank"
					rel="noreferrer"
				>
					Discord
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>