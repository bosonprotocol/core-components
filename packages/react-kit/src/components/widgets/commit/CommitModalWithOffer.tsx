import React from "react";
import {
  CommitNonModalProps,
  CommitWrapper
} from "../../modal/components/Commit/CommitNonModal";
import { useProductByUuid } from "../../../hooks/products/useProductByUuid";
import useProductByOfferId from "../../../hooks/products/useProductByOfferId";
import { useCoreSDKWithContext } from "../../../hooks/core-sdk/useCoreSdkWithContext";
import { useBundleByUuid } from "../../../hooks";
import { VariantV1 } from "../../../types/variants";
import { isTruthy } from "../../../types/helpers";
import { ProductV1Item, isProductV1Item } from "../../../lib/bundle/filter";
import { MetadataType } from "@bosonprotocol/core-sdk";

function WithProductOrOffer(
  WrappedComponent: React.ComponentType<CommitNonModalProps>
) {
  const ComponentWithProductOrOffer = (
    props: Omit<CommitNonModalProps, "product" | "isLoading"> & {
      offerId?: string;
      sellerId?: string;
      productUuid?: string;
      bundleUuid?: string;
      defaultSelectedOfferId?: string;
    }
  ) => {
    const coreSDK = useCoreSDKWithContext();
    const allProductByUuidParamsDefined =
      !!props.sellerId && !!props.productUuid;
    const allProductByOfferIdParamsDefined = !!props.offerId;
    const allBundleByUuidParamsDefined = !!props.sellerId && !!props.bundleUuid;
    const { data: product, isLoading: isProductLoading } = useProductByUuid(
      props.sellerId,
      props.productUuid,
      coreSDK,
      {
        enabled:
          allProductByUuidParamsDefined &&
          !allProductByOfferIdParamsDefined &&
          !allBundleByUuidParamsDefined
      }
    );

    const { data: productByOfferId, isLoading: isProductByOfferIdLoading } =
      useProductByOfferId(props.offerId, {
        enabled:
          allProductByOfferIdParamsDefined &&
          !allProductByUuidParamsDefined &&
          !allBundleByUuidParamsDefined
      });

    const { data: bundleResult, isLoading: isBundleLoading } = useBundleByUuid(
      props.sellerId,
      props.bundleUuid,
      coreSDK,
      {
        enabled:
          !allProductByOfferIdParamsDefined &&
          !allProductByUuidParamsDefined &&
          allBundleByUuidParamsDefined
      }
    );
    const variants: VariantV1[] | undefined =
      product || productByOfferId
        ? ((product || productByOfferId)?.variants?.filter(
            ({ offer: { metadata } }) =>
              metadata?.type === MetadataType.PRODUCT_V1.toString()
          ) as VariantV1[] | undefined)
        : bundleResult
            ?.flatMap((bundle) => {
              const bundleItems = bundle.items;
              const productV1Items = bundleItems
                ? bundleItems.filter((item): item is ProductV1Item =>
                    isProductV1Item(item)
                  )
                : undefined;
              if (!productV1Items) {
                return null;
              }
              return productV1Items.map(
                (productV1Item) =>
                  ({
                    variations: productV1Item.variations,
                    offer: bundle.offer
                  } as VariantV1)
              );
            })
            .filter(isTruthy);

    return (
      <WrappedComponent
        {...props}
        variants={variants}
        isLoading={
          isProductLoading || isProductByOfferIdLoading || isBundleLoading
        }
      />
    );
  };
  return ComponentWithProductOrOffer;
}

export const CommitModalWithOffer = WithProductOrOffer(CommitWrapper);
