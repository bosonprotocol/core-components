import React, { useMemo } from "react";
import { theme } from "../../../../../theme";
import { useNotCommittableOfferStatus } from "../useNotCommittableOfferStatus";
import InnerCommitDetailView, {
  InnerCommitDetailViewProps
} from "./InnerCommitDetailView";
import {
  InnerDetailViewWithPortal,
  InnerDetailViewWithPortalProps
} from "../../common/detail/InnerDetailViewWithPortal";
import { useDetailViewContext } from "../../common/detail/DetailViewProvider";
import { QuantityDisplay } from "./common/QuantityDisplay";
const colors = theme.colors.light;

export type InnerDetailWithProviderCommitProps =
  | Omit<InnerCommitDetailViewProps, "priceSibling">
  | Omit<InnerDetailViewWithPortalProps, "priceSibling">;

export const InnerDetailWithProviderCommit: React.FC<
  InnerDetailWithProviderCommitProps
> = (props) => {
  const withCTAs = !("children" in props);
  const { selectedVariant } = props;
  const { offer } = selectedVariant;
  const { quantity } = useDetailViewContext();
  const notCommittableOfferStatus = useNotCommittableOfferStatus({
    isOfferVoided: offer.voided
  });
  const quantityInitial = useMemo<number>(
    () => Number(offer?.quantityInitial || 0),
    [offer?.quantityInitial]
  );
  const priceSibling = (
    <>
      {notCommittableOfferStatus ? (
        <span style={{ color: colors.orange, textAlign: "right" }}>
          {notCommittableOfferStatus}
        </span>
      ) : (
        <QuantityDisplay
          quantityInitial={quantityInitial}
          quantity={quantity}
        />
      )}
    </>
  );
  return (
    <>
      {withCTAs ? (
        <InnerCommitDetailView {...props} priceSibling={priceSibling} />
      ) : (
        <InnerDetailViewWithPortal {...props} priceSibling={priceSibling} />
      )}
    </>
  );
};
