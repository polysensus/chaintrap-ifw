import {error } from '@sveltejs/kit';

export async function load({params, fetch}) {

  let resp = await fetch(`/api/stats/${params.address}/${params.chain}`);
  if (!resp.ok)
    throw error(resp.status, {message: `fetching  /api/stats/${params.address}/${params.chain}`});

  const stats = await resp.json();
  return {
    page: {
      address: params.address,
      chain: params.chain,
      ...stats
    }
  }
}