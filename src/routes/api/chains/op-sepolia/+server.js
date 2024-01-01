import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import { json } from '$lib/server/request.js';

/** @type {import('./arena/$types').RequestHandler} */
export function GET() {
  return json({
    name: 'op-sepolia',
    description: 'Optimism Testnet replicates the Optimism Mainnet and is used for testing',
    chainConfig: {
      chainNamespace: 'eip155'
    },
    chainId: 11155420,
    currency: 'SepoliaETH',
    url: secrets['OP_SEPOLIA_URL'],
    polling: env['PUBLIC_OP_SEPOLIA_POLLING'] ?? 2000,
    arenaProxy: env['PUBLIC_OP_SEPOLIA_ARENA_ADDRESS'],
    arenaDeployer: env['PUBLIC_OP_SEPOLIA_ARENA_DEPLOYER']
  });
}