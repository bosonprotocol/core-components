import { convertToERC721Metadata, ERC721Metadata, sortObjKeys } from "../utils";
import { BaseIpfsStorage } from "./base";
import { Options } from "ipfs-http-client";
import { AnyMetadata, MetadataStorage } from "@bosonprotocol/metadata-storage";

/**
 * `MetadataStorage` implementation for IPFS.
 */
export class IpfsMetadataStorage
  extends BaseIpfsStorage
  implements MetadataStorage
{
  constructor(
    protected validateMetadata: (metadata: AnyMetadata) => void,
    opts: Options
  ) {
    super(opts);
  }

  /**
   * Validates and stores supported offer metadata on IPFS.
   * @param metadata - Offer metadata of any type.
   * @returns Metadata CID.
   */
  public async storeMetadata(metadata: AnyMetadata): Promise<string> {
    if (metadata.type) {
      this.validateMetadata(metadata);
    }
    const metadataConformingToERC721 = convertToERC721Metadata(metadata);
    const metadataWithSortedKeys = sortObjKeys(
      metadataConformingToERC721 as unknown as Record<string, unknown>
    );
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
    if (metadata.type) {
      this.validateMetadata(metadata);
    }

    return metadata;
  }
}
