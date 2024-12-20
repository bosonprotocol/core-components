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
import { BosonLogo } from "../../common/BosonLogo";

type Props = OnClickBuyOrSwapHandler & {
  onBackClick: () => void;
  offer: Offer;
  showBosonLogoInFooter: boolean;
} & Pick<UseGetOfferDetailDataProps, "onExchangePolicyClick">;

export function OfferFullDescriptionView({
  onBackClick,
  offer,
  onExchangePolicyClick,
  onClickBuyOrSwap,
  showBosonLogoInFooter
}: Props) {
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Grid gap="1rem" style={{ flex: "1 1" }} justifyContent="flex-start">
            <ArrowLeft
              onClick={onBackClick}
              size={32}
              style={{ cursor: "pointer" }}
            />
            <Typography tag="h3">{offer.metadata?.name || ""}</Typography>
          </Grid>
        ),
        contentStyle: {
          background: getCssVar("--background-accent-color"),
          padding: 0
        },
        footerComponent: showBosonLogoInFooter ? <BosonLogo /> : null
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, offer.metadata?.name, showBosonLogoInFooter]);
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
