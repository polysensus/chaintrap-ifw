<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import { createEventDispatcher, setContext } from 'svelte';
  import type { LinkType } from 'flowbite-svelte';
  import {PaginationItem} from 'flowbite-svelte' 

  export let pages: LinkType[] = [];
  export let activeClass: string = 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white';
  export let normalClass: string = 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white';
  export let ulClass: string = 'inline-flex -space-x-px items-center';
  export let table: boolean = false;
  export let large: boolean = false;
  export let ariaLabel: string = 'Page navigation';

  export let pageClick = (page, i) => {
    console.log(`clicked page ${i}`)
  }

  const dispatch = createEventDispatcher();

  setContext<boolean>('group', true);
  setContext<boolean>('table', table);

  const previous = () => {
    dispatch('previous');
  };
  const next = () => {
    dispatch('next');
  };
</script>

<nav aria-label={ariaLabel}>
  <ul class={twMerge(ulClass, table && 'divide-x dark divide-gray-700 dark:divide-gray-700', $$props.class)}>
    <li>
      <PaginationItem {large} on:click={previous} {normalClass} class={table ? 'rounded-l' : 'rounded-l-lg'}>
        <slot name="prev">Previous</slot>
      </PaginationItem>
    </li>
    {#each pages as page, i}
      <li>
        <PaginationItem {large} active={page.active} {activeClass} {normalClass} href={page.href} on:click={() => pageClick(page, i)} on:blur on:change on:focus on:keydown on:keypress on:keyup on:mouseenter on:mouseleave on:mouseover>
          {page.name}
        </PaginationItem>
      </li>
    {/each}
    <li>
      <PaginationItem {large} on:click={next} {normalClass} class={table ? 'rounded-r' : 'rounded-r-lg'}>
        <slot name="next">Next</slot>
      </PaginationItem>
    </li>
  </ul>
</nav>