import React from "react";
import CommitNonModal, {
  CommitNonModalProps
} from "../../modal/components/Commit/CommitNonModal";
import useProductByUuid from "../../../hooks/products/useProductByUuid";
import useProductByOfferId from "../../../hooks/products/useProductByOfferId";
import { useExchanges } from "../../../hooks/useExchanges";

function WithProductOrOffer(
  WrappedComponent: React.ComponentType<CommitNonModalProps>
) {
  const ComponentWithProductOrOffer = (
    props: Omit<CommitNonModalProps, "product" | "isLoading"> & {
      offerId?: string;
      sellerId?: string;
      productUuid?: string;
      defaultSelectedOfferId?: string;
    }
  ) => {
    const allProductByUuidParamsDefined =
      !!props.sellerId && !!props.productUuid;
    const { data: product, isLoading: isProductLoading } = useProductByUuid(
      props.sellerId,
      props.productUuid,
      {
        enabled: allProductByUuidParamsDefined
      }
    );
    const { data: productByOfferId, isLoading: isProductByOfferIdLoading } =
      useProductByOfferId(props.offerId, {
        enabled: !!props.offerId && !allProductByUuidParamsDefined
      });
    return (
      <WrappedComponent
        {...props}
        product={product || productByOfferId}
        isLoading={isProductLoading || isProductByOfferIdLoading}
      />
    );
  };
  return ComponentWithProductOrOffer;
}

export const CommitModalWithOffer = WithProductOrOffer(CommitNonModal);
