// recently created trials which are open for participation (not started)
import { filterTrials } from "@polysensus/chaintrap-arenastate";
import { derived } from "svelte/store";

import { defaultChainPollMS } from "./const.js";

export const defaultOptions = {
  pollIntervalMS: defaultChainPollMS,
  capacity: 5
}

async function findRecentGames(eventParser, limit) {

  const owner = await eventParser?.contract?.signer?.getAddress();
  if (!owner) return [];

  return await filterTrials(eventParser, async (ev) =>{
      if (ev.subject !== owner) return false;
      return true;
  }, limit);
}

/**
 * @param {{subscribe:Function}} eventParser
 * @param {{pollIntervalMS:Number, capacity: Number}} options
 */
export function newRecentlyCreated(eventParser, options={...defaultOptions}) {

  return derived(eventParser, ($eventParser, set) => {
  
    // Fill it imediately
    findRecentGames($eventParser, options.capacity).then(set)

    // Regular refresh
    const id = setInterval(async ()=>{
      set(await findRecentGames($eventParser, options.capacity));
    }, options.pollIntervalMS);

    return () => clearInterval(id);
  },
  [] // initialise as empty list
  );
}