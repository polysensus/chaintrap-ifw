import {openDB} from 'idb';

export const CLIENTDATA_VERSION = 1;
export class Errors {
  static DBNotReady = 'db not created (or busy creating)'
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class Collection {
  /**
   * Create a new context for working with a single IndexDB database with many
   * object stores.
   * @param {{name:string,version?:number}} opts options applying to the context and whole database, name is required
   * @param { ...{
   *  name?:string,
   *  keyPath?:string,
   *  autoIncrement?:boolean,
   *  indices?:[{name:string,keyPath:string,unique?:boolean,multiEntry?:boolean}]
   * }} stores describes each object store that should be created
   */
  constructor(opts, ...stores) {
    this.name = opts?.name;
    this.version = opts?.version ?? CLIENTDATA_VERSION;

    /** @type {import('idb').IDBPDatabase|undefined} */
    this.db = undefined;

    /** @type {any} */
    this.storeOpts = {};
    /** @type {Object<string,{keyPath:string,unique?:boolean,multiEntry?:boolean}>}
     * `storeId-indexName:keyPath` */
    this.indexOpts = {}

    for (const s of stores) {
      const storeName = s.name;
      if (!storeName) throw new Error('each store opts must provide a name');
      const opts = structuredClone(s);
      delete opts.name;
      this.storeOpts[storeName] = opts;
      for (const iOpts of opts.indices ?? []) {
        this.indexOpts[`${storeName}:${iOpts.name}`] = iOpts;
      }
    }

    if (!this.name) throw new Error('a name is required');
    if (!(Object.keys(this.storeOpts).length > 0)) throw new Error('at least one object store must be specified');
    this.creating = false;
  }

  async create() {
    if (typeof this.db !== 'undefined' || this.creating) return;
    this.creating = true;

    const collections = this;

    this.db = await openDB(this.name, this.version, {
      upgrade(db) {
        for (const [storeName, s] of Object.entries(collections.storeOpts)) {
          // Note we are deleting here, but only if we are creating or
          // upgrading. Create a copy so the contents of storeOpts left on this
          // are always the same.
          const  storeOpts = structuredClone(s);
          const indexOpts = storeOpts.indices ?? [];
          delete storeOpts.indices;
          const store = db.createObjectStore(storeName, storeOpts);
          for (const o of indexOpts) {
            const {name, keyPath} = o;
            delete o.name;
            delete o.keyPath;
            const index = store.createIndex(name, keyPath, o);
          }
        }
      }
    });
  }
  close() {
    if (!this.db) return;
    this.db.close();
    this.db = undefined;
  }

  /**
   * Count of all records in the store.
   * Note: use indexedCount if you want to count records matching a specific
   * index key.
   * @param {string} storeId 
   * @returns 
   */
  async count(storeId) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    return await this.db.transaction(storeId, "readonly").store.count();
  }

  /**
   * Count of records in index matching the value
   * @param {string} storeId 
   * @param {string} index 
   * @param {any} value 
   * @returns 
   */
  async indexedCount(storeId, index, value) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    return await this.db.transaction(storeId, "readonly")
      .store.index(index)
      .count(IDBKeyRange.only(value))
  }

  /**
   * Obtain the primary key for a uniquely indexed value
   * Ie, for an autoincrement store with an additional unique index, get the
   * auto increment key that was created for the record on insertion
   * @param {string} storeId 
   * @param {string} index 
   * @param {any} value 
   * @returns 
   */
  async indexedPrimaryKey(storeId, index, value) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    return await this.db.transaction(storeId, 'readonly')
      .store
      .index(index)
      .openCursor(IDBKeyRange.only(value))
        .then((c) => c?.primaryKey)
  }

  /**
   * Delete the single item found by the index for the given value
   * @param {string} storeId 
   * @param {string} index 
   * @param {any} value 
   * @returns 
   */
  async indexedDel(storeId, index, value) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    const key = await this.indexedPrimaryKey(storeId, index, value);
    await this.db.transaction(storeId, 'readwrite')
      .store.delete(key)
  }
  /**
   * Put the single item found by the index for the given value
   * @param {string} storeId 
   * @param {string} index 
   * @param {string} key 
   * @param {any} value 
   * @returns 
   */
  async indexedPut(storeId, index, key, value) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    const primaryKey = await this.indexedPrimaryKey(storeId, index, key);
    await this.db.transaction(storeId, 'readwrite')
      .store.put(value, primaryKey)
  }

  async indexedGetAll(storeId, index) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    return await this.db.transaction(storeId, "readonly")
      .store.index(index)
      .getAll();
  }

  /**
   * @param {string} storeId
   * @param {any} value 
   * @param {{retryError?:string,retries?:number}} opts
   */
  async add(storeId, value, opts={}) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    return await this.db.transaction(storeId, 'readwrite')
      .store.add(value);
  }

  /**
   * 
   * @param {string} storeId 
   * @param {any} key must be the primary key for the store
   * @returns 
   */
  async delete(storeId, key) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    return await this.db.transaction(storeId, 'readwrite').store.delete(key);
  }

  /**
   * Get the last item from the store, provided the store was creatd using the
   * default autoincrement primary key
   * @param {string} storeId 
   */
  async last(storeId) {
    if(!this.db) throw new Error(Errors.DBNotReady);

    return await this.db.transaction(storeId, 'readonly')
      .store.openCursor(null, 'prev')
      .then((c)=>{
        return c?.value
      })
  }

  /**
   * Get the last primary key from the store, note that after deletions this is not the same as the count
   * @param {string} storeId 
   */

  async lastID(storeId) {
    if(!this.db) throw new Error(Errors.DBNotReady);

    return await this.db.transaction(storeId, 'readonly')
      .store.openCursor(null, 'prev')
      .then((c)=>{
        return c?.primaryKey
      });
  }

  /**
   * 
   * @param {string} storeId 
   * @param {string} index 
   * @param {any} value 
   * @returns 
   */
  async indexedLast(storeId, index, value) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    const c = await this.db.transaction(storeId, 'readonly')
      .store
      .index(index)
      .openCursor(IDBKeyRange.only(value), 'prev')
    return c?.value ?? null;
  }

  /**
   * 
   * @param {string} storeId
   * @param {string} index name of an index in the schema
   * @param {any} key
   */
  async indexGet(storeId, index, key) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    return await this.db.transaction([storeId], "readonly")
      .objectStore(storeId)
      .index(index).get(key);
  }

  /**
   * 
   * @param {string} storeId 
   * @param {string} key 
   * @returns {Promise<{
   *  comment?:string,
   *  model:any,
   *  model_type:string,
   *  vrf_inputs:{
   *    alpha:string,
   *    proof: {beta:string,pi:string,public_key:string},
   *  secret:string, seed:string}>}
   */
  async get(storeId, key) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    return await this.db.get(storeId, key);
  }

}