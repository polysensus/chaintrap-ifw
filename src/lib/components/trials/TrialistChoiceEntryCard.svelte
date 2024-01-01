<script>
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
// --- components
// --- app lib
import { getLogger } from '$lib/log.js'
import {STATUS_PENDING, STATUS_COMMITTED, STATUS_VERIFIED} from '$lib/clientdata/storetrials/choicefeed.js';
import { describeChoices } from '$lib/describechoices.js';
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
$: eid = entry?.eid;
$: nickname = entry.nickname;
$: location = entry.location;
$: status = entry.status;
$: choices = entry?.choices;
$: inputChoice = entry?.inputChoice;

$: variant = active ? 'variant-ringed' : 'variant-soft';

$: choiceMenu = describeChoices(location, choices, inputChoice);

// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers

</script>

<div class="card p-4 rounded-tr-none space-y-2 {variant}">
  <header class="flex justify-between items-center">
    <!--
    <p class="font-bold">{entry.choices.location}</p>
    <p class="font-bold">{entry.pending ? 'pending' : (entry.committed ? 'committed' : 'tick tock')}</p>
    <p class="{active && status==='pending' ? 'font-bold' : ''}">{msg}</p>
    -->
    <small class="opacity-50"><p>{nickname}
    {#if location}
        {choiceMenu.locationSummary[1]}
    {/if}
    </p></small>
    <small class="opacity-50">{eid}</small>
  </header>
  <pre class="pre"><p>{choiceMenu.exitsSummary[1]}. {choiceMenu.chestsSummary[1]}</p></pre>
</div>