import { ethers } from "ethers";
import * as env from '$env/static/public';
import { env as secrets } from '$env/dynamic/private';
import {json, error} from '@sveltejs/kit';
import { NFTStorage, File } from "nft.storage";

export async function POST({request}) {

  const data = await request.json();
  if (!data)
    throw error(404, {message:'bad request no payload'});

  const image = data.image?.bytes;
  if (!image)
    throw error(404, {message:'image.bytes is required (base64 string)'});
  const imageFilename = data?.image.filename; 
  if (!imageFilename)
    throw error(404, {message:'image.filename is required'});

  const imageContentType = data.image?.contentType;
  if (!imageContentType)
    throw error(404, {message:'image.contentType is required'});

  if (!data.metadata)
    throw error(404, {message:'metadata document is required'});
  const metadata = data.metadata;

  const codex = data.codex?.serialized;
  if (!codex)
    throw error(404, {message:'codex.serialized is required'});
  const codexFilename = data.codex?.filename;
  if (!codexFilename)
    throw error(404, {message:'codex.filename is required'});

  if (!metadata.properties)
    metadata.properties = {}

  const trialsetup = {
      ikeys: codex.ikeys,
      ipfs: new File(
        [JSON.stringify(codex)],
        codexFilename,
        { type: "application/json" }
    )
  };
  metadata.properties['trialsetup'] = trialsetup;
  metadata.image = new File(
    [ethers.utils.base64.decode(image)],
    imageFilename,
    { type: imageContentType }
    );

  const client = new NFTStorage({token:secrets['NFTSTORAGE_API_KEY']});
  const { token, car } = await NFTStorage.encodeNFT(metadata);
  const stored = await client.storeCar(car);

  return json({tokenURI: token.url});
}
