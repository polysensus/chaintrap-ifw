<script>
  import { Drawer, CloseButton } from 'flowbite-svelte';
  import { sineIn } from 'svelte/easing';
  import GenerateMapCard from '$lib/components/creator/GenerateMapCard.svelte';

  export let mapParams = {};
  export let onClickGenerate = ({}) => {};

  export let hidden = true;

  // let activateClickOutside = false
  let backdrop = false;
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn
  };
</script>

<Drawer width="w-full" {backdrop} transitionType="fly" {transitionParams} bind:hidden id="sidebar10">
  <div class="flex items-center">
    <CloseButton on:click={() => (hidden = true)} class="mb-4 dark:text-white" />
  </div>

  <div class="grid grid-rows-5 grid-cols-6 grid-flow-col gap-1">
  <div class="row-span-5 col-span-6">
    <GenerateMapCard bind:params={mapParams} {onClickGenerate} />
  </div>
  </div>
</Drawer>