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
/**
 * @type {{request:{href?:string,origin?:string}}}
 */
export let data; // see +page.js:load
setContext('data', data);


// --- constants
const log = getLogger('+page');
// --- data imports
// --- component properties

let icon;
let address = data.page.address;
let createdGames = Object.values(data.page.createdGames);
let numCreated = createdGames.length;
let gameRegistrations = Object.values(data.page.gameRegistrations);
let gameDeaths = Object.values(data.page.gameDeaths);
let numDeaths = gameDeaths.length;
let numVictories = Object.values(data.page.narratorVictories);
// we count incomplete games as 'bad maps', this means having lots of open games
// looks bad. But it is normal to have a one or two. So we cap it
const concurrentRunsAllowed=2;
let numRunning = Object.values(data.page.incompleteGames).length;
let numBadMaps = 0;
if (numRunning > concurrentRunsAllowed)
  numBadMaps = numRunning - concurrentRunsAllowed;

let numRegistrations = gameRegistrations.length;

// --- component state properties
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
	  <table class="table table-hover">
		<tbody>
				<tr>
					<td>
            <span bind:this={container} class="badge variant-ghost gap-2"></span>
          </td>
					<td>
            <button type="button" class= "btn variant-ghost" use:clipboard={address}>{address}</button> 
          </td>
				</tr>
		</tbody>
    </table>

<p>Stats as narrator</p>
<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<tbody>
				<tr>
					<td>Trials Created</td>
					<td>{numCreated}</td>
				</tr>
				<tr>
					<td>Bad Maps (Incomplete Trials)</td>
					<td>{numBadMaps}</td>
				</tr>
				<tr>
					<td>Trials Running</td>
					<td>{numRunning}</td>
				</tr>
        <tr>
          <td>Trial Victories</td>
          <td>{numVictories.length}</td>
        </tr>
		</tbody>
</div>

<p>Stats as raider</p>
<div class="table-container">
	  <table class="table table-hover">
		<tbody>
			  <tr>
					<td>Raids Joined</td>
					<td>{numRegistrations}</td>
				</tr>
				<tr>
					<td>Raid Victories</td>
					<td>{numCreated}</td>
				</tr>
				<tr>
					<td>Grisly Deaths</td>
					<td>{numDeaths}</td>
				</tr>
		</tbody>

    <!--
		<tfoot>
			<tr>
				<th colspan="3">summary stuff</th>
				<td>{1223}</td>
			</tr>
		</tfoot>
    -->
	</table>
</div>
<!--
<dl class="list-dl">
	<div>
    <div class="relative inline-block">
      <span class="badge-icon variant-filled-warning absolute -top-0 -right-0 z-10">{numCreated}</span>
      <Avatar initials="Created"></Avatar>
    </div>
		<span class="flex-auto">
      {#each createdGames as g}
			<dt>Created</dt>
			<dd>{createdGames.length}</dd>
        {g.subject} {ethers.BigNumber.from(g.gid).toHexString()}
      {/each}
		</span>
	</div>
</dl>
      -->
<style>
</style>