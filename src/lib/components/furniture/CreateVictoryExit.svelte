<script>
import { ButtonGroup, SpeedDial, SpeedDialButton } from 'flowbite-svelte';
import { getLogger } from '$lib/log.js'

// --- constants
const log = getLogger('CreateRoomFurnishing')
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

/**
 * 
 * @param {{sideName:string, type:string, choiceType:string, labels: string[], data:{side:number,exit:number}}} value
 */
export let validSelection = async (value) => {}

// --- component state properties
let open = false;
let sideName = sideNumbers[`${data.side}`];
let exitsOpen = false;
let sideExitCount = 0;

$: sideName = sideNumbers[data.side]

/**
 * @param {string} which
 */
 async function onClickSide(which) {
  let side = sides[which];
  
  data = {side, exit:exitCounts[side]}
  open = false;
  if(data.side && validSelection)
    await validSelection({
      sideName,
      type: "finish_exit",
      choiceType: "finish_exit",
      labels: ["victory_condition"],
      data})

}
</script>

<ButtonGroup>
<SpeedDial bind:open defaultClass="flex" pill={false} tooltip="none">
  <div slot="icon">
    {sideName}
  </div>
  <SpeedDialButton on:click={async ()=> await onClickSide(North)} name={North}> </SpeedDialButton>
  <SpeedDialButton on:click={async ()=> await onClickSide(West)} name={West}> </SpeedDialButton>
  <SpeedDialButton on:click={async ()=> await onClickSide(South)} name={South}> </SpeedDialButton>
  <SpeedDialButton on:click={async ()=> await onClickSide(East)} name={East}> </SpeedDialButton>
</SpeedDial>

<!-- finish exits need to be automatically placed on the chosen side to avoid
conflicting with real exits -->

</ButtonGroup>
<style>
</style>