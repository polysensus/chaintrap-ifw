import {error } from '@sveltejs/kit';

import { gidFromParam } from '$lib/paramtokenids.js';

export async function load({params, fetch}) {

  const gid = gidFromParam(params.gid);
  // const gid = ethers.BigNumber.from(params.gid);
  let resp = await fetch(`/api/trials/${gid.toHexString()}/${params.chain}`);
  if (!resp.ok)
    throw error(resp.status, {message: `fetching trial /api/trials/${gid.toHexString()}/${params.chain}`});
  return {
    page: {
      metadata: await resp.json(),
      gid,
      chain: params.chain
    }
  }
}