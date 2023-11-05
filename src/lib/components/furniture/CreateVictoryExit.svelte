<script>

// framework imports
import { onMount } from 'svelte';
import { createEventDispatcher } from 'svelte';

// framework components
import { ButtonGroup, SpeedDial, SpeedDialButton } from 'flowbite-svelte';

// lib imports
import { getLogger } from '$lib/log.js'

// --- constants
const log = getLogger('CreateVictoryExit#');

// constants
const dispatch = createEventDispatcher();

const North = 'North';
const West = 'West';
const South = 'South';
const East = 'East';

const sides = { North: 0, West: 1, South: 2, East: 3 }
const sideNumbers = {0: "North", 1: "West", 2: "South", 3: "East"}

// --- component properties
export let exitCounts = [0, 0, 0, 0]; // a count for each side

/** @type {{side:number,exit:number}} */
export let data = {side:0, exit:0};

export let placement = 'top';

// --- component state properties
let open = false;
let sideName = sideNumbers[`${data.side}`];

$: sideName = sideNumbers[data.side]

/**
 * @param {string} which
 */
 function onClickSide(which) {

  console.log(`CreateVictoryExit# onClickSide: ${which}`);

  const selection = whichToSelection(which);
  if (!selection)
    return;

  dispatch('validSelection', selection);
}

/**
 * @param {string} which
 */
function whichToSelection(which) {
  // @ts-ignore
  let side = sides[which];

  data = {side, exit:exitCounts[side]}
  if(!data.side)
    return;

  return {
      // @ts-ignore
      sideName: sideNumbers[side],
      type: "finish_exit",
      choiceType: "finish_exit",
      labels: ["victory_condition"],
      data};
}

onMount(async () => {

  console.log(`asdfasd fasdfasdf`);

  // When the component mounts, its due to a create or to a change of type. In
  // both instances that represents a valid selection. So we dispatch on mount.
  onClickSide(sideName);

});


</script>

<ButtonGroup outline>
<SpeedDial outline bind:open defaultClass="flex" pill={false} tooltip="none" name="">
  <div slot="icon">
    {sideName}
  </div>
  <SpeedDialButton on:click={()=> onClickSide(North)} name={North}/>
  <SpeedDialButton on:click={()=> onClickSide(West)} name={West}/>
  <SpeedDialButton on:click={()=> onClickSide(South)} name={South}/>
  <SpeedDialButton on:click={()=> onClickSide(East)} name={East}/>
</SpeedDial>

<!-- finish exits need to be automatically placed on the chosen side to avoid
conflicting with real exits -->

</ButtonGroup>
<style>
</style>