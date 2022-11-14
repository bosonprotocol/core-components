import { BigNumberish } from "@ethersproject/bignumber";
import { getSubgraphSdk } from "../utils/graphql";
import {
  BaseMetadataEntityFieldsFragment,
  ProductV1MetadataEntityFieldsFragment,
  GetBaseMetadataEntityByIdQueryQueryVariables,
  GetBaseMetadataEntitiesQueryQueryVariables,
  GetProductV1BrandsQueryQueryVariables,
  GetProductV1ProductsQueryQueryVariables,
  GetProductV1CategoriesQueryQueryVariables,
  GetProductV1MetadataEntitiesQueryQueryVariables,
  GetProductV1MetadataEntityByIdQueryQueryVariables,
  BaseProductV1BrandFieldsFragment,
  BaseProductV1ProductFieldsFragment,
  BaseProductV1CategoryFieldsFragment,
  OfferFieldsFragment,
  ProductV1Variation,
  GetProductV1ProductsWithVariantsQueryQueryVariables,
  BaseProductV1ProductWithNotVoidedVariantsFieldsFragment,
  BaseProductV1ProductWithVariantsFieldsFragment,
  GetAllProductsWithNotVoidedVariantsQueryQueryVariables
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

export async function getProductV1Products(
  subgraphUrl: string,
  queryVars: GetProductV1ProductsQueryQueryVariables = {}
): Promise<BaseProductV1ProductFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { productV1Products = [] } =
    await subgraphSdk.getProductV1ProductsQuery({
      ...queryVars
    });

  return productV1Products;
}

export async function getAllProductsWithVariants(
  subgraphUrl: string,
  queryVars: GetProductV1ProductsWithVariantsQueryQueryVariables = {}
): Promise<BaseProductV1ProductWithVariantsFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { productV1Products = [] } =
    await subgraphSdk.getProductV1ProductsWithVariantsQuery({
      ...queryVars
    });

  return productV1Products;
}

export async function getAllProductsWithNotVoidedVariants(
  subgraphUrl: string,
  queryVars: GetAllProductsWithNotVoidedVariantsQueryQueryVariables = {}
): Promise<BaseProductV1ProductWithNotVoidedVariantsFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { productV1Products = [] } =
    await subgraphSdk.getAllProductsWithNotVoidedVariantsQuery({
      ...queryVars
    });

  return productV1Products;
}

export async function getProductWithVariants(
  subgraphUrl: string,
  productUuid: string
): Promise<{
  product: BaseProductV1ProductFieldsFragment;
  variants: {
    offer: OfferFieldsFragment;
    variations: ProductV1Variation[];
  }[];
} | null> {
  // Look for ProductV1MetadataEntities, filtered per productUuid
  const metadataEntities = await getProductV1MetadataEntities(subgraphUrl, {
    metadataFilter: {
      productUuid
    }
  });
  if (metadataEntities.length === 0) {
    return null;
  }
  return {
    product: metadataEntities[0].product,
    variants: metadataEntities.map((m) => {
      return {
        offer: m.offer,
        variations: m.variations
      };
    })
  };
}
