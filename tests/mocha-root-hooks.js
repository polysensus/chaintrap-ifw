import "fake-indexeddb/auto";

import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 
 * @param {string} maybe 
 * @returns 
 */
function isFile(maybe) {
  try {
    const stats = fs.statSync(maybe);
    return stats.isFile();
  } catch (err) {
    return false;
  }
}

export const mochaHooks = {
  beforeAll() {
    /** Global environment configuration for integration tests.
     *
     * .env.example.integ is the example that should be followed to fill in the
     * necessary config for the integration tests.
     *
     * CI/CD is expected to generate a .env file based on secrets configured in the pipeline.
     *
     * For local development one should be made by hand. Note that not all of the
     * variables are necessary, tests which don't have the config they need will
     * detect that its missing and auto skip.
     */

    const dotenvFile = path.join(
      __dirname,
      "..",
      process.env.DOTENV_FILE ?? ".env.test"
    );
    if (isFile(dotenvFile)) {
      console.log(`mocha-root-hook.js# test env config found at ${dotenvFile}`);
      dotenv.config({ path: dotenvFile });
    } else {
      console.log(
        `mocha-root-hook.js# no test env config found, "${dotenvFile}" is not a file`
      );
      dotenv.config();
    }
  },

  // async afterEach() { },

  // async beforeEach() { },
};
