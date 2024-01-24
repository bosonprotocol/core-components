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
  GetAllProductsWithNotVoidedVariantsQueryQueryVariables,
  GetBundleMetadataEntityByIdQueryQueryVariables,
  GetBundleMetadataEntitiesQueryQueryVariables,
  BundleMetadataEntityFieldsFragment,
  ItemMetadataType,
  ProductV1ItemMetadataEntity
} from "../subgraph";
import { productV1 } from "..";
import { productV1Item } from "@bosonprotocol/metadata";

export type SingleBaseMetadataEntityQueryVariables = Omit<
  GetBaseMetadataEntityByIdQueryQueryVariables,
  "metadataId"
>;

export type SingleProductV1MetadataEntityQueryVariables = Omit<
  GetProductV1MetadataEntityByIdQueryQueryVariables,
  "metadataId"
>;

export type SingleBundleMetadataEntityQueryVariables = Omit<
  GetBundleMetadataEntityByIdQueryQueryVariables,
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

export async function getBundleMetadataEntityByOfferId(
  subgraphUrl: string,
  offerId: BigNumberish,
  queryVars: SingleBundleMetadataEntityQueryVariables = {}
): Promise<BundleMetadataEntityFieldsFragment> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { bundleMetadataEntity } =
    await subgraphSdk.getBundleMetadataEntityByIdQuery({
      metadataId: `${offerId}-metadata`,
      ...queryVars
    });

  return bundleMetadataEntity;
}

export async function getBundleMetadataEntities(
  subgraphUrl: string,
  queryVars: GetBundleMetadataEntitiesQueryQueryVariables = {}
): Promise<BundleMetadataEntityFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { bundleMetadataEntities = [] } =
    await subgraphSdk.getBundleMetadataEntitiesQuery({
      ...queryVars
    });

  return bundleMetadataEntities;
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
  sellerId: string,
  productUuid: string
): Promise<{
  product: BaseProductV1ProductFieldsFragment;
  bundles: BundleMetadataEntityFieldsFragment[];
  variants: {
    offer: OfferFieldsFragment;
    variations: ProductV1Variation[];
  }[];
} | null> {
  // Look for ProductV1MetadataEntities, filtered per productUuid
  const productV1MetadataEntities = await getProductV1MetadataEntities(subgraphUrl, {
    metadataFilter: {
      productUuid,
      offer_: {
        sellerId
      }
    }
  });
  // Look for BundleMetadataEntities, filtered per productUuid
  const bundleMetadataEntities = await getBundleMetadataEntities(subgraphUrl, {
    metadataFilter: {
      productUuids_contains: [ productUuid ],
      offer_: {
        sellerId
      }
    }
  });
  if (productV1MetadataEntities.length + bundleMetadataEntities.length === 0) {
    return null;
  }
  const itemsFromBundles = bundleMetadataEntities.reduce((prev, bundle) => { 
    const itemsFromBundle = getProductV1ItemFromBundle(bundle, productUuid);
    return [...prev, ...itemsFromBundle];
  }, [] as { productV1Item: ProductV1ItemMetadataEntity, offer: ProductV1MetadataEntityFieldsFragment["offer"] }[])
  const product = productV1MetadataEntities.length
   ? productV1MetadataEntities[0].product
   : itemsFromBundles[0]?.productV1Item.product;
  const variants = productV1MetadataEntities.map((m) => {
    return {
      offer: m.offer,
      variations: m.variations
    };
  });
  const variantsFromBundleMap = itemsFromBundles.reduce((map, item) => {
    if (!map.has(item.offer.id)) { // ensure only add the same offer once
      map.set(item.offer.id, {
        offer: item.offer,
        variations: item.productV1Item.variations
      });
    }
    return map;
  }, new Map());
  variants.push(...Array.from(variantsFromBundleMap.values()));
  return {
    product, // return the product
    bundles: bundleMetadataEntities, // return all bundles that contain this product
    variants // return all variants for this product
  };
}

/** returns the productV1ItemMetadataEntities in a bundle for a given productUuid */
// Note: it may returns several items, in case the BUNDLE contains different variants of
// the same product (or even the same variant several times), 
function getProductV1ItemFromBundle(bundle: BundleMetadataEntityFieldsFragment, productUuid: string):
 { productV1Item: ProductV1ItemMetadataEntity, offer: ProductV1MetadataEntityFieldsFragment["offer"] }[] {
  return bundle.items
  .filter((item) => item.type === ItemMetadataType.ItemProductV1)
  .filter((item) => (item as ProductV1ItemMetadataEntity).productUuid === productUuid)
  .map((item) => {
    return { productV1Item: (item as ProductV1ItemMetadataEntity), offer: bundle.offer as ProductV1MetadataEntityFieldsFragment["offer"] };
  });
}