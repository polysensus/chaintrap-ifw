// import {
//   prepareTrialMetadata,
//   prepareTrialInitArgs,
//   chaintrapGameDefaults
// } from '@polysensus/chaintrap-arenastate';

import { gameToken} from '@polysensus/chaintrap-arenastate';
import { GuardianCommandCtx } from './guardiancmd.js';

/**
 * Must be constructed at page global scope
 * 
 * Resolve the pending choices and provide narrative for consequences and new choices.
 */
export class NarrateCommandCtx extends GuardianCommandCtx {
  constructor(startCtx, options) {
    super();

    this.gid = options?.gid;
    if (!this.gid) throw new Error(`This command requires a gid`);

    this.options=options;
    this.result = undefined;
    this.startCtx = startCtx;
  }

  /**
   * 
   * @param {import('../console/completion.js').MatchResult} result 
   */
  async exec(result) {
    this.result = undefined;

    if (!(this.guardian)) {
      console.log(`guardian, poster, map and furnishings are all required to create a trial`);
      return;
    }

    // TODO: add a {prompt} field to be used for narrative generation
    const txr = await this.guardian.resolvePending(this.gid);
    this.result = {ok: true, ...txr};
    return this.result;
  }
}
