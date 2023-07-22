/** deriveOptions
 * Creates new options object by merging the provided request and update options.
 *
 * The attributes of request which correspond to fetch(url, options) are copied
 * and then the update options are merged in.  The updateOptions have priority.
 * request and options may both be undefined.
 *
 * Note that only the request attributes strictly conforming to request options
 * are taken from the request instance. But ALL attributes of updateOptions will
 * be present in the returned options
 */
export function deriveOptions (request, updateOptions) {
  const options = {}

  for (const key of [
    'method',
    // 'headers',
    // 'body', CALLER MUST HANDLE THIS EXPLICITLY via updateOptions
    'mode',
    'credentials',
    'cache',
    'redirect',
    'referrer',
    'referrerPolicy',
    'integrity',
    'keepalive',
    'signal']) {
    if (typeof request?.[key] !== 'undefined') {
      options[key] = request[key]
    }
  }

  if (typeof request?.headers !== 'undefined') {
    options.headers = new Headers(request.headers)
  }
  if (typeof updateOptions?.headers !== 'undefined') {
    if (typeof options.headers === 'undefined') {
      options.headers = new Headers(updateOptions.headers)
    } else {
      for (const [name, value] of updateOptions.headers) {
        options.headers.append(name, value)
      }
    }
  }

  return { ...options, ...updateOptions }
}

/**
 * Create a Response instance for application/json
 * Note: would use @sveltejs/kit
 * import { json } from '@sveltejs/kit';
 *  Uncaught SyntaxError: ambiguous indirect export: is_external_url
 *  for @sveltejs/kit 1.0.0-next.573
 * @param {*} data any object
 * @returns 
 */
export function json(data) {
  const response = new Response(JSON.stringify(data), {
    status: 200,
    statusText: 'OK',
    headers: [
      ['content-type', 'application/json']
    ]
  });
  return response;
}