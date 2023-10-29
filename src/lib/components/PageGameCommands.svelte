<script>
// Provides a single page level element for completion based game commands and interactions

// --- lib deps
//import * as PIXI from 'pixi.js'
// --- framework
import { onMount, setContext, getContext, onDestroy } from 'svelte'
// --- external components
// --- components
import BottomBar from '$lib/components/bottombar/BottomBar.svelte';
// --- app lib
import { getLogger } from '$lib/log.js';
import { CodeMirrorCommandSet } from '$lib/console/codemirror.js';
import { CreateGameCommandCtx } from '$lib/commandcontexts/creategame.js';
import { JoinGameCommandCtx } from '$lib/commandcontexts/joingame.js';
import { SetStartCommandCtx } from '$lib/commandcontexts/setstart.js';
import { StartGameCommandCtx } from '$lib/commandcontexts/startgame.js';

import { Completion } from '$lib/console/completion.js';
import { NumberMatcher, SideMatcher, WordMatcher } from '$lib/console/matchers.js';

// --- app stores

const map = getContext('map');
const furnishings = getContext('furnishings');
const trialPoster = getContext('trialPoster');

// The following require a provider connection
const arena = getContext('arena');
const eventParser = getContext('eventParser');
const guardian = getContext('guardian');

// --- constants
const log = getLogger('PageGameCommands')
const metadataURL = '/api/nftstorage/metadata';
// --- data imports
// --- component properties
export let showMapGenerator = false;
// --- component state properties
const commands = new CodeMirrorCommandSet();

const createGameCmd = new CreateGameCommandCtx({fetch});
commands.append(
  new Completion(
    {phrase:'create game for \{${count}\} players', prefix:'create game'},
    new NumberMatcher("count")),
  createGameCmd.exec.bind(createGameCmd)
);

const joinGameCmd = new JoinGameCommandCtx();
commands.append(
  new Completion(
    {phrase:'join game \{${id}\} as \{${nickname}\}', prefix:'join game'},
    new NumberMatcher("id"), new WordMatcher("nickname")),
  joinGameCmd.exec.bind(joinGameCmd)
);

const setStartCmd = new SetStartCommandCtx();
commands.append(
  new Completion(
    {phrase:'set start for player \{${index}\} in game \{${id}\} to location \{${location}\}', prefix:'set start for player'},
    new NumberMatcher("index"), new NumberMatcher("id"), new NumberMatcher("location")),
  setStartCmd.exec.bind(setStartCmd)
);

const startGameCmd = new StartGameCommandCtx(setStartCmd);
commands.append(
  new Completion(
    {phrase:'start game \{${id}\}', prefix:'start game'},
    new NumberMatcher("id")),
  startGameCmd.exec.bind(startGameCmd)
);


/**
   let completions = [
    snippetCompletion(
      'create game for \{${count}\} players',
        {label: "create game", type: "keyword", custom: "xxx"}),
    snippetCompletion(
      'select game \{${number}\}',
        {label: "select game", type: "keyword"}),
    snippetCompletion(
      'join game \{${number}\} as \{${nickname}\}',
        {label: "join game", type: "keyword"}),
    snippetCompletion(
      'start game',
        {label: "start game", type: "keyword"}),

    snippetCompletion(
      'use exit \{${number}\} on the \{${side}\}',
        {label: "use exit", type: "keyword"}),

    snippetCompletion(
      'open chest \{${number}\}',
        {label: "open chest", type: "keyword"})

  ]
 */

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
  console.log('completion event');
  console.log(JSON.stringify(value.detail))
  console.log('arena:', $arena);
  console.log('eventParser:', $eventParser);
  console.log('guardian:', $guardian);

  const result = commands.match(value.detail);
  if (!result) {
    console.log(`no match for ${value.detail}`);
    return;
  }
  const {completion, callback} = result;
  callback(completion.result).then((result)=>{
    console.log(`${completion.prefix} done`);
    console.log(`${JSON.stringify(result)}`);
  });
}

// --- command handlers
/**
 * 
 * @param {{codexPassword?:string,networkEIP1559?:boolean}} options
 */
async function cmdCreateTrial(phrase, options={}) {


  const c = new Completion(
    {phrase: 'create game for \{${count}\} players', prefix:'create game'},
    new NumberMatcher("count")
  );
  const ok = c.match(phrase);
  if (!ok) {
    console.log(`failed to match phrase: ${phrase}`);
    return;
  }
  return await createGameCmd.exec(c.result);
}

</script>
<BottomBar completions={commands.snippetCompletions()} on:onNewline={onComplete} bind:bottomNavCreateToggle={showMapGenerator}/>
<style>
</style>