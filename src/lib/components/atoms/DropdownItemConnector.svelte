<DropdownItem on:click={onClick} class="p-2 {width}" outline={true}>
  <div class="container m-auto grid grid-cols-2 gap-4">

    {#if item.img}
      <Avatar src={item.img} alt={item.imgAlt ?? "network presence image"} class="flex-shrink-0"/>
    {/if}
    <div class="min-w-0">
      <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
         <InfoBadge {selected}>{item.name}</InfoBadge>
         <InfoBadge {selected}>{item.chainId}</InfoBadge>
         {#if item.ticker}
         <InfoBadge {selected}>{item.ticker}</InfoBadge>
         {/if}
      </p>
      <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
        {item.description ?? "a network connector and wallet context"}
      </p>
    </div>
    <div class="text-base text-gray-900 dark:text-white">
      {#if selected}
      <Badge color="dark">
       <Icon.ArrowRightOnRectangle size="20"/>
      </Badge>
      {:else}
      <Badge color="light">
       <Icon.Signal size="20"/>
      </Badge>
      {/if}
    </div>

  </div>

</DropdownItem>

<script>
import * as Icon from 'svelte-heros-v2';
import { Avatar, Badge, DropdownItem } from 'flowbite-svelte';
import InfoBadge from './InfoBadge.svelte';

/**
 * @type {{name:string, chainId:string, ticker?:string, img?:string, imgAlt?:string}}
 */
export let item;
export let selected = false;
export let width="w-full";



/**
 * @type function
*/
export let onClick=() => {};

</script>
<style>
</style>