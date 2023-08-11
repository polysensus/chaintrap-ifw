// import { Request } from '@sveltejs/kit'
import { json } from '@sveltejs/kit';
// import { env } from '$env/dynamic/private'

const MAPTOOL_SEGMENT = 'maptool'

export function trimEnd(path, value) {
  return path.endsWith(value) ? path.slice(0, path.length - value.length) : path
}

export function trimStart(path, value) {
  return path.startsWith(value) ? path.slice(value.length) : path
}

/**
 * 
 * @param {*} event 
 * @param {*} maptoolUrl 
 * @param {{forceIndex:boolean?}} options 
 * @returns 
 */
export async function POSTproxy (event, maptoolUrl, options) {

  // host:port/path/to/maptool/commit
  // -> /commit
  let requestUrl = event.request.url;
  if (options.forceIndex)
    requestUrl = trimEnd(requestUrl, '/') + '/';
  let uin = new URL(requestUrl);

  let i = uin.pathname.indexOf(MAPTOOL_SEGMENT)
  if (i < 0) {
    // if svelte kit is routing propertly this should not happen
    throw new Error(`bad path, missing ${MAPTOOL_SEGMENT} in ${uin.href}`)
  }

  let path = trimStart(uin.pathname.slice(i+MAPTOOL_SEGMENT.length), '/')
  let api = trimEnd(maptoolUrl, '/')

  const data = await event.request.json();
  console.log(JSON.stringify(data, null, ' . '));

  const proxyUrl = new URL(MAPTOOL_SEGMENT + '/' + path, api);
  console.log(`${event.request.url} -> ${proxyUrl}, path=${path}, api=${api}, forceIndex=${options.forceIndex}`);

  // const options = deriveOptions(event.request)
  // const request = new Request(url, options)
  const request = new Request(proxyUrl, {
    method: event.request.method,
    body: JSON.stringify(data),
    keepalive: event.request.keepalive,
    headers: [
      ['content-type', 'application/json']
    ]
  })

  let upstream, body, response;
  try {
    upstream = await fetch(request);
  } catch (err) {
    console.log('maptool headers', request.headers);
    console.log('fetch error:', err);
    return json(err);
  }
  try {
    const body = JSON.stringify(await upstream.json());
    const response = new Response(body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: [
        ['content-type', 'application/json'],
        ['date', upstream.headers.get('date')],
        ['vary', upstream.headers.get('vary')]
      ]
    });
    console.log('maptool status', response.statusText);
    return response;
  } catch (err) {
    console.log(upstream);
    console.log('response error:', err);
    return json(err);
  }
}
