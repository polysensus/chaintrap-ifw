import { ethers } from 'ethers';
export const trials2Basic = [
  {
    // chaintrap-arenastate/trialsetup.js:TrialSetup defines this format
    gid: ethers.BigNumber.from(1),
    tokenUri: 'ipfs://xxx/yyy',
    gatewayImageUrl: '/static/nft-defaults/game-ico-2.png',
    codex: {},
    metadata: {
      // chaintrap-arenastate/erc1155metadata/gamecreator.js:configureMetadataOptions defines this format
      properties: {
        name: 'game one'
      },
      title: 'A game of chaintrap',
      description: 'The first game of chaintrap',
      image: 'ipfs://zzz/bbb'
    }
  },
  {
    gid: ethers.BigNumber.from(2),
    codex: {},
    tokenUri: 'ipfs://12345aaa/yyy',
    gatewayImageUrl: '/static/nft-defaults/game-ico-1.png',
    codex: {},
    metadata: {
      // chaintrap-arenastate/erc1155metadata/gamecreator.js:configureMetadataOptions defines this format
      properties: {
        name: 'game two'
      },
      title: 'A game of chaintrap',
      description: 'The first game of chaintrap',
      image: 'ipfs://zzz/bbb'
    }
  }
];
