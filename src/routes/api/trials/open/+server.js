import * as env from '$env/static/public';
import {ethers} from 'ethers';
import { error } from '@sveltejs/kit';
// import * as env from '$env/static/public';
// import { env as secrets } from '$env/dynamic/private';
import { json } from '$lib/server/request.js';

import { ProviderType } from '@polysensus/chaintrap-arenastate';
// connecting to hardhat will not work when deployed on vercel etc

//     types = `${ProviderType.NamedRPC},${ProviderType.Hardhat}`;
const providerTypes = env['PUBLIC_SERVER_SIDE_PROVIDER_TYPES'] ?? ProviderType.NamedRPC

const defaultPageSize = 10;

import {
  arenaConnect, gameInstance,
  findGames, findGameMetadata, ArenaEvent, EventParser, transcriptEventFilter, ABIName
} from '@polysensus/chaintrap-arenastate';
import { registrationStatus } from '$lib/chaintrap.js';


async function fetchOpenTrialMetadata(chain, options) {

  console.log(`#--- 2:1: ${chain.url}`);
  const provider = new ethers.providers.StaticJsonRpcProvider(chain.url);
  const arena = arenaConnect(chain.arenaProxy, provider);

  const eventParser = new EventParser(arena, ArenaEvent.fromParsedEvent);
  console.log(`#--- 2:2: ${chain.url}`);

  // we don't support paging but we do support specifying the head length;
  const gids = [];
  for (const log of await findGames(eventParser.contract))
    gids.push(eventParser.parse(log).gid);

  gids.sort((a ,b) => gameInstance(a) - gameInstance(b));

  console.log(`#gids: ${gids.length}`)
  const limit = options?.limit ?? defaultPageSize;
  if (gids.length > limit)
    gids.length = limit;


  const trials = [];
  for (const gid of gids) {
    const registration = await registrationStatus(eventParser, gid);
    // console.log(`registration: ${JSON.stringify(registration, null, ' ')}`)
    console.log(`registration.open: ${registration.open}, registered: ${registration?.registrations.length}, limit: ${registration?.created.parsedLog.args.registrationLimit}`)
    if (!registration.open)
       continue;
    console.log(`open gid: ${gameInstance(gid)}`)
    const metadataURL = await findGameMetadata(arena, gid);
    console.log(`#--- 2:3: ${metadataURL}`);
    // const metadata = await fetchGameMetadata(arena, gid);
    trials.push({gid: gid.toHexString(), registration, created: registration?.created, metadataURL});
  }
  return trials;
}

export async function GET({fetch, params, request}) {

  console.log('#--- 1')
  let resp = await fetch(`/api/chains?types=${providerTypes}`);
  if (!resp.ok)
    throw error(resp.status, {message: `fetching /api/chains`});
  const chains = await resp.json();

  console.log('#--- 2')
  const trials = [];
  for (const chain of chains) {
    // console.log(`0#-${ch.name} ${ch.arenaProxy} ${typeof ch.arenaProxy}`);
    // if (!ch.arenaProxy)
    if (!chain.arenaProxy) {
      continue;
    }
    console.log(`#--- 2: ${JSON.stringify(chain)}`);
    for (const trial of (await fetchOpenTrialMetadata(chain))) {
      if (!trial)
        continue;
      trials.push({gid:trial.gid, trial, chain, chainId: chain.chainId, address:chain.arenaProxy})
    }
  }
  console.log('#--- 3')
  return json(trials);
}