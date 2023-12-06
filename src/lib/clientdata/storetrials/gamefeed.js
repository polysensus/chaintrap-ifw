import { writable } from "svelte/store";
import { ABIName } from "@polysensus/chaintrap-arenastate";

/**
 * 
 * lifo will reverse the feed so the most recent (last) items are first out LIFO
 * limit will constrain the number of items retained in the feed
 * @param {{limit?:number,lifo?:boolean}} options 
 */
export function newFeed(journal, gid, options) {
  console.log(`newFeed# ${journal}`);

  const { subscribe, update } = writable([]);
  return {
    subscribe, update,
    handleEvent: async function (updatedGid, eid, key, arenaEvent, state) {

      if (!(updatedGid && updatedGid.eq(gid))) return;

      update((ordered)=>{

        console.log(`LIFO(${typeof options.lifo ==='undefined' ||options.lifo}) ${updatedGid?.toHexString()} ${key} ${eid} ${arenaEvent.subject}`);

        const { limit } = options;

        for (const entry of ordered)
          if (entryCompare({eid, arenaEvent}, entry) === 0)
            return ordered;

        const gidHex = updatedGid.toHexString();

        if (arenaEvent.name === ABIName.TranscriptEntryChoices && !state)
          throw new Error('wtaf');

        // build the new entry
        let entry;
        if (!state) {
          // if (arenaEvent?.subject) {
          //   console.log(`state not found for user; ${arenaEvent?.subject}, have ${Object.keys(t.trialists)}`);
          //   return ordered;
          // }
          entry = entryFromPreGameEvent(arenaEvent);
        } else {
          entry = entryFromState(state, eid, arenaEvent);
        }

        ordered.push(entry);

        if (typeof options?.lifo == 'undefined' || options?.lifo)
          ordered = ordered.sort((a, b) => entryCompare(a, b))
        else
          ordered = ordered.sort((a, b) => entryCompare(b, a))
        // if (typeof options?.lifo == 'undefined' || options?.lifo)
        //   ordered.reverse();
        if (typeof limit !== 'undefined')
          ordered = ordered.slice(0, limit);

        // console.log(`newFeed:update# added ${JSON.stringify(entry)}`);

        return ordered;
      })
    }
  }
}

function entryCompare(a, b) {
  return logCompare(a.arenaEvent.log, b.arenaEvent.log);
  // If neither are game progress events OR if they are the eid 0 start choices
  if (!a.eid && !b.eid)
    return logCompare(a.arenaEvent.log, b.arenaEvent.log);
  // if both are game progress events
  if (a.eid && b.eid)
    return Number(a.eid) - Number(b.eid);

  // Otherwise, the game progress events are > all game setup events
  if (a.eid && !b.eid)
    return 1; // a > b
  if (!a.eid && b.eid)
    return -1; // a < b

  throw new Error(`entryCompare can't compare ${typeof a} to ${typeof b}`);
}

function logCompare(a, b) {
  // console.log(`logCompare# ${a.blockNumber} ${a.logIndex} vs ${b.blockNumber} ${b.logIndex}`);
  let result = a.blockNumber - b.blockNumber;
  if (result !== 0)
    return result;
  return a.logIndex - b.logIndex;
}

/**
 * @param {import('@polysensus/chaintrap-arenastate').ArenaEvent} arenaEvent
 */
function entryFromPreGameEvent(arenaEvent) {
  return { eid:arenaEvent.eid, arenaEvent, address: arenaEvent.subject, state: {}, delta: undefined }
}

/**
 * 
 * @param {import('@polysensus/chaintrap-arenastate').TrialistState} trialistState
 * @param {import('@polysensus/chaintrap-arenastate').ArenaEvent} arenaEvent
 */
function entryFromState(state, eid, arenaEvent) {
    const entry = {
      state:{...state, nickname:state.profile?.nickname},
      arenaEvent,
      address: arenaEvent.subject
    }
    if (typeof eid !== 'undefined')
      entry.eid = eid;
    return entry;
}
