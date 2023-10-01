import {Collection, Errors as ColletionErrors} from './idb.js';

export const CLIENTDATA_TRIALCONTENT_VERSION = 1;
export const CLIENTDATA_TRIALCONTENT_DBNAME = 'trial_content';

export class Errors extends ColletionErrors {}

export class Stores {
  static Maps = 'Maps';
  static Codices = 'Codices';
  static Furniture = 'Furniture';
}

export class TrialContent extends Collection {
  static Stores = {
    Maps: 'Maps',
    Codices: 'Codices'
  }

  /**
   * @param {any} value 
   * @returns {string}
   */
  static keyOfMap(value) {
    return value?.vrf_inputs?.proof?.beta;
  }

  /**
   * Create a new context for working with a single IndexDB database with many
   * object stores.
   * @param {{name?:string,version?:number}} opts options applying to the context and whole database, name is required
   */
  constructor (opts={}) {

    if (typeof opts?.name === 'undefined')
      opts.name = CLIENTDATA_TRIALCONTENT_DBNAME;
    if (typeof opts?.version === 'undefined')
      opts.version = CLIENTDATA_TRIALCONTENT_VERSION;
    super(opts,
      // {name:TrialContent.StoreId.Maps, keyPath: 'vrf_inputs.proof.beta'}
      {
        // auto-increment to get an insert order sortable stable id, but put a
        // unique index on beta so we don't get duplicates.
        name:Stores.Maps, autoIncrement:true,
        indices:[
          {name:'beta', keyPath: 'vrf_inputs.proof.beta', unique:true},
          {name:'comment', keyPath: 'comment'},
          {name:'public_key', keyPath: 'vrf_inputs.proof.public_key'},
          {name:'secret', keyPath: 'vrf_inputs.secret'},
          {name:'seed', keyPath: 'vrf_inputs.seed'}
        ]
      },
      {
        name:Stores.Codices, autoIncrement:true
      },
      {
        name:Stores.Furniture, autoIncrement:true,
        indices: [
          {name:'beta', keyPath: 'map.beta'},
          // Note: the unique cosntraint on unique_name permits an number of records to use undefined for this field value (leave it absent)
          {name:'unique_name', keyPath: 'unique_name', unique:true},
          {name:'type', keyPath: 'type'},
          {name:'labels', keyPath: 'labels'},
        ]
      }
    );
    this.defaultWriteOpts = opts?.writeOpts ?? {retryError:'ConstraintError'};
  }

  /**
   * Add a furniture item, furniture items are always associated with a map. The
   * association is on the VRF beta for the map generation.
   * @param {string} beta identifies the map this furniture item is associated with
   * @param {{
   *  unique_name?:string,
   *  labels:string[],
   *  data: any,
   *  meta: any}} item
   */
  async furnitureAdd(beta, item) {
    const value = structuredClone(item);
    // @ts-ignore
    value.map = {beta};
    this.add(Stores.Furniture, value);
  }

  /**
   * 
   * @param {string} uniqueName 
   * @returns 
   */
  async furnitureDel(uniqueName) {
    console.log(`deleting for ${Stores.Furniture} ${uniqueName}`);
    return await this.indexedDel(Stores.Furniture, 'unique_name', uniqueName);
  }

  async furniturePut(furn) {
    return this.indexedPut(Stores.Furniture, 'unique_name', furn.unique_name, furn);
  }

  /**
   * 
   * @param {string} beta 
   * @returns 
   */
  async furnitureLast(beta) {
    return this.indexedLast(Stores.Furniture, 'beta', beta);
  }

  /**
   * 
   * @param {string} beta 
   */
  async furnitureCount(beta)  {
    return this.indexedCount(Stores.Furniture, 'beta', beta);
  }

  /**
   * returns all items in the furniture unique_name index. Items without a
   * unique name are not returned.
   */
  async furnitureGetAll() {
    return await this.indexedGetAll(Stores.Furniture, 'unique_name');
  }

  async mapCount() { return this.count(Stores.Maps); }
  /**
   * @param {{
   *  comment?:string,
   *  model:any,
   *  model_type:string,
   *  vrf_inputs:{
   *    alpha:string,
   *    proof: {beta:string,pi:string,public_key:string},
   *  secret:string, seed:string}}} value
   * @param {{retrieError?:string,retries?:number}|undefined} opts
   */
  async mapAdd(value, opts) {
    opts = opts ?? this.defaultWriteOpts;
    return this.add(Stores.Maps, value, opts);
  }

  async mapLast() {
    return this.last(Stores.Maps)
  }

  /**
   * @param {string} beta
   * @returns {Promise<{
   *  comment?:string,
   *  model:any,
   *  model_type:string,
   *  vrf_inputs:{
   *    alpha:string,
   *    proof: {beta:string,pi:string,public_key:string},
   *  secret:string, seed:string}>}
   */
  async mapByBeta(beta) {
    if(!this.db) throw new Error('db not created (or busy creating)');
    return this.indexGet(Stores.Maps, 'beta', beta);
  }

  async codexCount() { return this.count(Stores.Codices); }
  /**
   * 
   * @param {{
   *  ikeys:number[],
   *  salts:string[],
   *  index:{map:number[]},
   *  items:{
   *    id:number, name:string,
   *    meta:{name:string,content_type:string,encrypted:boolean},
   *    blobs:{params:{ikey:number,iv:string, alg:string,tag:string},blob:string}[]
   *  }[]
   * }} value 
   * @returns 
   */
  async addCodex(value) {
    return this.add(Stores.Codices, value);
  }

  async lastCodex() {
    if(!this.db) throw new Error(Errors.DBNotReady);
    return this.last(Stores.Codices)
  }
}