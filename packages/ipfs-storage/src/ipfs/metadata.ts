import { MetadataStorage, AnyMetadata } from "@bosonprotocol/metadata";
import { validateMetadata } from "../validation";
import { convertToERC721Metadata, ERC721Metadata, sortObjKeys } from "../utils";
import { BaseIpfsStorage } from "./base";
import { Options } from "ipfs-http-client";

/**
 * `MetadataStorage` implementation for IPFS.
 */
export class IpfsMetadataStorage
  extends BaseIpfsStorage
  implements MetadataStorage
{
  constructor(opts: Options) {
    super(opts);
  }

  /**
   * Validates and stores supported offer metadata on IPFS.
   * @param metadata - Offer metadata of type `BASE` or `PRODUCT_V1`.
   * @returns Metadata CID.
   */
  public async storeMetadata(metadata: AnyMetadata): Promise<string> {
    validateMetadata(metadata);
    const metadataConformingToERC721 = convertToERC721Metadata(metadata);
    const metadataWithSortedKeys = sortObjKeys(metadataConformingToERC721);
    const cid = await this.add(JSON.stringify(metadataWithSortedKeys));
    return cid;
  }

  /**
   * Returns supported offer metadata from IPFS. Throws if fetched JSON doesn't
   * conform to supported types.
   * @param metadataHashOrUri - Metadata hash / IPFS CID or URI.
   * @returns Offer metadata.
   */
  public async getMetadata(metadataUriOrHash: string): Promise<AnyMetadata> {
    const metadata = (await this.get<ERC721Metadata>(
      metadataUriOrHash
    )) as ERC721Metadata;
    validateMetadata(metadata);

    return metadata;
  }
}
