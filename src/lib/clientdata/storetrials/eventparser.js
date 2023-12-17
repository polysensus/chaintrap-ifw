import { derived } from "svelte/store";
import {
  EventParser, ArenaEvent,
  // gameInstance
} from '@polysensus/chaintrap-arenastate';

export function newEventParser(arena) {
  return derived(arena, ($arena)=> {
    if (!$arena) return undefined;
    return new EventParser($arena, ArenaEvent.fromParsedEvent);
  });
}
