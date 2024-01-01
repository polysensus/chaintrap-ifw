import {
  PUBLIC_OP_GOERLI_ARENA_ADDRESS,
  PUBLIC_OP_SEPOLIA_ARENA_ADDRESS,
  PUBLIC_HARDHAT_ARENA_ADDRESS
 } from '$env/static/public';
/** @type {import('./$types').PageLoad} */
export function load({params, url, route}) {
  return {
    arenaAddress:{
      "op-goerli": PUBLIC_OP_GOERLI_ARENA_ADDRESS,
      "op-sepolia": PUBLIC_OP_SEPOLIA_ARENA_ADDRESS,
      "hardhat": PUBLIC_HARDHAT_ARENA_ADDRESS,
    },
    request: {
      href:url.href,
      origin:url.origin,
      hostname:url.hostname,
      route,
      params
    }
  }
}