import { writable } from "svelte/store";

import { Stores } from "./trialcontent.js";

export function newFurnitureStore() {

 /** @type {{
  * lastID:Function,
  * furnitureGetAll:Function,
  * furnitureGet:Function,
  * furnitureAdd:Function,
  * furniturePut:Function,
  * furnitureDel:Function}}*/
  let db;

  const {subscribe, update} = writable(undefined);

  async function refresh() {
    const items = await db.furnitureGetAll();
    await update(() => items);
  }

  return {
    subscribe,
    refresh,

    /** @param {{
     * lastID:Function,
     * furnitureGetAll:Function,
     * furnitureGet:Function,
     * furnitureAdd:Function,
     * furniturePut:Function,
     * furnitureDel:Function}} db_*/
    connect: async function(db_) {
      db = db_;
      await refresh();
    },
    /**
     * @param {{name?:string,vrf_inputs:{proof:{beta:string}}}} map 
     * @param {number} location 
     * @param {{unique_name?:string,data?:{location?:number}}} furn 
     * @param {object} opts 
     */
    add: async function (map, location, furn, opts) {

      const beta = map.vrf_inputs.proof.beta;
      if (!furn.unique_name) {
        const id = await db.lastID(Stores.Furniture);
        furn.unique_name = `${map.name ?? beta}:loc:${location}:id:${id}`;
      }

      if (!furn?.data)
        furn.data = {}
      if(typeof furn.data.location === 'undefined')
        furn.data.location = location;

      await db.furnitureAdd(beta, furn);

      await refresh();
    },

    /**
     * @param {string} uniqueName 
     */
    remove: async function (uniqueName) {
      await db.furnitureDel(uniqueName);

      await refresh();
    },

    /**
     * @param {object} furn 
     */
    put: async function (furn) {
      await db.furniturePut(furn);
      await refresh();
    }
  }
}