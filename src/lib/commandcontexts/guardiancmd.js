import { getContext } from 'svelte'

/**
 * Must be created at page scope (calls svelte getContext)
 */
export class GuardianCommandCtx {

  constructor() {
    this.map = this.furnishings = this.trialPoster = this.guardian = undefined;
    this.metadataURL = '/api/nftstorage/metadata';

    let s = undefined;

    s = getContext('map');
    if (s) s.subscribe((value)=>this.map = value);

    s = getContext('furnishing');
    if (s)
      s.subscribe((value)=>this.furnishings = value);

    s = getContext('trialPoster');
    if (s)
      s.subscribe((value)=>this.trialPoster = value);

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