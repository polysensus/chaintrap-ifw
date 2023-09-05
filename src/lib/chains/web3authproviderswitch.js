// --- lib deps
import * as pkg from '@web3auth/modal';
const { Web3Auth } = pkg;

// @ts-ignore

import { Web3AuthModalProviderSwitchAbstract } from '@polysensus/chaintrap-arenastate';

/**
 * Web3ModalProviderSwitch adds support for cfg.type.startsWith('web3auth')
 * It deals with the fact that Web3Modal must be instanced as a singleton
 */
export class Web3AuthModalProviderSwitch extends Web3AuthModalProviderSwitchAbstract {
  newWeb3Auth(cfg) {
    return new Web3Auth(cfg);
  }
}
