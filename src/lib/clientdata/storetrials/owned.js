// This store contains the most recent trials created by the current signer
import { derived } from "svelte/store";
import { defaultChainPollMS } from "./const.js";
import { findOwnedGames } from "../../chaintrap.js";

export const defaultOptions = {
  pollIntervalMS: defaultChainPollMS,
  capacity: 5,
  incomplete: true
}

/**
 * @param {{subscribe:Function}} eventParser
 * @param {{pollIntervalMS:Number, capacity: Number}} options
 */
export function newOwnerTrials(eventParser, options={...defaultOptions}) {

  return derived(eventParser, ($eventParser, set) => {
  
    // Fill it imediately
    findOwnedGames($eventParser, options.capacity).then(set)

    // Regular refresh
    const id = setInterval(async ()=>{
      set(await findOwnedGames($eventParser, options.capacity, {incomplete:options.incomplete}));
    }, options.pollIntervalMS);

    return () => clearInterval(id);
  },
  [] // initialise as empty list
  );
}