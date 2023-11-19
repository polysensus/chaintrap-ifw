<script>
// Provides a single page level element for completion based game commands and interactions

// --- lib deps
//import * as PIXI from 'pixi.js'
// --- framework
import { getContext } from 'svelte'
// --- external components
// --- components
import CommandBox from './commandbox/CommandBox.svelte';
// --- app lib
import { getLogger } from '$lib/log.js';

// --- app stores

// --- constants
const log = getLogger('PageGameCommands')
const metadataURL = '/api/nftstorage/metadata';
// --- data imports
// --- component properties

// Note: see lib/console/gamecommandsets for helpers to build this
/** @type {import("../console/codemirror.js").CodeMirrorCommandSet|undefined}*/
export let commands = undefined;

// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// function getPixiApp() { return instance; }
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers
/**
 * onComplete dispatches the command to one of the specific handlers implemented here
 * @param value
 */
function onComplete(value) {
  if (!commands) {
    log.info('no commands defined');
    return;
  }
  log.info('completion event');
  log.debug(JSON.stringify(value.detail))

  const result = commands.match(value.detail);
  if (!result) {
    console.log(`no match for ${value.detail}`);
    return;
  }
  const {completion, callback} = result;
  callback(completion.result).then((result)=>{
    log.debug(`${completion.prefix} done`);
    log.debug(`${JSON.stringify(result)}`);
  });
}

</script>
<!--

<BottomBar completions={commands.snippetCompletions()} on:onNewline={onComplete} bind:bottomNavCreateToggle={showMapGenerator}/>
-->
{#if commands}
<CommandBox completions={commands.snippetCompletions()} on:onChange on:onPick on:onNewline={onComplete} class="min-w-full border-2 rounded-lg"/>
{/if}
<style>
</style>