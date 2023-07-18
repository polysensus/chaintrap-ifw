import {ethers} from "ethers";
export const trials2Basic = [
    { // chaintrap-arenastate/trialsetup.js:TrialSetup defines this format
      gid: ethers.BigNumber.from(1),
      tokenUri: 'ipfs://xxx/yyy',
      codex: {},
      metadata: {
        // chaintrap-arenastate/erc1155metadata/gamecreator.js:configureMetadataOptions defines this format
        name: "game one",
        description: "The first game of chaintrap",
        image: "ipfs://zzz/bbb"
      }
    }, {
      gid: ethers.BigNumber.from(2),
      codex: {},
      tokenUri: 'ipfs://12345aaa/yyy',
      metadata: {
        // chaintrap-arenastate/erc1155metadata/gamecreator.js:configureMetadataOptions defines this format
        name: "game two",
        description: "The first game of chaintrap",
        image: "ipfs://zzz/bbb"
      }
    }];
