import { derived } from "svelte/store";
import { ABIName } from "@polysensus/chaintrap-arenastate";

/**
 * @param {*} orderedFeed a store providing ordered feed of events from a single
 * game
 * @returns list of trialist registration events in the order they occured
 */
export function newRegistrations(orderedFeed) {
  return derived(orderedFeed, ($ordered) => {

    // Notice: it is important that registration order is preserved, as we rely
    // on this to set the start positions.
    const registrations = [];
    for (const entry of $ordered) {
      switch (entry.arenaEvent.name) {
        case ABIName.TranscriptRegistration:
          // registrations.push(registrationFromEntry(entry));
          registrations.push(entry);
          break;
        case ABIName.TranscriptStarted:
          return registrations; // can't be any more registrations
      }
    }
    return registrations;
  });
}