// This file
// --- lib imports
import jazzicon from "@metamask/jazzicon";
// --- framework imports
// --- app imports
import { getLogger } from '$lib/log.js'
// --- app store imports
// --- const definitions
const defaultIconSize = 41;
const addrSliceLen = 8;

const log = getLogger('avatars')
// --- global definitions (discouraged)

export function nameInitials(nickname) {
  if (typeof nickname === 'undefined') return "??";

  nickname = nickname.trim();
  if (nickname.length === 0)
    return "??";

  const parts = nickname.split(" ")
  const first = parts[0].slice(0, 1).toUpperCase()
  if (parts.length == 1)
    return first + parts[0].slice(1, 2)

  const last = parts[parts.length-1].slice(0, 1).toUpperCase();
  return first + last;
}

/**
 * 
 * @param {string} address hex
 */
export function addressIcon(address, opts) {
  if (typeof address === 'undefined') return undefined;
  if (address.startsWith('0x'))
    address = address.slice(2);
  return jazzicon(opts?.iconSize ?? defaultIconSize, parseInt(address.slice(0, addrSliceLen), 16));
}