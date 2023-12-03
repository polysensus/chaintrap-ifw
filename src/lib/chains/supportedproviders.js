import { ProviderType } from '@polysensus/chaintrap-arenastate';

export function namedProviderRoute(page) {
  if (typeof page?.url?.pathname !== "string") return undefined;

  const segments = page.url.pathname.split("/");
  const candidate = segments.pop();
  if (typeof candidate === 'undefined') return undefined;

  if (candidate in all) return candidate;

  return undefined;
}

export const all = {};
all['op-goerli'] = {
  name: 'op-goerli',
  type: ProviderType.Web3AuthModal,
  fetch: true
};

all['hardhat'] = {
  name: 'hardhat',
  type: ProviderType.Hardhat,
  note: 'this address is for the 10th well known hardhat account',
  arenaDeployer: 'hardhat:10',
  polling: 1000,
  description: 'local connection to a (probably) simulated chain for automated testing',
  url: 'http://127.0.0.1:8545/',
  chainId: 31337,

  // info becomes connectionInfo when a JsonRpcProvider is used. The url is taken from the top level cfg
  info: {
    // skipFetchSetup is crucial. hardhat connections don't work if the
    // default fetch setup is applied.  the default fetch request options
    // include referrer: client. And for reasons I don't understand, this
    // causes ERR_INVALID_URL. All of the other defaults, including cors &
    // same-origin appear to be fine
    skipFetchSetup: true
  }
};

export const testNetworks = {
  hardhat: all.hardhat
};
