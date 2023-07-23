{#if showButton}
<Button class="w-40"><Chevron>{buttonText}</Chevron></Button>
{/if}
<Dropdown>
<div slot="header">
{#if (providers.length && selected)}
  {@const selectedItem = getSelected()}
  {#if selectedItem.img}
    <Avatar src={selectedItem.img} alt={selectedItem.imgAlt ?? "network connector icon"} class="flex-shrink-0"/>
  {/if}
  <div class="flex items-center space-x-4 min-w-0 m-4">
    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
      Connected to {selectedItem.name}. Chain Id {selectedItem?.chainId}
    </p>
  </div>
{:else}
  <div class="flex items-center space-x-4 min-w-0 m-4">
    <p class="break-words text-sm font-medium text-gray-900 truncate dark:text-white">
      Please select a network provider bellow.
    </p>
  </div>

{/if}
</div>
<DropdownDivider/>
{#each providers as item}
  <DropdownItemConnector {item} onClick={()=>handleClick(item)} selected={item.name === selected}></DropdownItemConnector>
{/each}
</Dropdown>

<script>
  import { Avatar, Button, Dropdown, DropdownDivider, Chevron } from 'flowbite-svelte';
  import DropdownItemConnector from '$lib/components/atoms/DropdownItemConnector.svelte';

  export let offset="18";

  /**
   * @type {{name:string, chainId:string, ticker?:string, img?:string, imgAlt?:string}[]} x
   */
  export let providers;

  /**
   * @type string
   */
  export let selected = "";

  // @type string
  export let buttonText = getButtonText();

  // @type boolean
  export let showButton = true;

  $: buttonText = getButtonText()

  function handleClick(item) {
    selected = item.name === selected ? "" : item.name;
    buttonText = getButtonText();
  }

  function getSelected() {
    for (let i=0; i<providers.length; i++)
      if (providers[i].name === selected && typeof selected !== 'undefined')
        return providers[i];
    return undefined;
  }

  function getButtonText() {
    const item = getSelected();
    if (!item)
      return "Connect";
    return `${item.name}:${item.chainId}`
  }

</script>