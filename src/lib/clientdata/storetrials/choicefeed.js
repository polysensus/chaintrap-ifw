import { ABIName } from "@polysensus/chaintrap-arenastate";
// --- lib imports
import { ethers } from "ethers";
// --- framework imports
import { derived } from "svelte/store";
// --- app imports
import { getLogger } from '$lib/log.js'
// --- app store imports
// --- const definitions
const log = getLogger('choicefeed');
export const STATUS_STARTED = 'started';
export const STATUS_PENDING = 'pending';
export const STATUS_COMMITTED = 'committed';
export const STATUS_VERIFIED = 'verified';
export const STATUS_COMPLETE = 'complete';

// --- global definitions (discouraged)
/**
 * 
 * @param {*} feed 
 * @param {*} walletAddress 
 * @param {{feedLIFO?:boolean}} opts 
 * @returns 
 */
export function newChoiceFeed(feed, walletAddress, opts) {

  if (!(feed && walletAddress)) return;

  return derived([feed, walletAddress], ([$feed, $walletAddress]) => {
    if (!($feed && $walletAddress)) return undefined;

    // log.debug(`feedLIFO(${opts?.feedLIFO}) choicefeed# updating for feed.length ${$feed.length}`)

    let addressFeeds = {};

    const addEntry = (feedEntry) => {

      const eid = feedEntry?.eid?.toNumber();
      if (typeof eid === 'undefined') return;

      const choiceFeed = addressFeeds[feedEntry.address] ?? {};
      let ent = choiceFeed[eid] ?? {
        eid: eid,
        address: feedEntry.address,
        nickname: feedEntry.state.nickname,
        arenaEvents: {}
      };
      ent.state = {...ent.state, ...feedEntry.state};
      // if (typeof ent.location === 'undefined')
      //   ent.location = parseInt(ent.state.location[0], 16)
      // else if (ent.location !== parseInt(ent.state.location[0], 16))
      //   throw new Error(`inconsistent locations ${ent.location} and ${parseInt(ent.state.location[0], 16)}`);
      // console.log(`LOCATION: ${ent.location} ${feedEntry.arenaEvent.name}`)

      switch (feedEntry.arenaEvent.name) {

        case ABIName.TranscriptEntryChoices: {
          const choices = [];
          for (let input of feedEntry.state.choices)
            choices.push(input.map((hex) => parseInt(hex, 16)));

          // ent.location = parseInt(feedEntry.arenaEvent.update.location[0]);
          // console.log(`choice location: ${feedEntry.arenaEvent.update.location} ${JSON.stringify(feedEntry.arenaEvent.update.location)} ${ent.location}`);
          ent.scene = feedEntry.arenaEvent.update.scene;
          ent.location = parseInt(ent.state.location[0], 16);
          ent.choices = choices;
          // console.log(`NEW CHOICES: ${JSON.stringify(choices)}`);
          ent.arenaEvents.choices = feedEntry;

          // console.log(`++++++ [${feedEntry.eid} @${ent.address}] Outcome Choices for ${ent.state.nickname} at ${ent.location}`);

          break;
        }
        case ABIName.TranscriptEntryCommitted: {
          ent.inputChoice = feedEntry.arenaEvent.update.inputChoice;
          ent.inputData = feedEntry.arenaEvent.update.data;

          ent.arenaEvents.committed = feedEntry;

          // console.log(`----- [${feedEntry.eid} @${ent.address}] Committed for ${feedEntry.state?.nickname} ${ent.state.nickname} at ${ent.state.location[0]}`);
          break;
        }
        case ABIName.TranscriptEntryOutcome: {
          ent.arenaEvents.outcome = feedEntry;

          // console.log(`----- [${feedEntry.eid} @${ent.address}] Outcome for ${feedEntry.state?.nickname} ${ent.state.nickname} at ${ent.state.location[0]}`);
          break;
        }
        case ABIName.TranscriptParticipantHalted: {
          ent.halted = true;
          // console.log(`----- [${feedEntry.eid} @${ent.address}] ${feedEntry.state?.nickname} halted at ${ent.state.location[0]}`);
          break;
        }
      }

      choiceFeed[eid] = ent;
      addressFeeds[feedEntry.address] = choiceFeed;
    }

    let createdEntry;
    let victoryTransfer;
    let raidCompletion;
    let uriEntry;

    // for (let feedEntry of (opts?.feedLIFO ? $feed.toReversed() : $feed)) {
    for (let feedEntry of $feed) {

      if (feedEntry.arenaEvent.name === ABIName.TranscriptCreated)
        createdEntry = feedEntry;
      else if (feedEntry.arenaEvent.name === ABIName.URI)
        uriEntry = feedEntry;
      else if (feedEntry.arenaEvent.name === ABIName.TransferSingle && !feedEntry.arenaEvent.mint) {
        victoryTransfer = feedEntry;
        continue;
      }
      addEntry(feedEntry);
    }

    let victoryEntry;

    let entries = [];
    for (let choiceFeed of Object.values(addressFeeds)) {

      // Iterate highest to lowest
      for (let eid of Object.keys(choiceFeed).sort((a, b) => Number(b) - Number(a))) {
        eid = Number(eid);
        // Except for eid 0 which is the bootstrap, every choice entry takes its choice menu from the previous
        if (eid === 0) {
          choiceFeed[eid].status = STATUS_STARTED;
          continue;
        }
        if (!choiceFeed[eid - 1]) continue;

        let cur = choiceFeed[eid];

        // let prev = choiceFeed[eid -1];

        // any choice context that has a successor is complete by definition
        // prev.status = STATUS_COMPLETE;

        // cur.choices = prev.outcomeChoices;

        cur.status = STATUS_PENDING;
        if (typeof cur?.arenaEvents?.committed !== 'undefined')
          cur.status = STATUS_COMMITTED;

        const outcome = cur?.arenaEvents?.outcome?.arenaEvent;
        if (typeof outcome !== 'undefined')
          cur.status = STATUS_VERIFIED;

        // if the victory transfer event was emitted in the same transaction as
        // the outcome of cur, then cur is the entry associated with the
        // victory. Due to how eid's are allocated uniquely to participant
        // moves, this also means the subject of cur is the victor. But we check
        // explicitly none the less.
        if (cur.status === STATUS_VERIFIED && victoryTransfer && victoryTransfer?.arenaEvent?.subject === outcome.subject) {
          if (
            victoryTransfer.arenaEvent.log.blockNumber === outcome.log.blockNumber
            && victoryTransfer.arenaEvent.log.transactionIndex === outcome.log.transactionIndex) {
            cur.arenaEvents.victory = victoryTransfer;
            victoryEntry = cur;
          }
        }
        entries.push(cur);
      }
   }

    entries.sort((a, b) => a.eid - b.eid);

    // deal with the guardian declared start states, which all have the pseudo eid 0
    for (let [address, choiceFeed] of Object.entries(addressFeeds)) {
      if (!choiceFeed[0]) continue;

      entries = [choiceFeed[0], ...entries];
      const a = [];
      for (let eid of Object.keys(choiceFeed).sort((a, b) => Number(a) - Number(b)))
        a.push(choiceFeed[Number(eid)]);
      addressFeeds[address] = a;
    }

    // choiceFeed is now in lifo order
    if (opts.lifo)
      entries.reverse();

    log.debug(`choicefeed# num entries ${entries.length}`);
    return {trial:entries, trialists: addressFeeds, victoryEntry, createdEntry, uriEntry};
  });
}