// This store contains the most recent trials created by the current signer
import { filterTrials, findTranscriptEvent, ABIName } from "@polysensus/chaintrap-arenastate";
import { derived } from "svelte/store";

export const defaultOptions = {
  pollIntervalMS: 1000,
  capacity: 5,
  incomplete: true
}

/**
 * Find trials for the provided owner that have not been started 
 * @param {any} eventParser 
 * @param {number} limit 
 * @returns {Promise<number[]|import("ethers").BigNumber[]>}
 */
async function findStartableTrials(eventParser, limit) {

  const owner = await eventParser?.contract?.signer?.getAddress();
  if (!owner) return [];

  return await filterTrials(eventParser, async (ev) =>{
      if (ev.subject !== owner) return false;
      const found = await findTranscriptEvent(eventParser.contract, ev.gid, ABIName.TranscriptStarted, { unique: true});
      return typeof found === undefined;
  }, limit);
}

/**
 * @param {{subscribe:Function}} eventParser
 * @param {{pollIntervalMS:Number, capacity: Number}} options
 */
export function newStartableTrials(eventParser, options={...defaultOptions}) {

  return derived(eventParser, ($eventParser, set) => {
  
    // Fill it imediately
    findStartableTrials($eventParser, options.capacity).then(set)

    // Regular refresh
    const id = setInterval(async ()=>{
      set(await findStartableTrials($eventParser, options.capacity));
    }, options.pollIntervalMS);

    return () => clearInterval(id);
  },
  [] // initialise as empty list
  );
}