<script>
  import { onMount } from 'svelte';
	import { Alert } from 'flowbite-svelte';
	import {ChainPresence} from '$lib/chains/presence.js';
	import {all} from '$lib/chains/supportedproviders.js';
	// import {FetchProviderContext } from '$lib/chains/fetchprovidercontext.js';
	// import {Web3AuthModalProviderContext } from '$lib/chains/web3authprovidercontext.js';
	// import {Web3AuthModalProviderSwitch } from '$lib/chains/web3authproviderswitch.js';
	// import {Web3Auth} from "@web3auth/modal";

	const presence = new ChainPresence({networks:all});

  onMount(async () => {
    // window.getPixiApp = getPixiApp; /** test support hook */
		await presence.refreshProviders();
		console.log('mounted')
  });

</script>

<div class="p-8">
	<Alert>
		<span class="font-medium">Info alert!</span> Change a few things up and try submitting again.
	</Alert>
</div>