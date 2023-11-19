import { TrialistCommandCtx } from './trialistcmd.js';
import { gameToken} from '@polysensus/chaintrap-arenastate';

/**
 * Must be constructed at page global scope
 */
export class UseExitCommandCtx extends TrialistCommandCtx {
  /**
   * 
   * @param {object} options 
   */
  constructor(options) {
    super();

    this.gid = options?.gid;
    if (!this.gid) throw new Error(`This command requires a gid`);

    this.options=options;
    this.result = undefined;
  }

  /**
   * 
   * @param {import('../console/completion.js').MatchResult} result 
   */
  async exec(result) {
    this.result = undefined;
    if (!(this.trialist)) {
      console.log(`trialist not ready`);
      return;
    }
    const side = result?.values?.side;
    const exit = result?.values?.exit;
    if (typeof side === 'undefined' || typeof exit === 'undefined')
      throw new Error(`side ${side} or exit ${exit} not found in command`);
    const txr = await this.trialist.commitLocationChoice(this.gid, side, exit);
    this.result = {choice:side, menu:exit, ...txr};
    return this.result;
  }
}
