import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import {
  getBaseMetadataEntities,
  getProductV1MetadataEntities,
  getProductV1Products,
  getProductWithVariants,
  getAllProductsWithVariants,
  getAllProductsWithNotVoidedVariants
} from "./subgraph";
import { AnyMetadata } from "@bosonprotocol/common";
import {
  BaseMetadataEntityFieldsFragment,
  BaseProductV1ProductFieldsFragment,
  BaseProductV1ProductWithNotVoidedVariantsFieldsFragment,
  BaseProductV1ProductWithVariantsFieldsFragment,
  GetAllProductsWithNotVoidedVariantsQueryQueryVariables,
  GetBaseMetadataEntitiesQueryQueryVariables,
  GetProductV1MetadataEntitiesQueryQueryVariables,
  GetProductV1ProductsQueryQueryVariables,
  GetProductV1ProductsWithVariantsQueryQueryVariables,
  OfferFieldsFragment,
  ProductV1MetadataEntityFieldsFragment,
  ProductV1Variation
} from "../subgraph";

export class MetadataMixin extends BaseCoreSDK {
  /* -------------------------------------------------------------------------- */
  /*                          Metadata related methods                          */
  /* -------------------------------------------------------------------------- */

  /**
   * Stores supported offer metadata via the MetadataStorage instance which was passed in
   * at construction.
   * @param metadata - Offer metadata of type `BASE` or `PRODUCT_V1`.
   * @returns Metadata hash / identifier.
   */
  public async storeMetadata(metadata: AnyMetadata): Promise<string> {
    if (!this._metadataStorage) {
      throw new Error("No metadata storage set");
    }

    return this._metadataStorage.storeMetadata(metadata);
  }

  /**
   * Returns supported offer metadata from passed in `MetadataStorage` instance.
   * @param metadataHashOrUri - Metadata hash or uri that can be handled by the
   * storage instance.
   * @returns Offer metadata.
   */
  public async getMetadata(metadataHashOrUri: string): Promise<AnyMetadata> {
    if (!this._metadataStorage) {
      throw new Error("No metadata storage set");
    }

    return this._metadataStorage.getMetadata(metadataHashOrUri);
  }

  /**
   * Returns `BASE` type offer metadata entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns BaseMetadataEntities from subgraph.
   */
  public async getBaseMetadataEntities(
    queryVars?: GetBaseMetadataEntitiesQueryQueryVariables
  ): Promise<BaseMetadataEntityFieldsFragment[]> {
    return getBaseMetadataEntities(this._subgraphUrl, queryVars);
  }

  /**
   * Returns `PRODUCT_V1` type offer metadata entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns ProductV1MetadataEntities from subgraph.
   */
  public async getProductV1MetadataEntities(
    queryVars?: GetProductV1MetadataEntitiesQueryQueryVariables
  ): Promise<ProductV1MetadataEntityFieldsFragment[]> {
    return getProductV1MetadataEntities(this._subgraphUrl, queryVars);
  }

  public async getProductV1Products(
    queryVars?: GetProductV1ProductsQueryQueryVariables
  ): Promise<BaseProductV1ProductFieldsFragment[]> {
    return getProductV1Products(this._subgraphUrl, queryVars);
  }

  public async getProductWithVariants(productUuid: string): Promise<{
    product: BaseProductV1ProductFieldsFragment;
    variants: Array<{
      offer: OfferFieldsFragment;
      variations: Array<ProductV1Variation>;
    }>;
  } | null> {
    return getProductWithVariants(this._subgraphUrl, productUuid);
  }

  public async getAllProductsWithVariants(
    queryVars?: GetProductV1ProductsWithVariantsQueryQueryVariables
  ): Promise<BaseProductV1ProductWithVariantsFieldsFragment[]> {
    return getAllProductsWithVariants(this._subgraphUrl, queryVars);
  }

  public async getAllProductsWithNotVoidedVariants(
    queryVars?: GetAllProductsWithNotVoidedVariantsQueryQueryVariables
  ): Promise<BaseProductV1ProductWithNotVoidedVariantsFieldsFragment[]> {
    return getAllProductsWithNotVoidedVariants(this._subgraphUrl, queryVars);
  }
}
