import { getContext } from 'svelte'

/**
 * Must be created at page scope (calls svelte getContext)
 */
export class TrialistCommandCtx {

  constructor() {
    this.trialist = undefined;
    getContext('trialist').subscribe((value)=>this.trialist = value);
  }

  /**
   * 
   * @param {import('../console/completion.js').MatchResult} result 
   */
  async exec(result) {
    throw new Error('not implemented error');
  }
}