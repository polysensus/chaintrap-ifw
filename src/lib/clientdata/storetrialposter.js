import { writable } from "svelte/store";
import { Stores } from "./trialcontent.js";

export function newTrialPosterStore() {

  /** @type {{indexedPrimaryKey:Function,lastID:Function,trialPosterLast:Function, trialPosterAdd:Function}} */
  let db;

  const {subscribe, update} = writable(undefined);

  return {
    subscribe,
    /** @param {{indexedPrimaryKey:Function,lastID:Function,trialPosterLast:Function, trialPosterAdd:Function}} db_
     * @param {*} db_ 
     */
    connect: async function (db_) {
      db = db_;
      let poster = await db.trialPosterLast();
      update(() => poster);
    },

    /** @param {{unique_name?:string,labels:string[],base64:string,meta:{contentType:string,path?:string,prompt:string,openaiOptions?:object}}} poster */
    add: async function (poster) {
      if (!poster.unique_name) {
        const id = await db.lastID(Stores.TrialPosters);
        poster.unique_name = `trialposter-${id}`;
      }
      console.log(`adding trial poster: ${poster.unique_name}`);
      await db.trialPosterAdd(poster)
      poster = await db.trialPosterLast();
      update(() => poster)
    }
  }

}
