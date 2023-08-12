<script>
  import { Card, Listgroup, Avatar } from 'flowbite-svelte';
  import { Button, Popover } from 'flowbite-svelte';

  // import { selectedAsset } from '$lib/stores/assets.js';
  export let viewName;
  export let trials;
  export let showId = true;

  export let selected;

  function selectTrial(trial) {
    selected = trial;
  }
</script>

<Card padding="xl" size="md">
  <div class="flex justify-between items-center mb-4">
    <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Trials</h5>
    <a href="/" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
      View all
    </a>
  </div>
  {#if trials.length}
    <Listgroup items={trials} let:item class="border-0 dark:!bg-transparent">
      <div class="flex items-center space-x-4">
        <Avatar src={item.gatewayImageUrl} alt={item.gatewayImageUrlAlt} class="flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            {item.metadata.title}
          </p>
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            {item.metadata.properties.name}
          </p>
          <p class="text-sm text-gray-500 truncate dark:text-gray-400">
            {item.metadata.description}
          </p>
        </div>
        <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          <Button id="b1" outline={true} on:click={() => selectTrial(item)}
            >{item.gid.toHexString().slice(0, 8)}</Button
          >
          <Popover class="w-96 text-sm font-light " triggeredBy="#b1">
            {item.gid.toHexString()}
          </Popover>
        </div>
      </div>
    </Listgroup>
  {:else}
    <p>no trials to show for {viewName}</p>
  {/if}
</Card>
