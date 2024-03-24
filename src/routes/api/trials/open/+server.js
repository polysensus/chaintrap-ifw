import {BigNumber, ethers} from 'ethers';
import { error } from '@sveltejs/kit';
// import * as env from '$env/static/public';
// import { env as secrets } from '$env/dynamic/private';
import { json } from '$lib/server/request.js';

const defaultPageSize = 10;

import {
  arenaConnect, gameInstance, gameToken,
  findGames, findGameMetadata, ArenaEvent, EventParser, transcriptEventFilter, ABIName
} from '@polysensus/chaintrap-arenastate';
import { registrationStatus, fetchGameMetadata } from '$lib/chaintrap.js';


async function fetchOpenTrialMetadata(chain, options) {

  const provider = new ethers.providers.StaticJsonRpcProvider(chain.url);
  const arena = arenaConnect(chain.arenaProxy, provider);

  const eventParser = new EventParser(arena, ArenaEvent.fromParsedEvent);

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
    // const metadata = await fetchGameMetadata(arena, gid);
    trials.push({gid: gid.toHexString(), registration, created: registration?.created, metadataURL});
  }
  return trials;
}

export async function GET({fetch, params, request}) {

  let resp = await fetch(`/api/chains`);
  if (!resp.ok)
    throw error(resp.status, {message: `fetching /api/chains`});
  const chains = await resp.json();

  const trials = [];
  for (const chain of chains) {
    // console.log(`0#-${ch.name} ${ch.arenaProxy} ${typeof ch.arenaProxy}`);
    // if (!ch.arenaProxy)
    if (!chain.arenaProxy) {
      continue;
    }
    for (const trial of (await fetchOpenTrialMetadata(chain))) {
      if (!trial)
        continue;
      trials.push({gid:trial.gid, trial, chain, chainId: chain.chainId, address:chain.arenaProxy})
    }
  }
  return json(trials);
}