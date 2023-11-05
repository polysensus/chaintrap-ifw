// --- lib deps
import * as web3auth_modal from '@web3auth/modal';
const { Web3Auth } = web3auth_modal;
import * as web3auth_openlogin_adapter from '@web3auth/openlogin-adapter';
const { OpenloginAdapter } = web3auth_openlogin_adapter;

// yayass

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

  /**
   * newOpenloginAdapter instantiages a web3auth/openlogin-adapter instance
   * with the provided adapterSettings
   * @param {object} cfg 
   * @param {object} adapterSettings 
   */
  newOpenLoginAdapter(cfg, adapterSettings) {
    // cfg is ignored, we assume that it contains clientId and network
    return new OpenloginAdapter(adapterSettings);
  }
}
