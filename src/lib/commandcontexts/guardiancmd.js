import { getContext } from 'svelte'

/**
 * Must be created at page scope (calls svelte getContext)
 */
export class GuardianCommandCtx {

  constructor() {
    this.map = this.furnishings = this.trialPoster = this.guardian = undefined;
    this.metadataURL = '/api/nftstorage/metadata';

    getContext('map').subscribe((value)=>this.map = value);
    getContext('furnishings').subscribe((value)=>this.furnishings = value);
    getContext('trialPoster').subscribe((value)=>this.trialPoster = value);
    getContext('guardian').subscribe((value)=>this.guardian = value);
  }

  /**
   * 
   * @param {import('../console/completion.js').MatchResult} result 
   */
  async exec(result) {
    throw new Error('not implemented error');
  }
}