import React, { useEffect } from "react";
import { getCssVar } from "../../../../../theme";
import { Offer } from "../../../../../types/offer";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { OfferFullDescription } from "../../common/OfferFullDescription/OfferFullDescription";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import { OnClickBuyOrSwapHandler } from "../../common/detail/types";
import { UseGetOfferDetailDataProps } from "../../common/detail/useGetOfferDetailData";
import { ThemedBosonLogo } from "../../common/ThemedBosonLogo";
import { HeaderView } from "../../../nonModal/headers/HeaderView";

type Props = OnClickBuyOrSwapHandler & {
  onBackClick: () => void;
  offer: Offer;
  showBosonLogoInHeader: boolean;
} & Pick<UseGetOfferDetailDataProps, "onExchangePolicyClick">;

export function OfferFullDescriptionView({
  onBackClick,
  offer,
  onExchangePolicyClick,
  onClickBuyOrSwap,
  showBosonLogoInHeader
}: Props) {
  const { dispatch, showConnectButton } = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        onArrowLeftClick: onBackClick,
        headerComponent: (
          <HeaderView
            text={offer.metadata?.name || ""}
            showBosonLogoInHeader={showBosonLogoInHeader}
          />
        ),
        contentStyle: {
          background: getCssVar("--background-accent-color"),
          padding: 0
        }
      }
    });
  }, [
    dispatch,
    offer.metadata?.name,
    onBackClick,
    showBosonLogoInHeader,
    showConnectButton
  ]);
  return (
    <OfferFullDescription
      includeOverviewTab
      includeGeneralProductDataTab
      offer={offer}
      exchange={null}
      onExchangePolicyClick={onExchangePolicyClick}
      onClickBuyOrSwap={onClickBuyOrSwap}
    />
  );
}
