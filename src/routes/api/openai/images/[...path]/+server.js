import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import { POSTproxy } from '$api/proxy.js';

// This matches the full expected path and leaves the empty string, so we expect
// the PUBLIC_OPENAI_IMAGES_URL to get used as is.
const OPENAI_IMAGES_PREFIX='api/openai/images/generation';

export async function POST(event) {
  
  return POSTproxy(
    event,
    env['PUBLIC_OPENAI_IMAGES_URL'], {
    proxyPrefix:OPENAI_IMAGES_PREFIX,
    bearerToken:secrets['OPENAI_API_KEY']
  });
}