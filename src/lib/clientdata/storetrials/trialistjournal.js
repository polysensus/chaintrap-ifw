// a view of the journal from the perspective of a single trialist
import { derived } from "svelte/store";

export class JournalEntry {

}

export function newTrialistJournal(trialist) {

  return derived(trialist, ($trialist, set) => {

  });
}