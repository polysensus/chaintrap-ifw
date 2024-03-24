import {
  ABIName,
  findGames,
  findGameCompleted,
  transcriptEventFilter,
  findGameCreated,
  findGameMetadata,
  ipfsFetchArgs
 } from "@polysensus/chaintrap-arenastate";
/**
 * 
 * @param {any} eventParser 
 * @param {number} limit 
 * @param {{incomplete?:boolean}} options 
 * @returns {Promise<number[]|import("ethers").BigNumber[]>}
 */
export async function findOwnedGames(eventParser, limit, options={}) {

  const owner = await eventParser?.contract?.signer?.getAddress();
  if (!owner) return [];

  const logs = await findGames(eventParser.contract);
  if (!logs || logs.length === 0) return [];
  let gids = [];

  for (const log of logs) {
    const ev = eventParser.parse(log);
    if (ev.subject !== owner) continue;
    if (options?.incomplete) {
      // only return games which are not complete
      const found = await findGameCompleted(eventParser.contract, ev.gid);
      if (found !== undefined) {
        console.log(`game ${ev.gid} is completed`)
        continue;
      }
    }
    gids.push(ev.gid);
  }

  gids = gids.slice(-limit);

  gids.sort((a, b)=>{return Number(a) - Number(b)})

  return gids;
}

export async function registrationStatus(eventParser, gid) {

  const arena = eventParser.contract;

  let log = await findGameCreated(arena, gid);
  if (!log)
    return undefined;

  const created = eventParser.parse(log);

  let filter = transcriptEventFilter(arena, ABIName.TranscriptRegistration, gid);
  const registrations = (await arena.queryFilter(filter)).map((log) => {
    const ev = eventParser.parse(log);
    return {address: ev.subject, profile: ev.update.profile}
  });

  const open = registrations.length < created.parsedLog.args.registrationLimit;

  log = findGameCompleted(arena, gid);
  if (log && log.gid  && log.gid.eq(gid)) {
    // console.log(`${JSON.stringify(log)} ${Object.keys(log)}`);
    return {created, registrations, registraionLimit:created.parsedLog.args.registrationLimit.toNumber(), open:false, started:true, completed:true};
  }
  // console.log(`log.gid ${log.gid} gid ${gid}`)

  filter = transcriptEventFilter(arena, ABIName.TranscriptStarted, gid);
  const started = (((await arena.queryFilter(filter)).length ?? 0) >= 1);
 
  return {created, registrations, registrationLimit:created.parsedLog.args.registrationLimit.toNumber(), open, started, completed:false}
}

export async function fetchGameMetadata(arena, gid) {
  let url = await findGameMetadata(arena, gid);
  if (!url)
    return undefined;
    // throw error(404, {message: `no game found for gid ${gid.toHexString()}`});

  let resp = await fetch(...ipfsFetchArgs(url));
  if (!resp.ok)
    throw error(resp.status, {message:`bad status ${resp.statusText} for metadataUrl ${params[0]}`});

  const metadata = await resp.json();
  console.log('got metadata');
  url = metadata?.properties?.trialsetup?.ipfs;
  console.log(`codexUrl: ${url}`)
  resp = await fetch(...ipfsFetchArgs(url));
  if (!resp.ok)
    throw error(resp.status, {message:`bad status ${resp.statusText} for trialsetup url ${url}`});

  // the data (including the map!) can be optionally encrypted but currently we
  // just put it in the clear for easy of testing.
  const serialized = await resp.json();
  metadata.properties.trialsetup.serialized = serialized;
  return metadata;
}