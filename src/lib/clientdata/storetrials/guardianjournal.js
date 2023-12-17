// a view of the journal from the perspective of the guardian
import { derived } from "svelte/store";
import { Guardian } from "@polysensus/chaintrap-arenastate";

export function newGuardianJournal(eventDispatcher, updated = undefined) {
  return derived(eventDispatcher, ($eventDispatcher) => {
    if (!$eventDispatcher) return undefined;
    return new Guardian($eventDispatcher.parser, {dispatcher:$eventDispatcher, updated});
  });
}