<script>
  import { blur, fade, slide } from 'svelte/transition';
  import { Avatar, Button, Dropdown, DropdownDivider, Chevron } from 'flowbite-svelte';
  import DropdownItemConnector from '$lib/components/atoms/DropdownItemConnector.svelte';

  /**
   * @type {{name:string, chainId:string, ticker?:string, img?:string, imgAlt?:string}[]} x
   */
  export let providers;

  /**
   * @type string
   */
  export let selected = '';

  // @type string
  export let buttonText;

  // @type boolean
  export let showButton = false;
  export let triggeredBy = "#providers-toggle";
  export let width = "w-full";

  export let cfg;

  $: {
    updateSelection(selected);
  }

  function handleClick(item) {
    updateSelection(typeof item !== 'undefined' && item?.name === selected ? '' : item.name);
  }

  function updateSelection(name) {
    cfg = undefined;
    selected = '';
    buttonText = 'Connect';
    if (name === '') return;

    for (let i = 0; i < providers.length; i++)
      if (providers[i].name === name) {
        cfg = providers[i];
        selected = name;
        buttonText = `${selected}:${cfg.chainId}`;
        break;
      }
    if (typeof cfg === 'undefined') throw new Error(`bad selection for ${name}`);
  }
</script>

{#if showButton}
  <Button class="w-40"><Chevron>{buttonText}</Chevron></Button>
{/if}
<Dropdown class="{width} z-20" triggeredBy={triggeredBy} transition={slide} params={{duration: 300}}>
  <div slot="header">
    <!-- (typeof selected !== 'undefined' && selected !== "" && selectedChainId !== "") --->
    {#if typeof cfg !== 'undefined'}
      {#if cfg.img}
        <Avatar src={cfg.img} alt={cfg.imgAlt ?? 'network connector icon'} class="flex-shrink-0" />
      {/if}
      <div class="flex items-center space-x-4 min-w-30 m-4">
        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
          Connected to {cfg.name}. Chain Id {cfg.chainId}
        </p>
      </div>
    {:else}
      <div class="flex items-center space-x-4 min-w-30 m-4">
        <p class="break-words text-sm font-medium text-gray-900 truncate dark:text-white">
          Please select a network provider bellow.
        </p>
      </div>
    {/if}
  </div>
  <DropdownDivider />
  {#each providers as item}
    <DropdownItemConnector
      {item}
      {width}
      onClick={() => handleClick(item)}
      selected={item.name === selected}
    />
  {/each}
</Dropdown>
