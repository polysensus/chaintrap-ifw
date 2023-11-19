import { TrialistCommandCtx } from './trialistcmd.js';
import { gameToken} from '@polysensus/chaintrap-arenastate';

/**
 * Must be constructed at page global scope
 */
export class OpenChestCommandCtx extends TrialistCommandCtx {
  /**
   * 
   * @param {{gid:any}} options 
   */
  constructor(options) {
    super();

    this.gid = options?.gid;
    if (!this.gid) throw new Error(`This command requires a gid`);

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
    const number = result?.values?.number;
    if (typeof number === 'undefined')
      throw new Error(`chest number not found in command`);
    // Note: usable objects are choices > last side. Chest objects only have a
    // single menu item, the 'open' item
    const chest = 4 + number;

    const txr = await this.trialist.commitLocationChoice(this.gid, chest, 0);
    this.result = {choice:chest, menu:0, ...txr};
    return this.result;
  }
}
