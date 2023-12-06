import { derived } from "svelte/store";
import { ABIName } from "@polysensus/chaintrap-arenastate";

/**
 * @param {*} orderedFeed a store providing ordered feed of events from a single
 * game
 * @returns a boolean indicating if the game has been started
 */
export function newStarted(orderedFeed) {
  return derived(orderedFeed, ($ordered) => {

    for (const entry of $ordered) {
      if (entry.arenaEvent.name === ABIName.TranscriptStarted)
        return true;
    }
    return false;
  })

}