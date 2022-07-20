import { BigNumberish } from "@ethersproject/bignumber";
import { getSubgraphSdk } from "../utils/graphql";
import {
  BaseMetadataEntityFieldsFragment,
  ProductV1MetadataEntityFieldsFragment,
  GetBaseMetadataEntityByIdQueryQueryVariables,
  GetBaseMetadataEntitiesQueryQueryVariables,
  GetProductV1BrandsQueryQueryVariables,
  GetProductV1CategoriesQueryQueryVariables,
  GetProductV1MetadataEntitiesQueryQueryVariables,
  GetProductV1MetadataEntityByIdQueryQueryVariables,
  BaseProductV1BrandFieldsFragment,
  BaseProductV1CategoryFieldsFragment
} from "../subgraph";

export type SingleBaseMetadataEntityQueryVariables = Omit<
  GetBaseMetadataEntityByIdQueryQueryVariables,
  "metadataId"
>;

export type SingleProductV1MetadataEntityQueryVariables = Omit<
  GetProductV1MetadataEntityByIdQueryQueryVariables,
  "metadataId"
>;

export async function getBaseMetadataEntityByOfferId(
  subgraphUrl: string,
  offerId: BigNumberish,
  queryVars: SingleBaseMetadataEntityQueryVariables = {}
): Promise<BaseMetadataEntityFieldsFragment> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { baseMetadataEntity } =
    await subgraphSdk.getBaseMetadataEntityByIdQuery({
      metadataId: `${offerId}-metadata`,
      ...queryVars
    });

  return baseMetadataEntity;
}

export async function getBaseMetadataEntities(
  subgraphUrl: string,
  queryVars: GetBaseMetadataEntitiesQueryQueryVariables = {}
): Promise<BaseMetadataEntityFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { baseMetadataEntities = [] } =
    await subgraphSdk.getBaseMetadataEntitiesQuery({
      ...queryVars
    });

  return baseMetadataEntities;
}

export async function getProductV1MetadataEntityByOfferId(
  subgraphUrl: string,
  offerId: BigNumberish,
  queryVars: SingleProductV1MetadataEntityQueryVariables = {}
): Promise<ProductV1MetadataEntityFieldsFragment> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { productV1MetadataEntity } =
    await subgraphSdk.getProductV1MetadataEntityByIdQuery({
      metadataId: `${offerId}-metadata`,
      ...queryVars
    });

  return productV1MetadataEntity;
}

export async function getProductV1MetadataEntities(
  subgraphUrl: string,
  queryVars: GetProductV1MetadataEntitiesQueryQueryVariables = {}
): Promise<ProductV1MetadataEntityFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { productV1MetadataEntities = [] } =
    await subgraphSdk.getProductV1MetadataEntitiesQuery({
      ...queryVars
    });

  return productV1MetadataEntities;
}

export async function getProductV1Brands(
  subgraphUrl: string,
  queryVars: GetProductV1BrandsQueryQueryVariables = {}
): Promise<BaseProductV1BrandFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { productV1Brands = [] } = await subgraphSdk.getProductV1BrandsQuery({
    ...queryVars
  });

  return productV1Brands;
}

export async function getProductV1Categories(
  subgraphUrl: string,
  queryVars: GetProductV1CategoriesQueryQueryVariables = {}
): Promise<BaseProductV1CategoryFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { productV1Categories = [] } =
    await subgraphSdk.getProductV1CategoriesQuery({
      ...queryVars
    });

  return productV1Categories;
}
