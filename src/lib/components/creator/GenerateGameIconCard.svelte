<script>
  import { createEventDispatcher } from 'svelte';

  export let prompt = "A stylised icon representing a turn based random dungeon crawler game";

  /** @type {string|undefined}*/
  export let img = undefined;

  let cardVariant = 'variant-ghost';
  let btnClass =  "btn variant-ghost";


  export let id = {
    icon: 'GenerateGameIconCard-Icon',
    clickGenerate: `GenerateGameIconCard-ClickGenerate`
  }

  const dispatch = createEventDispatcher();

  function dispatchGenerateGameIcon() {
    console.log(`dispatching prompt: ${prompt}`);
    dispatch("onGenerateGameIcon", {
      id: id.icon,
      prompt
    })
  }
</script>

<div class="card {cardVariant} card-hover overflow-hidden">
  <header>
    {#if img}
    <img src={img} class="bg-black/50 w-full aspect-[1/1]" alt="Trial Poster" /> 
    {/if}
  </header>
  <div class="p-4 space-y-4">
    <p class="mb-3 text-gray-700 dark:text-gray-400 leading-tight">
      Describe the image you want to represent a trial in your dungeon
    </p>
    <textarea class="textarea" placeholder={prompt} bind:value={prompt}></textarea>
  </div>
  <hr class="opacity-50"/>
  <footer class="p-4 flex justify-center items-center space-x-4">
      <button
        class={btnClass}
        on:click={dispatchGenerateGameIcon}
        id={id.clickGenerate}
        >Generate</button>
  </footer>
</div>