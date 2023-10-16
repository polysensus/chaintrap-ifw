// This store contains the most recent trials created by the current signer
import { findGames } from "@polysensus/chaintrap-arenastate";
import { derived } from "svelte/store";

export const defaultOptions = {
  pollIntervalMS: 1000,
  capacity: 5
}

async function findOwnedGames(eventParser, limit) {

  const owner = await eventParser?.contract?.signer?.getAddress();
  if (!owner) return [];

  const logs = await findGames(eventParser.contract);
  if (!logs || logs.length === 0) return [];
  let gids = [];

  for (const log of logs) {
    const ev = eventParser.parse(log);
    if (ev.subject !== owner) continue;
    gids.push(ev.gid);
  }

  gids = gids.slice(-limit);

  gids.sort((a, b)=>{return Number(a) - Number(b)})

  return gids;
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
      set(await findOwnedGames($eventParser, options.capacity));
    }, options.pollIntervalMS);

    return () => clearInterval(id);
  },
  [] // initialise as empty list
  );
}