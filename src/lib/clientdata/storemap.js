import { writable } from "svelte/store";

import {Stores } from './trialcontent.js';

/**
 * Create a store referencing the most recently added map.
 * 
 * This store ensures that the map has a name property that is uniqie for the
 * underling index db.  Assumes that only one instance is created and that once
 * created, maps are not modified.
 */
export function newMapStore() {

  /** @type {{indexedPrimaryKey:Function,mapLast:Function, mapAdd:Function}} */
  let db;
  const {subscribe, update} = writable(undefined);

  return {
    subscribe,
    /** @param {{indexedPrimaryKey:Function,mapLast:Function, mapAdd:Function}} db_
     * @param {*} db_ 
     */
    connect: async function (db_) {
      db = db_;
      let map = await db.mapLast();
      if (map) {
        const primaryKey = await db.indexedPrimaryKey(
          Stores.Maps, 'beta',
          map.vrf_inputs.proof.beta);
        map = {...map, name: `map${primaryKey}`}
      }
      update(() => map);
    },
    add: async function (map) {
      const primaryKey = await db.mapAdd(map)
      map = {...map, name: `map${primaryKey}`};
      console.log(`updating map ${map.name}`)
      update(() => map)
    },
  }
}