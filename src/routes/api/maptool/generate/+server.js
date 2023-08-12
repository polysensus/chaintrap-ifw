// import { Request } from '@sveltejs/kit'
import { PUBLIC_MAPTOOL_URL } from '$env/static/public';
import { POSTproxy } from '$api/maptool/proxy.js';

export async function POST(event) {
  return POSTproxy(event, PUBLIC_MAPTOOL_URL, { forceIndex: true });
}
