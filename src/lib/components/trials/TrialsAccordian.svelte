<script>
	import { AccordionItem, Accordion } from 'flowbite-svelte';
	import TrialsTable from '$lib/components/trials/TrialsTable.svelte';
	export let trials;
	export let showId = true;
</script>

<Accordion>
	<AccordionItem>
		<span slot="header">Trials (Available: {trials?.length ?? 0})</span>
		<TrialsTable {trials} viewName="trials view" {showId} />
	</AccordionItem>
</Accordion>
