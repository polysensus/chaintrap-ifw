// a view of the journal from the perspective of the trialists
import { derived } from "svelte/store";
import { Trialist } from "@polysensus/chaintrap-arenastate";

export function newTrialistJournal(eventDispatcher, updatedCallback = undefined) {
  return derived(eventDispatcher, ($eventDispatcher) => {
    if (!$eventDispatcher) return undefined;
    return new Trialist($eventDispatcher.parser, {
      dispatcher:$eventDispatcher, updated:updatedCallback})
  });
}