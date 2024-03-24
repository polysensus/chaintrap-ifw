import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import { json } from '$lib/server/request.js';

/** @type {import('./arena/$types').RequestHandler} */
export function GET() {

  const chain = {
    name: 'hardhat',
    description: 'The hardhat configuration is for local developer testing',
    chainConfig: {
      chainNamespace: 'eip155'
    },
    chainId: 31337,
    currency: 'ETH',
    url: secrets['PUBLIC_HARDHAT_URL'] ?? 'http://127.0.0.1:8545',
    polling: env['PUBLIC_HARDHAT_POLLING'] ?? 800,
  } 
  if (env['PUBLIC_HARDHAT_ARENA_ADDRESS'])
    chain.arenaProxy = env['PUBLIC_HARDHAT_ARENA_ADDRESS'];
  if (env['PUBLIC_HARDHAT_ARENA_DEPLOYER'])
    chain.arenaDeployer = env['PUBLIC_HARDHAT_ARENA_DEPLOYER'];

  return json(chain);
}
