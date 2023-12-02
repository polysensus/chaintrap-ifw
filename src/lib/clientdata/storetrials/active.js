// This store maintains the set of games the guardian is actively listenting to
// This includes all games that are not completed, including those that are not
// started yet.
import { ethers } from "ethers";
import { derived } from "svelte/store";
import { isUndefined, filterTrials, findTranscriptEvent, ABIName, CODEX_INDEXED_ITEMS } from "@polysensus/chaintrap-arenastate";
import {BlobCodex} from '@polysensus/blobcodex';

import { defaultChainPollMS } from "./const.js";

export const defaultOptions = {
  pollIntervalMS: defaultChainPollMS,
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
async function findActive(eventParser, limit, options={}) {
  const owner = await eventParser?.contract?.signer?.getAddress();
  if (!owner) return [];

  return await filterTrials(eventParser, async (ev) =>{
      if (ev.subject !== owner) return false;
      const found = await findTranscriptEvent(eventParser.contract, ev.gid, ABIName.TranscriptCompleted, { unique: true});
      if (found !== undefined)
        return false;
      return true;
  }, limit);
}

async function findCompleted(eventParser, limit, options={}) {
  const owner = await eventParser?.contract?.signer?.getAddress();
  if (!owner) return [];

  return await filterTrials(eventParser, async (ev) =>{
      if (ev.subject !== owner) return false;
      const found = await findTranscriptEvent(eventParser.contract, ev.gid, ABIName.TranscriptCompleted, { unique: true});
      return !isUndefined(found);
  }, limit);
}

async function startListener(gid, guardian, presence) {

  if (guardian.trialIsListening(gid))
    return;

  console.log(`storetrials/active.js# starting gid: ${gid.toHexString()}`);

  const chain = presence?.providerSwitch?.current;
  if (!chain) {
    console.log(`chain not connected processing gid: ${gid}`);
    return;
  }

  const url = `/api/trials/${gid}/${chain}`;
  console.log(`fetching game metadata and trial setup from: ${url}`);

  const resp = await fetch(url);
  if (!resp.ok) {
    console.log(`bad status ${resp.statusText} for url ${url}`);
    return;
  }
  
  const metadata = await resp.json();
  const serialized = metadata?.properties?.trialsetup?.serialized;
  if (!serialized) {
    console.log(`no trialsetup on metadata at ${url}`);
    console.log(JSON.stringify(metadata));
    return;
  }

  // XXX: TODO the blob passwords are going to need to be plumbed in
  const codex = await BlobCodex.hydrate(
    serialized, [null], CODEX_INDEXED_ITEMS);

  await guardian.codexStartListening(codex, gid, {ikey:0}); // this is idempotent.
  return true;
}

// newActiveTrials creates a store which maintains the guardian listening set of trials
export function newActiveTrials(guardian, presence, options={...defaultOptions}) {

  return derived(guardian, ($guardian, set) => {
    if (!$guardian) return [];

    // Regular refresh
    const id = setInterval(async ()=>{
      const completed = await findCompleted($guardian.eventParser, options.capacity);
      for (const gid of completed) {
        console.log(`storetrials/active.js# guardian.stopListening(${gid.toHexString()})`);
        $guardian.stopListening(gid);
      }
      for (const gid of (await findActive($guardian.eventParser, options.capacity)))
        await startListener(gid, $guardian, presence)

      const listening = Object.keys($guardian.trials).map((value)=>ethers.BigNumber.from(value))
      set(listening);

    }, options.pollIntervalMS);

    return () => clearInterval(id);

  }, []);
}