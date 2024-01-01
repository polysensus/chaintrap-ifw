import { derived } from "svelte/store";
import {
  EventParser, ArenaEvent,
  // gameInstance
} from '@polysensus/chaintrap-arenastate';

export function newEventParser(arena) {
  return derived(arena, ($arena)=> {
    console.log(`eventparser.js# newEventParser arena changed`);
    if (!$arena) return undefined;
    return new EventParser($arena, ArenaEvent.fromParsedEvent);
  });
}
