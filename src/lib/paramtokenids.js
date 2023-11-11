// helpers for dealing with game contract tokens encoded in urls
import {ethers } from 'ethers';

import {
  gameToken, firstType, gameType
} from '@polysensus/chaintrap-arenastate';

/**
 * 
 * @param {string|number} gidParam 
 * @returns 
 */
export function gidFromParam(gidParam) {
  // If it is already a number, it can't have the type code in because that
  // would have overflowed. Treat it as an instance
  if (typeof gidParam === 'number')
    return gameToken(gidParam);

  if (typeof gidParam === 'string') {
    const gid = ethers.BigNumber.from(gidParam)
    if (gid.lt(firstType)) {
      // no instance type present, just add the game type
      return gid.add(gameType)
    }
    return gid;
  }
  throw new Error(`gidParm is undefined or an unsupported type: ${gidParam}`);
}