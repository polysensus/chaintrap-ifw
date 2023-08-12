import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import { json } from '$lib/server/request.js';

/** @type {import('./arena/$types').RequestHandler} */
export function GET() {
  return json({
    name: 'op-goerli',
    description: 'Optimism Testnet replicates the Optimism Mainnet and is used for testing',
    chainConfig: {
      chainNamespace: 'eip155'
    },
    chainId: 420,
    currency: 'GoerliETH',
    url: secrets['OP_GOERLI_URL'],
    polling: env['PUBLIC_OP_GOERLI_POLLING'] ?? 2000,
    arenaProxy: env['PUBLIC_OP_GOERLI_ARENA_ADDRESS'],
    arenaDeployer: env['PUBLIC_OP_GOERLI_ARENA_DEPLOYER']
  });
}
