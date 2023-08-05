<script>
// --- lib deps
// --- external components
import {
  Button,
  Card,
} from "flowbite-svelte";
import { twMerge } from 'tailwind-merge';
// --- components
// --- app lib
// import { getLogger } from '$lib/log.js'
// --- app stores
// --- constants
// const log = getLogger('CreateMap')
// --- data imports
// --- component properties
export let mapImg = "";

// --- component state properties
let reverse = false;
let horizontal = true;
let imgClass = "";
$: imgClass = twMerge(
    'offset1',
    // reverse ? 'rounded-b-lg' : 'rounded-t-lg',
    horizontal && 'object-cover h-96 w-full',
    // horizontal && (reverse ? 'md:rounded-r-lg' : 'md:rounded-l-lg')
  );
let innerPadding = "max-w-lg"; // md 
// --- svelte bound variables

// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// function getPixiApp() { return instance; }
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers

</script>
<style>
  .offset1 {
    position: relative;
    top: -80px;
    left: -110px;
    width: 300px;
  }
</style>
<div class="card">
  <!--
  <Card img="/content/gameicons/game-ico-1.png" href="/" horizontal reverse={hCard}>
  <Card imgClass="bg-left-top" img="/content/maps/map.svg" href="/" horizontal reverse={hCard}>
  -->
  <Card href="/" horizontal {reverse} >
    <img class={imgClass} src={mapImg} alt="" />
    <div class={innerPadding}>
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dungeon Trial Title</h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
      Some call to arms
    </p>
    </div>
  </Card>
  <!--<Toggle bind:checked={reverse} class="mt-4 italic dark:text-gray-500">Reverse</Toggle> -->
</div>