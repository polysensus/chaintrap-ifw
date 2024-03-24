import {ethers} from 'ethers';
import { error } from '@sveltejs/kit';
// import * as env from '$env/static/public';
// import { env as secrets } from '$env/dynamic/private';
import { json } from '$lib/server/request.js';

import {
  arenaConnect, ABIName, transcriptEventFilter, ArenaEvent, EventParser,
  gameToken/*, gameInstance,*/
} from '@polysensus/chaintrap-arenastate';

export async function GET({fetch, params}) {

  let resp = await fetch(`/api/chains/${params.chain}`);
  if (!resp.ok)
    throw error(resp.status, {message: `fetching chain config ${params.chain}`});

  /** @type {{url:string,arenaProxy:string}} */
  const chain = await resp.json();
  const provider = new ethers.providers.StaticJsonRpcProvider(chain.url);
  const arena = arenaConnect(chain.arenaProxy, provider);
  const eventParser = new EventParser(arena, ArenaEvent.fromParsedEvent);

  let token;
  if (typeof params.gid === 'string' && params.gid.startsWith("0x")) {
    token = ethers.BigNumber.from(params.gid);
  } else {
    // assume gid is just the instance number without the type
    token = gameToken(params.gid)
  }

  // const token = gameToken(params.gid);
  const hexToken = token.toHexString();
  let creatorAddress;

  let filter = transcriptEventFilter(
    arena, ABIName.TranscriptCreated, token);
  for (const log of await arena.queryFilter(filter)) {
    const ev = eventParser.parse(log);
    creatorAddress = ev.subject;
    break;
  }

  const registrations = []
  const halted = [];
  const active = {}

  filter = transcriptEventFilter(arena, ABIName.TranscriptRegistration, token);
  for (const log of await arena.queryFilter(filter)) {
    const ev = eventParser.parse(log);
    registrations.push(ev.update);
    active[ev.subject] = true;
  }

  filter = transcriptEventFilter(arena, ABIName.TranscriptParticipantHalted, token);
  for (const log of await arena.queryFilter(filter)) {
    const ev = eventParser.parse(log);
    halted.push(ev.subject);
    delete active[ev.subject];
  }
  console.log(`num halted ${halted.length}`)

  filter = transcriptEventFilter(arena, ABIName.TranscriptCompleted, token);
  const completed = (((await arena.queryFilter(filter)).length ?? 0) >= 1);
  const narratorVictory = completed && halted.length == registrations.length;

  let started = false;
  if (completed)
    started = true;
  else {
    filter = transcriptEventFilter(arena, ABIName.TranscriptStarted, token);
    started = (((await arena.queryFilter(filter)).length ?? 0) >= 1);
  }

  let victor;
  if (completed)
    victor = narratorVictory ? creatorAddress : Object.keys(active)[0].subject;

  const result = {narratorAddres: creatorAddress, arenaAddress:arena.address, gid:params.gid, token:hexToken, started, completed, registrations, halted, victor, narratorVictory};
  console.log(JSON.stringify(result));
  return json(result);
}