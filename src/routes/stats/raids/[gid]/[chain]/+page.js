import {error } from '@sveltejs/kit';

export async function load({params, fetch}) {

  // return json({started, completed, registrations, halted, victor, narratorVictory});
  let resp = await fetch(`/api/stats/raids/${params.gid}/${params.chain}`);
  if (!resp.ok)
    throw error(resp.status, {message: `fetching  /api/stats/raids/${params.gid}/${params.chain}`});

  const stats = await resp.json();
  return {
    page: {
      chain: params.chain,
      ...stats
    }
  }
}