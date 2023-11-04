// This store contains the most recent trials created by the current signer
import { findGames, findGameCompleted } from "@polysensus/chaintrap-arenastate";
import { derived } from "svelte/store";

export const defaultOptions = {
  pollIntervalMS: 1000,
  capacity: 5,
  incomplete: true
}

/**
 * 
 * @param {any} eventParser 
 * @param {number} limit 
 * @param {{incomplete?:boolean}} options 
 * @returns {Promise<number[]|import("ethers").BigNumber[]>}
 */
async function findOwnedGames(eventParser, limit, options={}) {

  const owner = await eventParser?.contract?.signer?.getAddress();
  if (!owner) return [];

  const logs = await findGames(eventParser.contract);
  if (!logs || logs.length === 0) return [];
  let gids = [];

  for (const log of logs) {
    const ev = eventParser.parse(log);
    if (ev.subject !== owner) continue;
    if (options?.incomplete) {
      // only return games which are not complete
      const found = await findGameCompleted(eventParser.contract, ev.gid);
      if (found !== undefined) {
        console.log(`game ${ev.gid} is completed`)
        continue;
      }
    }
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
      set(await findOwnedGames($eventParser, options.capacity, {incomplete:options.incomplete}));
    }, options.pollIntervalMS);

    return () => clearInterval(id);
  },
  [] // initialise as empty list
  );
}