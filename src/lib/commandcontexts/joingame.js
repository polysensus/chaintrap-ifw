import { TrialistCommandCtx } from './trialistcmd.js';
import { gameToken} from '@polysensus/chaintrap-arenastate';

/**
 * Must be constructed at page global scope
 */
export class JoinGameCommandCtx extends TrialistCommandCtx {
  constructor(options) {
    super();
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
    const gid = gameToken(result.values.id);
    const txr = await this.trialist.joinGame(gid, {nickname: result.values.nickname});
    this.result = {gid, nickhame:result.values.nickname, ...txr};
    return this.result;
  }
}
