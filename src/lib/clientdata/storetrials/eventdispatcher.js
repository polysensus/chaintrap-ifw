import { derived } from "svelte/store";
import {
    Dispatcher
    // gameInstance
  } from '@polysensus/chaintrap-arenastate';

export function newEventDispatcher(eventParser) {
  return derived(eventParser, ($eventParser, set) => {
    console.log(`eventdispatcher.js# newEventDispatcher eventDispatcher changed`);
    if (!$eventParser)  {
      set(undefined);
      return undefined;
    }
    const dispatcher = new Dispatcher($eventParser);
    set(dispatcher);
    return () => dispatcher.stopListening()
  });
}