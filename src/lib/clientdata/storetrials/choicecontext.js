// This file
import { ABIName } from "@polysensus/chaintrap-arenastate";
// --- lib imports
// --- framework imports
import { derived } from "svelte/store";
// --- app imports
import { getLogger } from '$lib/log.js'
// --- app store imports
// --- const definitions
const log = getLogger('choicecontext')
// --- global definitions (discouraged)

/**
 * 
 * @param {*} feed 
 * @param {*} walletAddress 
 * @param {{feedLIFO?:boolean}} opts 
 * @returns 
 */
export function newChoiceContext(feed, walletAddress, opts) {

  if (!(feed && walletAddress)) return;

  return derived([feed, walletAddress], ([$feed, $walletAddress]) => {
    if (!feed) return {};

    let choices, committed, outcome;

    // feed is order of occurrence, here we want to process it in LIFO order.
    for (let entry of (opts?.feedLIFO ? $feed : $feed.toReveresed())) {
      if (entry.address !== $walletAddress) continue;
      switch (entry.arenaEvent.name) {
        case ABIName.TranscriptEntryChoices: {
          choices = entry;
          let pending = !(committed || outcome)
          return {eid: entry.eid, choices, committed, outcome, pending}
        }
        case ABIName.TranscriptEntryCommitted: {
          committed = entry;
          break;
        }
        case ABIName.TranscriptEntryOutcome: {
          outcome = entry;
          break;
        }
      }
    }
  })
}