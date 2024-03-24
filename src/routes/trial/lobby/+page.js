import {error } from '@sveltejs/kit';

export async function load({params, fetch}) {

  // const gid = ethers.BigNumber.from(params.gid);
  let resp = await fetch(`/api/trials/open`);
  if (!resp.ok)
    throw error(resp.status, {message: `fetching /api/trials/open`});
  return {
    page: {
      openTrials: await resp.json()
    }
  }
}