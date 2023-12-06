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
const log = getLogger('TrialistAvatarStatusBadge')
// --- data imports
// --- component properties
export let nickname;
export let address;
// --- component state properties
let icon;
let initials;
$: initials = nameInitials(nickname);

// --- svelte bound variables
let container;
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
<span bind:this={container} class="badge variant-ghost gap-2">{initials}</span>