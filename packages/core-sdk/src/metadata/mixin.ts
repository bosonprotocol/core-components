import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import * as subgraph from "../subgraph";
import { AnyMetadata } from "..";
import {
  getBaseMetadataEntities,
  getProductV1MetadataEntities,
  getProductV1Products,
  getProductWithVariants,
  getAllProductsWithVariants,
  getAllProductsWithNotVoidedVariants
} from "./subgraph";

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
    queryVars?: subgraph.GetBaseMetadataEntitiesQueryQueryVariables
  ): Promise<subgraph.BaseMetadataEntityFieldsFragment[]> {
    return getBaseMetadataEntities(this._subgraphUrl, queryVars);
  }

  /**
   * Returns `PRODUCT_V1` type offer metadata entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns ProductV1MetadataEntities from subgraph.
   */
  public async getProductV1MetadataEntities(
    queryVars?: subgraph.GetProductV1MetadataEntitiesQueryQueryVariables
  ): Promise<subgraph.ProductV1MetadataEntityFieldsFragment[]> {
    return getProductV1MetadataEntities(this._subgraphUrl, queryVars);
  }

  public async getProductV1Products(
    queryVars?: subgraph.GetProductV1ProductsQueryQueryVariables
  ): Promise<subgraph.BaseProductV1ProductFieldsFragment[]> {
    return getProductV1Products(this._subgraphUrl, queryVars);
  }

  public async getProductWithVariants(productUuid: string): Promise<{
    product: subgraph.BaseProductV1ProductFieldsFragment;
    variants: Array<{
      offer: subgraph.OfferFieldsFragment;
      variations: Array<subgraph.ProductV1Variation>;
    }>;
  } | null> {
    return getProductWithVariants(this._subgraphUrl, productUuid);
  }

  public async getAllProductsWithVariants(
    queryVars?: subgraph.GetProductV1ProductsWithVariantsQueryQueryVariables
  ): Promise<subgraph.BaseProductV1ProductWithVariantsFieldsFragment[]> {
    return getAllProductsWithVariants(this._subgraphUrl, queryVars);
  }

  public async getAllProductsWithNotVoidedVariants(
    queryVars?: subgraph.GetAllProductsWithNotVoidedVariantsQueryQueryVariables
  ): Promise<
    subgraph.BaseProductV1ProductWithNotVoidedVariantsFieldsFragment[]
  > {
    return getAllProductsWithNotVoidedVariants(this._subgraphUrl, queryVars);
  }
}
