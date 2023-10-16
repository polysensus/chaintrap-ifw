<script>
  import { createEventDispatcher } from 'svelte';
  import { Button, Textarea, Card } from 'flowbite-svelte';
  import { twMerge } from 'tailwind-merge';
  export let prompt = "A stylised icon representing a turn based random dungeon crawler game";

  export let img = undefined;

  export let id = {
    icon: 'GenerateGameIconCard-Icon',
    clickGenerate: `GenerateGameIconCard-ClickGenerate`
  }

  const dispatch = createEventDispatcher();

  function dispatchGenerateGameIcon() {
    dispatch("onGenerateGameIcon", {
      id: id.icon,
      prompt
    })
  }

  // --- component state properties
  let horizontal = true;
  let imgClass = '';
  $: imgClass = twMerge(
    'offset1',
    // reverse ? 'rounded-b-lg' : 'rounded-t-lg',
    horizontal && 'object-cover h-96 w-full'
    // horizontal && (reverse ? 'md:rounded-r-lg' : 'md:rounded-l-lg')
  );
  let innerPadding = 'max-w-lg'; // md
  // --- svelte bound variables
</script>
<div class="flex justify-center">
<div class='max-w-lg'>
<div class="card">
  <Card {img} href="." horizontal>
    <div class={innerPadding}>
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Create trial poster 
      </h5>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
        Describe the image you want to represent a trial in your dungeon
      </p>
      <Textarea class="mb-4" bind:value={prompt}>
        <div slot="footer" class="flex items-center justify-between">
          <Button
            on:click={dispatchGenerateGameIcon}
            id={id.clickGenerate}
            >Generate</Button>
        </div>
      </Textarea>
    </div>
  </Card>
</div>
</div>
</div>
