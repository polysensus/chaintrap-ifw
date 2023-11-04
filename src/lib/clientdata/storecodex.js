import { writable } from "svelte/store";

import {Stores } from './trialcontent.js';

/**
 * Create a store referencing the most recently added trial encoded in a blob codex.
 * 
 * Assumes that only one instance is created and that once
 * created, maps are not modified.
 */
export function newCodexStore() {

  /** @type {{lastID:Function,codexLast:Function, codexAdd:Function}} */
  let db;
  const {subscribe, update} = writable(undefined);

  return {
    subscribe,
    /** @param {{lastID:Function,codexLast:Function, codexAdd:Function}} db_
     * @param {*} db_ 
     */
    connect: async function (db_) {
      db = db_;
      let codex = await db.codexLast();
      update(() => codex);
    },

    /**
     * 
     * @param {{
     *  unique_name?:string,
     *  labels?:string[],
     *  codex: {
     *  ikeys:number[],
     *  salts:string[],
     *  index:{Oject<string>():number[]},
     *  items:{
     *    id:number, name:string,
     *    meta:{name:string,content_type:string,encrypted:boolean},
     *    blobs:{params:{ikey:number,iv:string, alg:string,tag:string},blob:string}[]
     *  }[]
     * }}} value 
     */
    add: async function (value) {

      if (!value.unique_name) {
        const id = await db.lastID(Stores.Codices);
        value.unique_name = `codex:${id}`;
      }
      if (!value.labels) {
        value.labels = Object.keys(value.codex.index)
      }

      await db.codexAdd(value)
      console.log(`updating codex ${value.unique_name}`)
      // @ts-ignore
      update(() => value)
    },
  }
}