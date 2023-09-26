<script>
import Pagination from '$lib/components/pagination/Pagination.svelte';
import { getLogger } from '$lib/log.js'
// --- constants
const log = getLogger('FurnishRooms')

// --- component properties
export let pages = [];
export let total = 0;
export let subject =  "";

export let previous = () => {
  console.log('Previous btn clicked. Make a call to your server to fetch data.');
};

export let next = () => {
  console.log('Next btn clicked. Make a call to your server to fetch data.');
};

export let select = (page, i) => {
  console.log(`page selected ${page.name} ${i}`);
}
// --- component state properties

let range = {start:0, end:0, total:0}

$: {
  // assume locations are sorted by number
  range = {
    start: pages[0].name,
    end: pages.length > 0 ? pages[pages.length-1].name : 0,
    total
  }
}

</script>

<div class="flex flex-col items-center justify-center gap-2">
  <Pagination {pages} on:previous={previous} on:next={next} pageClick={select}>
    <span slot="prev">Prev</span>
  </Pagination>
  {#if (subject !== '')}
  <div class="text-sm text-gray-700 dark:text-gray-400">
    of <span class="font-semibold text-gray-900 dark:text-white">{range.total}</span>
    {subject}
  </div>
  {/if}
</div>
<style>
</style>