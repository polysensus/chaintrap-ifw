<script>
  import { Card, Listgroup, Avatar } from 'flowbite-svelte';
  import { Badge } from 'flowbite-svelte';

  import ButtonConnect from '$lib/components/atoms/ButtonConnect.svelte';
  import ButtonDisconnect from '$lib/components/atoms/ButtonDisconnect.svelte';

  // import { selectedAsset } from '$lib/stores/assets.js';
  export let providers;
  export let selected = undefined;
  export let buttonWidth = 'w-40';

  function select(name) {
    selected = name;
  }
  function logout(name) {
    selected = undefined;
  }
</script>

<Card padding="xl" size="md">
  <!--
  <div class="flex justify-between items-center mb-4">
      <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Game Connectors</h5>
      <p class="text-sm font-medium text-gray-900 dark:text-white">
         Chaintrap is available using these network wallet connectors
       </p>
  </div>
   -->
  {#if providers.length}
    <Listgroup items={providers} let:item class="border-0 dark:!bg-transparent">
      <div class="flex items-center space-x-4">
        {#if item.img}
          <Avatar
            src={item.img}
            alt={item.imgAlt ?? 'network connector icon'}
            class="flex-shrink-0"
          />
        {/if}
        <div class="flex-1 justify-start min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            <Badge>{item.name}</Badge>
            <Badge>{item.chainId}</Badge>
            {#if item.ticker}
              <Badge>{item.ticker}</Badge>
            {/if}
          </p>
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            {item.description ?? 'a network connector and wallet context'}
          </p>
        </div>
        <div class="inline-flex items-center text-base text-gray-900 dark:text-white">
          <div class="flex-1 min-w-0">
            {#if item.name !== selected}
              <ButtonConnect text="Connect" width={buttonWidth} onClick={() => select(item.name)} />
            {:else}
              <ButtonDisconnect text="Leave" width={buttonWidth} onClick={() => logout(item)} />
            {/if}
          </div>
        </div>
      </div>
    </Listgroup>
  {:else}
    <p>no game connectors available yet</p>
  {/if}
</Card>
