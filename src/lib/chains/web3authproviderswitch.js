// --- lib deps
import { Web3Auth } from "@web3auth/modal";

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
