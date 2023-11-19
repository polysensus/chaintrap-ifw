// sets the start position for a registered player

import { gameToken} from '@polysensus/chaintrap-arenastate';
import { GuardianCommandCtx } from './guardiancmd.js';

/**
 * Must be constructed at page global scope
 */
export class SetStartCommandCtx extends GuardianCommandCtx {
  constructor(options) {
    super();

    this.gid = options?.gid;
    if (!this.gid) throw new Error(`This command requires a gid`);

    this.result = undefined;
    this.starts = {};
  }

  restStarts() {
    this.starts = {}
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

    const gidHex = this.gid.toHexString();

    console.log(Object.keys(this.guardian.journal?.transcripts))

    const roster = this.guardian.journal?.transcripts[gidHex];
    if (!roster) {
      console.log(`roster not found for gid: ${gidHex}`);
      return;
    }
    if ((roster.count ?? 0) == 0) {
      console.log(`roster empty for gid: ${gidHex}`);
      return;
    }

    const indexed = {}
    for (const [addr, t] of Object.entries(roster.trialists))
      indexed[`${t.index}`] = addr;

    const index = result.values.index;
    if (!indexed[index]) {
      this.result = {
        ok: false,
        disposition: `index ${index} not found`
      }
      return this.result;
    }

    const location = result.values.location;
    if (location > this.guardian.topology.locations.length) {
      this.result = {
        ok: false,
        disposition: `location ${location} not found`
      }
      return this.result;
    }
    this.starts[`${index}`] = {
      trialist: roster.trialists[indexed[`${index}`]],
      location
    }
    this.result = {
      ok: true,
      disposition: `set start location ${location} for participant ${index}`
    }
    return this.result;
  }
}

