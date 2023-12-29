import {ethers} from 'ethers';
import { error } from '@sveltejs/kit';
// import * as env from '$env/static/public';
// import { env as secrets } from '$env/dynamic/private';
import { json } from '$lib/server/request.js';

import {
  findGameMetadata, arenaConnect, ipfsFetchArgs, gameToken
} from '@polysensus/chaintrap-arenastate';

export async function GET({fetch, params}) {

  // Allow for hex encoded game ids:
  let gid;

  if (typeof params.gid === 'string' && params.gid.startsWith("0x")) {
    gid = ethers.BigNumber.from(params.gid);
  } else {
    // assume gid is just the instance number without the type
    gid = gameToken(params.gid)
  }

  let resp = await fetch(`/api/chains/${params.chain}`);
  if (!resp.ok)
    throw error(resp.status, {message: `fetching chain config ${params.chain}`});

  /** @type {{url:string,arenaProxy:string}} */
  const chain = await resp.json();
  const provider = new ethers.providers.StaticJsonRpcProvider(chain.url);
  const arena = arenaConnect(chain.arenaProxy, provider);
  let url = await findGameMetadata(arena, gid);
  console.log(`url: ${url}`);
  if (!url)
    throw error(404, {message: `no game found for gid ${gid.toHexString()}`});

  resp = await fetch(...ipfsFetchArgs(url));
  if (!resp.ok)
    throw error(resp.status, {message:`bad status ${resp.statusText} for metadataUrl ${params[0]}`});

  const metadata = await resp.json();
  console.log('got metadata');
  url = metadata?.properties?.trialsetup?.ipfs;
  console.log(`codexUrl: ${url}`)
  resp = await fetch(...ipfsFetchArgs(url));
  if (!resp.ok)
    throw error(resp.status, {message:`bad status ${resp.statusText} for trialsetup url ${url}`});

  const serialized = await resp.json();
  metadata.properties.trialsetup.serialized = serialized;
  return json(metadata);
}