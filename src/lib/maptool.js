import { NameGenerator, CODEX_FURNITURE_INDEX } from '@polysensus/chaintrap-arenastate';
import { BlobCodex } from '@polysensus/blobcodex';
export const defaultSVGFilename = 'map.svg';

/**
 * @param {any} serialized
 * @param {{
 *  codexPassword?:string}} options

 * @param {*} options 
 */
export async function hydrateCodex(serialized, options={}) {
  const hydrateOpts = {...options}
  delete hydrateOpts.codexPassword;
  return BlobCodex.hydrate(serialized, [options?.codexPassword ?? null], hydrateOpts);
}

export class CreateMapResult {
  constructor() {
    this.ok = false;
    /** @type {object|undefined} */
    this.committed = undefined;
    /** @type {object|undefined} */
    this.map = undefined;
    /** @type {string|undefined} */
    this.svg = undefined;
  }
}

/**
 * @param {{
 *  arena_size:number,
 *  rooms:number,
 *  tile_snap_size:number,
 *  room_szmax:number,
 *  room_szmin:number,
 *  room_szratio:number,
 *  min_separation_factor:number,
 *  corridor_redundancy:number,
 *  main_room_thresh:number,
 *  tan_fudge:number,
 *  model:string
 * }} params
 * @param {{
 *  maptoolUrl:string,
 *  svg:boolean?,
 *  svgFilename:string?,
 *  codexPassword:string?,
 *  codexGeneratePassword:boolean?}} options
 * @returns {Promise<CreateMapResult|undefined>}
 */
export async function newMap(params, options) {

 const result = new CreateMapResult();

  var req = {
    credentials: 'omit',
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      gp: params
    })
  };

  let baseUrl = options.maptoolUrl;
  if (!baseUrl.endsWith('/')) baseUrl = baseUrl + '/';
  let url = `${baseUrl}commit/`;
  let resp = await fetch(url, req);
  const committed = await resp.json();

  req.body = JSON.stringify({
    public_key: committed.public_key,
    alpha: committed.alpha,
    beta: committed.beta,
    pi: committed.pi
  });

  url = `${baseUrl}generate/`;
  // info(`generating for alpha string: ${committed.alpha}`);
  resp = await fetch(url, req);
  if (resp.status !== 200) {
    console.log(`bad response status: ${resp.statusText}`);
    return undefined;
  }
  result.map = await resp.json();

  if (options.svg) {
    url = `${url}?svg=true`;
    resp = await fetch(url, req);
    if (resp.status !== 200) {
      console.log(`bad response status: ${resp.statusText}`);
      return undefined;
    }
    const svg = await resp.text();
    result.svg = svg;
  }

  result.ok = true;
  return result;
}

/**
 * @param {object} committed
 * @param {{
 *  comment?:string,
 *  name?:string,
 *  model:any,
 *  model_type:string,
 *  vrf_inputs:{
 *    alpha:string,
 *    proof: {beta:string,pi:string,public_key:string},
 *  secret:string, seed:string}}} map
 * @param {{
 *  unique_name: string,
 *  labels: string[],
 *  type: string,
 *  choiceType: string,
 *  data: {
 *    location:number,
 *    side?:number,
 *    exit?:number
 *    }
 *  meta: object
 * }[]} furnishings
 * @param {string} svg
 * @param {{
 *  codexPassword:string?,
 *  svgFilename?:string,
 *  codexGeneratePassword:boolean?}} options
 * @returns {Promise<{
 *  ok:boolean,
 *  passwordGenerated?:string,
 *  codex:BlobCodex|undefined,
 *  data:string|undefined
 * }>}
 */
export async function newTrialCodex(committed, map, furnishings, svg, options) {
  /** @type {{
   * ok:boolean,
   *  passwordGenerated?:string|undefined,
   *  codex:BlobCodex|undefined,
   *  data:string|undefined
   * }} */
  const result = {
    ok: false,
    passwordGenerated: undefined,
    codex: undefined,
    data: undefined
  };

  let password = options.codexPassword ?? null;
  if (password === null && options.codexGeneratePassword) {
    const g = new NameGenerator({ fetch });
    password = (await g.getSurnames(2)).join('-');
    result.passwordGenerated = password ?? undefined;
  }

  const codex = new BlobCodex();
  await codex.derivePasswordKeys([password]);

  codex.addItem(codex.dataFromObject(committed), {
    name: 'committed',
    content_type: 'application/json',
    encrypted: password !== null
  });

  codex.addItem(codex.dataFromObject(map), {
    name: 'map',
    content_type: 'application/json',
    encrypted: password !== null
  });

  codex.addItem(codex.dataFromObject({
    map:{
      name: map.name,
      beta: map.vrf_inputs.proof.beta
    },
    items: furnishings
  }), {
    name: CODEX_FURNITURE_INDEX,
  });


  codex.addItem(
    codex.dataFromObject({
      filename: options.svgFilename ?? defaultSVGFilename,
      content: svg
    }),
    { name: 'svg', content_type: 'image/svg+xml' }
  );

  result.data = JSON.stringify(codex.serialize(), null, ' ');
  result.codex = codex;
  result.ok = true;
  return result;
}