import React, { useMemo } from "react";
import { colors } from "../../../../../theme";
import { useDetailViewContext } from "../../common/detail/DetailViewProvider";
import { InnerDetailViewWithPortalProps } from "../../common/detail/InnerDetailViewWithPortal";
import { useNotCommittableOfferStatus } from "../useNotCommittableOfferStatus";
import InnerCommitDetailView, {
  InnerCommitDetailViewProps
} from "./InnerCommitDetailView";
import { InnerCommitDetailViewWithPortal } from "./InnerCommitDetailViewWithPortal";
import { QuantityDisplay } from "./common/QuantityDisplay";

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
        <InnerCommitDetailViewWithPortal
          {...props}
          priceSibling={priceSibling}
        />
      )}
    </>
  );
};
