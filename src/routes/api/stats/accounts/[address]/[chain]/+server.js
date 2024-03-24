import {ethers} from 'ethers';
import { error } from '@sveltejs/kit';
// import * as env from '$env/static/public';
// import { env as secrets } from '$env/dynamic/private';
import { json } from '$lib/server/request.js';

import {
  arenaConnect, findGames, ABIName, transcriptEventFilter, ArenaEvent, EventParser
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

  const creatorAddress = ethers.utils.getAddress(params.address);
  let filter = transcriptEventFilter(
    arena, ABIName.TranscriptCreated, null, params.address);

  const createdGames = {};
  for (const log of await arena.queryFilter(filter)) {
    const ev = eventParser.parse(log);
    const hexGid = ethers.BigNumber.from(ev.gid).toHexString();
    createdGames[hexGid] = ev;
  }

  const completeGames = {};
  const incompleteGames = {};
  const registrantsHalted = [];
  const narratorVictories = {};

  // find all games transfered *from* the address
  filter = transcriptEventFilter(
    arena, ABIName.TransferSingle, null, creatorAddress);

  for (const log of await arena.queryFilter(filter)) {
    const ev = eventParser.parse(log);
    const hexGid = ethers.BigNumber.from(ev.gid).toHexString();
    const creation = createdGames[hexGid]
    if (!creation) continue;
    // Games only transfer if a raider is victorious. And the game is completed
    // in the same transaction.
    completeGames[hexGid] = creation;
  }

  for (const gidHex of Object.keys(createdGames)) {
    const gid = ethers.BigNumber.from(gidHex);

    filter = transcriptEventFilter(
      arena, ABIName.TranscriptParticipantHalted, gid);

    for (const log of await arena.queryFilter(filter)) {
      const ev = eventParser.parse(log);
      registrantsHalted.push(ev.subject);
    }
    const created = createdGames[gidHex];
    console.log(`registrationLimit: ${created.parsedLog.args.registrationLimit}`);
    if (registrantsHalted.length == created.parsedLog.args.registrationLimit) {
      narratorVictories[gidHex] = {registrantsHalted};
      continue
    }

    // if it is not transferred from the creator, or the creator is not
    // victorious, it counts as a #bad map. THis means that in progress games
    // will count as #bad maps and it looks bad to have lots of open games.
    if (!completeGames[gidHex])
      incompleteGames[gidHex] = created;
  }

  filter = transcriptEventFilter(
    arena, ABIName.TranscriptRegistration, null, params.address);

  const gameRegistrations = {}
  for (const log of await arena.queryFilter(filter)) {
    const ev = eventParser.parse(log);
    const hexGid = ethers.BigNumber.from(ev.gid).toHexString();
    gameRegistrations[hexGid] = ev
  }

  const gameDeaths = {}
  filter = transcriptEventFilter(
    arena, ABIName.TranscriptParticipantHalted, null, params.address);

  for (const log of await arena.queryFilter(filter)) {
    const ev = eventParser.parse(log);
    const hexGid = ethers.BigNumber.from(ev.gid).toHexString();
    gameDeaths[hexGid] = ev;
  }

  const mints = {}

  // find all games transfered *to* the address
  filter = transcriptEventFilter(
    arena, ABIName.TransferSingle, null, null, params.address);

  for (const log of await arena.queryFilter(filter)) {
    const ev = eventParser.parse(log);
    const hexGid = ethers.BigNumber.from(ev.gid).toHexString();
    if (ev.parsedLog.args.from === ethers.constants.AddressZero) {
      mints[hexGid] = ev;
    } else if (ev.parsedLog.args.from !== creatorAddress){
      narratorVictories[hexGid] = ev;
    }
  }

  // const games = await findGames(arena);
  // const games = [{gid: 0}, {gid: 1}];
  return json({createdGames, completeGames, gameRegistrations, gameDeaths, mints, narratorVictories, incompleteGames});
}