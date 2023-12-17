<script>
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
// --- components
// --- app lib
import { getLogger } from '$lib/log.js'
import {STATUS_PENDING, STATUS_COMMITTED, STATUS_VERIFIED} from '$lib/clientdata/storetrials/choicefeed.js';
// --- app stores
// --- constants
const log = getLogger('TrialistChoiceEntry')

// const STATUS_PENDING = 'pending';
// const STATUS_COMMITTED = 'committed';
// const STATUS_VERIFIED = 'verified';

// --- data imports
// --- component properties
export let entry;
export let active = false;
// --- component state properties
$: nickname = entry.nickname;
$: location = entry.location;
$: status = entry.status;

$: variant = active ? 'variant-ringed' : 'variant-soft';

$: msg = statusMessage(entry, active)
// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers
function statusMessage(entry, active) {

  if (active && entry.status === STATUS_PENDING)
    return `A: You are at location ${entry.location}, with choices pending [${entry.status}]`;
  if(active && entry.status !== STATUS_PENDING)
    return `B: location ${entry.location} [${entry.status}]`;
  if (!active && entry.status === STATUS_PENDING)
    return `C: ${nickname} is at location ${entry.location}, with choices pending [${entry.status}]`;
  return `D: ${nickname} at location ${entry.location} [${entry.status}]`;
}

</script>

<div class="card p-4 rounded-tr-none space-y-2 {variant}">
  <header class="flex justify-between items-center">
    <!--
    <p class="font-bold">{entry.choices.location}</p>
    <p class="font-bold">{entry.pending ? 'pending' : (entry.committed ? 'committed' : 'tick tock')}</p>
    -->
    <p class="{active && status==='pending' ? 'font-bold' : ''}">{msg}</p>
    <small class="opacity-50">{entry.eid}</small>
  </header>
  <p>nickname {nickname} status {status}, location {location}</p>
  <!--
  <p>pending choice menu {JSON.stringify(entry.choices)}</p>
  {#if (typeof entry.inputChoice !== 'undefined')}
  <p>chosen {JSON.stringify(entry.inputChoice)}</p>
  {/if}
  {#if (typeof entry.inputData !== 'undefined')}
  <p>choice data {JSON.stringify(entry.inputData)}</p>
  {/if}

  {#if (entry.scene)}
  <p>{JSON.stringify(entry.scene)}</p>
  {/if}
  -->
</div>