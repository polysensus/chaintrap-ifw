import { writable, derived, get } from 'svelte/store';

import { Web3AuthModalProviderSwitch } from './web3authproviderswitch.js';

import { FetchProviderContext } from './fetchprovidercontext.js';
import { Web3AuthModalProviderContext } from './web3authprovidercontext.js';

/**
 * ChainPresence is the 'login' context for a person using chaintrap.
 *
 * ChainPresence manages a provider context for a chain account owner
 * interactions with chains.  So, for example,  the holder of one or more wallet
 * private keys can connect to the appropriate chain and issue transactions with
 * that key. This is mediated through one of the supported provider types
 * available for the specific chain.
 *
 */
export class ChainPresence {
  static async create(cfg) {
    const presence = new ChainPresence(cfg);
    await presence.refreshProviders();
    return presence;
  }

  constructor(cfg) {
    this.cfg = cfg;
    this.providerCtx = undefined;
    this.authenticated = writable(false);
    this.providerName = writable(undefined);

    // provider selection
    this.providerSwitch = new Web3AuthModalProviderSwitch({
      prepared: (name, ctx) => {
        // this.providerName.set(name);    
        console.log(`prepapred: ${name}`);
      },
      accountsChanged: async (name, ctx) => this.accountsChanged(name, ctx),
      chainChanged: async (name, ctx) => this.chainChanged(name, ctx),
      disconnected: async (name, ctx) => this.disconnected(name, ctx),
      authenticated: (authenticated) => this.authenticated.set(authenticated)
    });

  }
  logout() {
    if (!get(this.authenticated)) return;
    this.providerSwitch.logout();
  }

  /**
   * 
   * @param {string} providerName 
   * @returns 
   */
  async selectProvider(providerName) {
    if (!providerName) {
      console.info(`clearing provider selection`);
      this.providerCtx = undefined;
      return;
    }

    // Prioritize the provider selection
    if (providerName == get(this.providerName)) {
      return;
    }

    try {
      this.providerCtx = await this.providerSwitch.select(providerName);
    } catch (err) {
      console.info(`failed to select provider ${providerName} ${err}`);
      return;
    }
  }
  async accountsChanged(name, ctx) {
    console.debug('accountsChanged');
  }

  async chainChanged(name, ctx) {
    console.debug('accountsChanged', name);
  }

  async disconnected(name, ctx) {
    console.debug('disconnected', name);
  }

  async refreshProviders() {
    const web3authOptions = async () => {
      const resp = await fetch(`/api/web3auth/`);
      const web3auth = await resp.json();
      if (web3auth?.error) {
        const error = JSON.stringify(web3auth.error);
        console.info(`error fetching web3auth options ${error}`);
        throw new Error(error);
      }
      return web3auth;
    };

    await this.providerSwitch.prepare(
      this.cfg.networks,
      (cfg) => {
        console.log(`preparing: ${cfg.name}`);
        if (cfg.type.startsWith('web3auth')) {
          return new Web3AuthModalProviderContext(cfg);
        }
        return new FetchProviderContext(cfg);
      },
      { fetch: true, web3authOptions }
    );

    return Object.values(this.providerSwitch.available).map((ctx) => ctx.cfg);
  }
}
