import React, { useEffect } from "react";
import { getCssVar } from "../../../../../theme";
import { Offer } from "../../../../../types/offer";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { OfferFullDescription } from "../../common/OfferFullDescription/OfferFullDescription";
import { Grid } from "../../../../ui/Grid";
import { ArrowLeft } from "phosphor-react";
import { Typography } from "../../../../ui/Typography";
import { OnClickBuyOrSwapHandler } from "../../common/detail/types";
import { UseGetOfferDetailDataProps } from "../../common/detail/useGetOfferDetailData";
import { ThemedBosonLogo } from "../../common/ThemedBosonLogo";

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
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        onArrowLeftClick: onBackClick,
        headerComponent: (
          <Grid
            gap="1rem"
            style={{ flex: "1 1" }}
            justifyContent="space-between"
          >
            <Typography tag="h3">{offer.metadata?.name || ""}</Typography>
            {showBosonLogoInHeader && <ThemedBosonLogo />}
          </Grid>
        ),
        contentStyle: {
          background: getCssVar("--background-accent-color"),
          padding: 0
        }
      }
    });
  }, [dispatch, offer.metadata?.name, onBackClick, showBosonLogoInHeader]);
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
