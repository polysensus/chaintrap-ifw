import { newTrialCodex } from '$lib/maptool.js';
import {
  prepareTrialMetadata,
  prepareTrialInitArgs,
  chaintrapGameDefaults
} from '@polysensus/chaintrap-arenastate';

import { GuardianCommandCtx } from './guardiancmd.js';

/**
 * Must be constructed at page global scope
 */
export class CreateGameCommandCtx extends GuardianCommandCtx {
  constructor(options) {
    super();
    this.options=options;
    this.result = undefined;
  }

  /**
   * Run the command
   * @param {string} name 
   * @param {string} description 
   * @param {number} maxParticipants 
   * @returns 
   */
  async run(name, description, maxParticipants) {
    this.result = undefined;

    if (!(this.guardian && this.trialPoster && this.map && this.furnishings)) {
      console.log(`guardian, poster, map and furnishings are all required to create a trial`);
      return;
    }

    const options = {};

    console.log('----');
    console.log(this.furnishings);

    const {codex, data, passwordGenerated} = await newTrialCodex({}, this.map, this.furnishings, this.map.meta.svg, options);
    this.guardian.setupTrial(codex, {password:passwordGenerated ?? (options.codexPassword ?? null)});

    const metadata = prepareTrialMetadata(this.map, this.guardian.trie, {name, description});

    const body = {
      image: {
        bytes: this.trialPoster.base64,
        contentType: this.trialPoster.meta.contentType,
        filename: `game-icon.${this.trialPoster.meta.contentType.split('/').pop() ?? 'png'}`
      },
      codex: {
        serialized: codex.serialize(),
        filename: 'blobcodex.json'
      },
      metadata
    };

    // Note: it is assumed that the front end proxies via routes/api/openai/ to
    // get the auth and actual target url.
    let result = await this.options.fetch(this.metadataURL, {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      },
    });
    const {tokenURI} = await result.json();
    console.log(`tokenURI: ${tokenURI}`);

    const args = prepareTrialInitArgs(metadata.properties, {
      ...chaintrapGameDefaults, registrationLimit: maxParticipants, tokenURI,
      networkEIP1559: options?.networkEIP1559
    });

    console.log(`guardian: ${this.guardian}, arena ${this.guardian.arena}, args: ${JSON.stringify(args)}`);
    this.result = {tokenURI, ...(await this.guardian.createGame(...args))};
    return this.result;
  }

  /**
   * 
   * @param {import('../console/completion.js').MatchResult} result 
   */
  async exec(result) {

    const name = result.values.name ?? `trial in ${this.map.name ?? "an un-named dungeon"}`;
    const description = result.values.description ?? 'a game of chaintrap';
    const maxParticipants = result.values.count;
    return await this.run(name, description, maxParticipants);
  }
}