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

        // console.log(`FEED ITEM(${arenaEvent.name}) ${updatedGid?.toHexString()} ${key} ${eid} ${arenaEvent.subject}`);

        const { limit } = options;

        for (const entry of ordered)
          if (logCompare(arenaEvent.log, entry.arenaEvent.log) === 0)
            return ordered;

        const gidHex = updatedGid.toHexString();

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
          ordered = ordered.sort((a, b) => logCompare(a.arenaEvent.log, b.arenaEvent.log))
        else
          ordered = ordered.sort((a, b) => logCompare(b.arenaEvent.log, a.arenaEvent.log))
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

function logCompare(a, b) {
  // console.log(`logCompare# ${a.blockNumber} ${a.logIndex} vs ${b.blockNumber} ${b.logIndex}`);
  let result = Number(a.blockNumber) - Number(b.blockNumber);
  if (result !== 0)
    return result;
  return Number(a.logIndex) - Number(b.logIndex);
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
