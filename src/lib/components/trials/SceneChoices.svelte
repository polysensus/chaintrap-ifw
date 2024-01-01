<script>
// --- lib deps
import { ipfsGatewayURL } from '@polysensus/chaintrap-arenastate';
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
import { ProgressRadial } from '@skeletonlabs/skeleton';
// --- components
// --- app lib
import { getLogger } from '$lib/log.js'
import {STATUS_COMMITTED} from '$lib/clientdata/storetrials/choicefeed.js';
import { describeChoices } from '$lib/describechoices.js';
import { UseExitCommandCtx } from '$lib/commandcontexts/useexit.js';
import { OpenChestCommandCtx } from '$lib/commandcontexts/openchest.js';

// --- app stores
// --- constants
const log = getLogger('SceneChoices');

// --- data imports
// --- component properties
export let gid;
/**
 * @type {{eid:number,nickname:string,address:string,location:number,choices?:Array.<Array<number>>, inputChoice?:number, status:string}}
 */
export let entry;
export let finalEntry = undefined;
export let metadataURI = undefined;

// --- component state properties
$: eid = entry?.eid;
$: address = entry?.address;
$: nickname = entry?.nickname;
$: location = entry?.location;
$: choices = entry?.choices ?? [];
$: inputChoice = entry?.inputChoice;
$: status = entry?.status;
$: victory = entry?.arenaEvents?.victory;

$: useExitCmd = new UseExitCommandCtx({gid});
$: openChestCmd = new OpenChestCommandCtx({gid});
$: situation = describeChoices(location, choices, entry?.inputChoice, {useExitCmd, openChestCmd});

// --- svelte bound variables
// let instance = undefined

/** @type {undefined|string}*/
let menuIndex = undefined;
let choiceMade = false;

// --- svelte lifecycle callbacks
// test support hook
// onMount(async () => {})
// --- on dom event callbacks

function onListItemClick(cm) {
  try {
    const result = cm.exec(...cm.execArgs);
    log.info(JSON.stringify(result));
  } catch (err) {
    log.warn(`unexpected error: ${err}`);
    return;
  }
  // choiceMade = true;
}
// --- contract state callbacks
// --- component helpers

</script>

{#if entry}
<div class="grid grid-cols-[1fr_auto] gap-2">
  <div class="card p-4 rounded-tr-none space-y-2">
    <header class="flex justify-between items-center">
      <small class="opacity-50"><p class="font-bold">{nickname} @{address?.slice(0, 8)}</p></small>
      <small class="opacity-50">{eid}</small>
    </header>
    {#if (finalEntry && !victory)}
      <pre class="pre">In the distance you hear a grinding thunk. You recognize the sound of your own doom, one of your fellow raiders has sealed your fate.</pre>
      {#if metadataURI}
        <small class="opacity-50"><a href={ipfsGatewayURL(metadataURI)}>The <em class="font-bold">token</em> of your victory</a> for {gid.toHexString()}</small>
      {/if}
    {:else if victory}
      <pre class="pre">The exit swings shut behind you, sealing your fellow raiders to their doom.  The trial is over and victory is yours.</pre>
    {:else if (choices && status !== STATUS_COMMITTED)}
      {#if !entry.completed}
        <pre class="pre"><p>{situation.locationSummary[0]}. {situation.exitsSummary[0]}. {situation.chestsSummary[0]}.</p></pre>
      {:else}
      <p>Your trials are over</p>
      {/if}
      {#if !choiceMade}
      <Accordion>
        <AccordionItem>
          <svelte:fragment slot="summary">
            <small class="opacity-50"><p>Make your selection here or type your choice below</p></small>
          </svelte:fragment>
          <svelte:fragment slot="content">
          <ListBox active="variant-outline">
            {#each situation.choiceMenu as cm (cm.id) }
              <ListBoxItem on:click={() => onListItemClick(cm)} bind:group={menuIndex} name="choice" value="{cm.id}">{cm.naturalPrompt[0]} ({cm.prompt})</ListBoxItem>
            {/each}
          </ListBox>
          </svelte:fragment>
        </AccordionItem>
      </Accordion>
      {:else}
        <p>Choice is being applied</p>
        <ProgressRadial></ProgressRadial>
      {/if}
    {:else if status === STATUS_COMMITTED}
      <p>Waiting for narrator</p>
      <ProgressRadial></ProgressRadial>
    {/if}
  </div>
</div>
{/if}
<style>
</style>