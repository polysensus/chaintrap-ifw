import { ethers } from "ethers";
/**
 * Game icon generation
 */

export class ImageGeneratorDefaults {
  static imageSizeIcon = '256x256';
}

export class ImageGeneratorOpenAI {
  /**
   * @param {Function} fetch
   * @param {string} apiPath
   * @param {{imageSize?:string,apiOptions?:object}} opts 
   */
  constructor(fetch, apiPath, opts={}) {
    this.fetch = fetch;
    this.apiPath = apiPath;
    this.opts = structuredClone(opts);
    if (!this.opts?.imageSize)
      this.opts.imageSize = ImageGeneratorDefaults.imageSizeIcon;
  }

  /**
   * 
   * @param {string} prompt 
   * @param {object} apiOptions 
   */
  async generate(prompt, apiOptions={}) {
    apiOptions = {...this.opts.apiOptions, ...apiOptions}
    const base64 = await generateImageBinary(
      this.apiPath, prompt, {
        fetch: this.fetch,
        imageSize: this.opts.imageSize,
        apiOptions
      });
    const contentType = "image/png";
    return {
      labels: ["ai-generated", "openai"], // TODO: add the ai model
      meta: {
        path: this.apiPath,
        prompt: prompt,
        openaiOptions: apiOptions,
        contentType: "image/png",
        // imgHeader + base64 creates an inline img appropriate for use as <img src=${imgHeader+base64}/>
        imgHeader:`data:${contentType};base64,`
      },
      base64
    }
  }
}

/**
 *
 * @param {string} path openai api url
 * @param {string} prompt the generation prompt
 * @param {{fetch?:Function,imageSize?:string,apiOptions?:object}} options
 * @returns
 */
export async function generateImageBinary(path, prompt, options) {
  if (!options.fetch)
    throw new Error("you must provide a fetch implementation");

  const body = {
    prompt,
    n: 1,
    size: options.imageSize ?? ImageGeneratorDefaults.imageSizeIcon,
    response_format: "b64_json",
    ...options.apiOptions,
  };

  // Note: it is assumed that the front end proxies via routes/api/openai/ to
  // get the auth and actual target url.
  const result = await options.fetch(path, {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    },
  });
  const j = await result.json();
  const b64json = j["data"][0]?.b64_json;
  if (!b64json) {
    throw new Error("No data item in response");
  }
  // return ethers.utils.base64.decode(b64json);
  return b64json;
}