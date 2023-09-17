import {openDB} from 'idb';

export const CLIENTDATA_VERSION = 1;
export class Errors {
  static DBNotReady = 'db not created (or busy creating)'
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

  /**
   * 
   * @param {string} storeId 
   * @returns 
   */
  async count(storeId) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    return this.db.transaction(storeId, "readonly")
      .store
      .count();
  }

  /**
   * @param {string} storeId
   * @param {any} value 
   */
  async add(storeId, value) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    this.db.add(storeId, value);
  }

  /**
   * Get the last item from the store, provided the store was creatd using the
   * default autoincrement primary key
   * @param {string} storeId 
   */
  async last(storeId) {
    if(!this.db) throw new Error(Errors.DBNotReady);

    const tx = this.db .transaction(storeId, 'readonly');
    return tx.store.openCursor(null, 'prev')
      .then((c)=>{
        return c?.value
      })
  }

  /**
   * 
   * @param {string} storeId
   * @param {string} index name of an index in the schema
   * @param {any} key
   */
  async indexGet(storeId, index, key) {
    if(!this.db) throw new Error(Errors.DBNotReady);
    return this.db.transaction([storeId], "readonly")
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