import React from "react";
import CommitNonModal, {
  CommitNonModalProps
} from "../../modal/components/Commit/CommitNonModal";
import useProductByUuid from "../../../hooks/products/useProductByUuid";
// TODO: implement hook in this repo
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const useOffer = (a, b) => ({ data: undefined } as any);

function WithProductOrOffer(
  WrappedComponent: React.ComponentType<CommitNonModalProps>
) {
  const ComponentWithProductOrOffer = (
    props: Omit<
      CommitNonModalProps,
      "product" | "singleOffer" | "isLoading"
    > & {
      offerId?: string | undefined;
      sellerId?: string | undefined;
      productUuid?: string | undefined;
    }
  ) => {
    const allProductByUuidParamsDefined =
      !!props.sellerId && !!props.productUuid;
    const { data: product, isLoading: isProductLoading } = useProductByUuid(
      props.sellerId,
      props.productUuid,
      {
        enabled:
          (!props.offerId && allProductByUuidParamsDefined) ||
          !!(props.offerId && allProductByUuidParamsDefined)
      }
    );
    const { data: offer, isLoading: isOfferLoading } = useOffer(
      {
        id: props.offerId
      },
      {
        enabled: !props.productUuid && props.offerId
      }
    );
    return (
      <WrappedComponent
        {...props}
        product={product}
        singleOffer={offer}
        isLoading={isProductLoading || isOfferLoading}
      />
    );
  };
  return ComponentWithProductOrOffer;
}

export const CommitModalWithOffer = WithProductOrOffer(CommitNonModal);
