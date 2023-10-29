// import {
//   prepareTrialMetadata,
//   prepareTrialInitArgs,
//   chaintrapGameDefaults
// } from '@polysensus/chaintrap-arenastate';

import { gameToken} from '@polysensus/chaintrap-arenastate';
import { GuardianCommandCtx } from './guardiancmd.js';

/**
 * Must be constructed at page global scope
 */
export class StartGameCommandCtx extends GuardianCommandCtx {
  constructor(startCtx, options) {
    super();
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
    const gid = gameToken(result.values.id);
    const gidHex = gid.toHexString();

    const indices = Object.keys(this.startCtx.starts).map((value)=>Number(value));
    indices.sort((a, b) => a - b);
    const starts = []
    for (const i of indices)
      starts.push(this.startCtx.starts[`${i}`].location);

    const txr = await this.guardian.startGame(gid, ...starts);
    this.result = {ok: true, ...txr};
    return this.result;
  }
}
