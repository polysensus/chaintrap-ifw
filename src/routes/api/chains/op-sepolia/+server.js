import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import { json } from '$lib/server/request.js';

/** @type {import('./arena/$types').RequestHandler} */
export function GET() {
  const chain = {
    name: 'op-sepolia',
    description: 'Optimism Testnet replicates the Optimism Mainnet and is used for testing',
    chainConfig: {
      chainNamespace: 'eip155'
    },
    chainId: 11155420,
    currency: 'SepoliaETH',
  }

  chain.polling = env['PUBLIC_OP_SEPOLIA_POLLING'] ?? 2000;
  if (secrets['OP_SEPOLIA_URL'])
    chain.url = secrets['OP_SEPOLIA_URL'];

  if (env['PUBLIC_OP_SEPOLIA_ARENA_ADDRESS'])
    chain.arenaProxy = env['PUBLIC_OP_SEPOLIA_ARENA_ADDRESS'];

  if (env['PUBLIC_OP_SEPOLIA_ARENA_DEPLOYER'])
    chain.arenaDeployer = env['PUBLIC_OP_SEPOLIA_ARENA_DEPLOYER'];

  if (env['PUBLIC_OP_SEPOLIA_ETHERSCAN_URL'])
    chain.etherscanUrl = env['PUBLIC_OP_SEPOLIA_ETHERSCAN_URL'];

  return json(chain);
}