<script>
// --- lib deps
// --- framework
import { setContext, onMount } from "svelte";
import { clipboard } from '@skeletonlabs/skeleton';
// --- external components
// --- components
// --- app lib
import { getLogger } from '$lib/log.js'
import { ethers } from "ethers";
import {addressIcon} from '$lib/components/avatars/avatars.js';
// --- app stores
/**
 * @type {{request:{href?:string,origin?:string}}}
 */
export let data; // see +page.js:load
setContext('data', data);


// --- constants
const log = getLogger('+page');
// --- data imports
// --- component properties

let gid = data.page.gid; // gid hex
let started = data.page.started;
let completed = data.page.completed;
let registrations = data.page.registrations;
let halted = data.page.halted;
let victor = data.page.victor;
let narratorVictory = data.page.narratorVictory;
let namedRegistrations = {};
for (const reg of Object.values(registrations))
  namedRegistrations[reg.profile.nickname] = reg;

let narratingUrl = `/trial/narrating/${gid}/${data.page.chain}`;
let raidingUrl = `/trial/raiding/${gid}/${data.page.chain}`;

// --- component state properties
// --- svelte bound variables
// --- svelte lifecycle callbacks
// test support hook
onMount(async () => {
  // if (!creator)
  //   creator = refreshIcon(victorIcon, victor);

})

// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers
function accountStatsUrl(address) {
  return `/stats/accounts/${address}/${data.page.chain}`
}

</script>
	  <table class="table table-hover">
		<tbody>
        <tr> <td>Started</td> <td>{started ? "yes" : "no"}</td> </tr>
        {#if (completed && victor)}
        <tr>
          <td>Victor</td>
          <td><button type="button" class= "btn variant-ghost" use:clipboard={victor}>{victor}</button> 
				      <a data-sveltekit-preload-data="tap" class="btn variant-ghost" href={accountStatsUrl(victor)} >
               Stats </a></td>
        </tr>
        <tr> <td>Narrator Victory</td> <td>{narratorVictory ? "yes" : "no"}</td> </tr>
        <tr>
            <td>Captured Raiders</td>
            <td>
            {#each halted as address}
              <button type="button" class= "btn variant-ghost" use:clipboard={address}>{address}</button>
				      <a data-sveltekit-preload-data="tap" class="btn variant-ghost" href={accountStatsUrl(address)} >
               Stats </a>
 
            {/each}
            <!-- {narratorVictory ? "yes" : "no"} -->
            </td>
        </tr>
        {/if}
        <tr> <td>Complete</td> <td>{completed ? "yes" : "no"}</td> </tr>
		</tbody>
		<tfoot>
			<tr>
				<th colspan="1"></th>
				<td >
				  <a data-sveltekit-preload-data="tap" class="btn btn-sm variant-ghost-surface" href={narratingUrl} >
           Narrative View </a>
				  <a data-sveltekit-preload-data="tap" class="btn btn-sm variant-ghost-surface" href={raidingUrl}>
           Raid View </a>
        </td>
        <td>
       </td>
			</tr>
		</tfoot>
    </table>
<style>
</style>