<script>
// --- lib deps
import {ethers} from 'ethers';
import {
  gameInstance, ipfsGatewayURL
} from '@polysensus/chaintrap-arenastate';
// --- framework
import { setContext } from 'svelte';
// --- external components
// --- components
// --- app lib
import { getLogger } from '$lib/log.js'
// --- app stores
// --- constants
const log = getLogger('+page')
// --- data imports
export let data; // see +page.js:load
setContext('data', data);

// --- component properties
let openTrials = data.page.openTrials;
// --- component state properties
// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers
</script>

<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>id</th>
				<th>Spaces</th>
				<th>Registrants</th>
				<th>Creator</th>
        <!--
				<th>chainId</th>
        -->
        <th>Actions</th>
        <th>Transaction Browser</th>
        <th>Content</th>
			</tr>
		</thead>
		<tbody>
			{#each openTrials as row, i}
        {@const gid = ethers.BigNumber.from(row.gid)}
        {@const id = gameInstance(gid)}
				<tr>
					<td>{id}</td>
					<td>{row.trial.registration.registrationLimit - row.trial.registration.registrations.length}</td>
					<td>
            <nav class="list-nav">
              <!-- (optionally you can provide a label here) -->
              <ul>
                {#each row.trial.registration.registrations as reg}
                <li>
                  <a href={`/stats/accounts/${reg.address}/${row.chain.name}`}>
                    <span class="badge variant-ringed">{reg.profile.nickname}</span>
                    <span class="flex-auto">{reg.address}</span>
                  </a>
                </li>
                {/each}
                <!-- ... -->
              </ul>
            </nav>
 
          </td>
					<td>
            <a href={`/stats/accounts/${row.trial.created.subject}/${row.chain.name}`}>
              <span class="badge variant-ringed">{row.trial.created.subject}</span>
            </a>
          </td>
          <!--
					<td> <span class="badge bg-primary-500">{row.chainId}</span> </td>
          -->
					<td>
            <nav class="list-nav">
              <!-- (optionally you can provide a label here) -->
              <ul>
                <li>
                  <a href={`/trial/raiding/${id}/${row.chain.name}`}>
                    <span class="badge variant-ringed">{row.chainId}</span>
                    <span class="flex-auto badge variant-ringed-primary">Raid</span>
                  </a>
                </li>
                <li>
                  <a href={`/trial/raiding/${id}/${row.chain.name}`}>
                    <span class="badge variant-ringed">{row.chainId}</span>
                    <span class="flex-auto badge variant-ringed">Narrate</span>
                  </a>
                </li>
                <!-- ... -->
              </ul>
            </nav>
          </td>
					<td>
            {#if !row.chain.etherscanUrl}
              <span class="badge variant-ringed">{row.chain.arenaProxy}</span>
            {:else}
              <a href={`${row.chain.etherscanUrl}/address/${row.chain.arenaProxy}`}>
                <span class="badge variant-ringed">{row.chain.arenaProxy}</span>
              </a>
            {/if}
          </td>
					<td>
            <nav class="list-nav">
              <!-- (optionally you can provide a label here) -->
              <ul>
                <li>
                  {#if row.trial.metadataURL}
                  <a href="{ipfsGatewayURL(row.trial.metadataURL)}">
                    <span class="flex-auto badge variant-ringed">Metadata</span>
                  </a>
                  {:else}
                    <span class="flex-auto badge variant-ringed">Metadata Not Found</span>
                  {/if}
                </li>
                <!-- ... -->
              </ul>
            </nav>
          </td>
	
				</tr>
			{/each}
		</tbody>
		<tfoot>
      <!--
			<tr>
				<th colspan="3">Calculated Total Weight</th>
				<td>{totalWeight}</td>
			</tr>
      -->
		</tfoot>
	</table>
</div>