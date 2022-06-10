import { MetadataStorage, AnyMetadata } from "@bosonprotocol/metadata";
import { validateMetadata } from "../validation";
import { convertToERC721Metadata, ERC721Metadata, sortObjKeys } from "../utils";
import { BaseIpfsStorage } from "./base";
import { Options } from "ipfs-http-client";
import { DEFAULT_THE_GRAPH_IPFS_URL } from "../constants";

export class IpfsMetadataStorage
  extends BaseIpfsStorage
  implements MetadataStorage
{
  constructor(opts: Options) {
    super(opts);
  }

  static fromTheGraphIpfsUrl(theGraphIpfsUrl?: string) {
    return new IpfsMetadataStorage({
      url: theGraphIpfsUrl || DEFAULT_THE_GRAPH_IPFS_URL
    });
  }

  public async storeMetadata(metadata: AnyMetadata): Promise<string> {
    validateMetadata(metadata);
    const metadataConformingToERC721 = convertToERC721Metadata(metadata);
    const metadataWithSortedKeys = sortObjKeys(metadataConformingToERC721);
    const cid = await this.add(metadataWithSortedKeys);
    return cid;
  }

  public async getMetadata(metadataUriOrHash: string): Promise<AnyMetadata> {
    const metadata = await this.get<ERC721Metadata>(metadataUriOrHash);
    validateMetadata(metadata);

    return metadata;
  }
}
