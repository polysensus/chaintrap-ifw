// import { Request } from '@sveltejs/kit'
import { POSTproxy } from '$api/maptool/proxy.js';

export async function POST(event) {
  return POSTproxy(event, PUBLIC_MAPTOOL_URL);
}
