<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { Button, Popover } from 'flowbite-svelte';

	// import { selectedAsset } from '$lib/stores/assets.js';
	export let viewName;
	export let trials;
	export let showId = true;

  export let selected;

  function selectTrial(trial) {
    selected = trial;
  }

  function identityAbbrev(gid) { return gid.toHexString().slice(0, 8); }
</script>

{#if trials.length}
	<Table>
		<TableHead>
			<TableHeadCell>Trial Title</TableHeadCell>
			{#if showId}
				<TableHeadCell>ID</TableHeadCell>
			{/if}
			<TableHeadCell>Description</TableHeadCell>
		</TableHead>
		<TableBody class="divide-y">
			{#each trials as trial, i (trial.gid)}
				<TableBodyRow>
					<TableBodyCell>
						<Button on:click={() => (selectTrial(trial))}>{trial.metadata.name}</Button>
					</TableBodyCell>
					{#if showId}
						<TableBodyCell>
							<Button id="b1" outline={true} disabled>{identityAbbrev(trial.gid)}</Button>
							<Popover class="w-96 text-sm font-light " triggeredBy="#b1">
								{trial.gid.toHexString()}
							</Popover>
						</TableBodyCell>
					{/if}
					<TableBodyCell>{trial.metadata.description}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{:else}
	<p>no trials to show for {viewName}</p>
{/if}
