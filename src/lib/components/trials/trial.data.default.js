import { ethers } from 'ethers';

export const trialDataDefault = {
  gid: ethers.BigNumber.from(1),
  tokenUri: '',
  gatewayImageUrl: '/static/nft-defaults/game-ico-2.png',
  codex: {},
  metadata: {
    title: 'A game of chaintrap',
    description: `
Chaintrap is a turn based, competitive, dungeon explorer game. This token
records the journey, and the fate, of a group of trialists.`,
    image: 'ipfs://xxx/yyy/foo.png'
  }
};
