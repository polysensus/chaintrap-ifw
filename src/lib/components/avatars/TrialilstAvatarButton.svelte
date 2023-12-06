<script>
// --- lib deps

// --- framework
import { onMount/*, setContext, getContext, onDestroy*/ } from 'svelte'
// --- external components
// --- components
// --- app lib
import { getLogger } from '$lib/log.js'
import {addressIcon, nameInitials} from './avatars.js';
// --- app stores
// --- constants
const log = getLogger('TrialilstAvatar')
// --- data imports
// --- component properties
export let startIndex;
export let nickname;
export let address;
export let iconSize = 41;
// --- component state properties
let container;

let icon;
// $: icon = addressIcon(address);
let initials;
$: initials = nameInitials(nickname);

// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
onMount(async () => {
  icon = refreshIcon(icon, address);
})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers

function refreshIcon(icon, address) {
  if (icon)
    container.removeChild(icon);
  const newIcon = addressIcon(address);
  container.appendChild(newIcon);
  return newIcon;
}

</script>
<button class="btn btn-sm variant-ghost-surface gap-3 ">
  {initials}
<div class="relative inline-block">
<span class="badge-icon variant-filled-warning absolute -top-0 -right-0 z-10">{startIndex}</span>
<button bind:this={container} class="btn-icon btn-sm variant-soft">
</button>
</div>
</button>

<!--<span>{startIndex} {nickname} {address}</span> -->
<!--<Avatar initials={initials(nickname)}/> -->