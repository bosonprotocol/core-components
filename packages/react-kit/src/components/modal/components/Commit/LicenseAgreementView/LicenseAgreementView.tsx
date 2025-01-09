import React, { useEffect } from "react";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import License from "../../../../license/License";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { getCssVar } from "../../../../../theme";
import { BosonLogo } from "../../common/BosonLogo";

interface Props {
  onBackClick: () => void;
  offer: Exchange["offer"] | null;
  showBosonLogoInFooter: boolean;
}

export function LicenseAgreementView({
  onBackClick,
  offer,
  showBosonLogoInFooter
}: Props) {
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Grid gap="1rem" justifyContent="flex-start" style={{ flex: "1 1" }}>
            <ArrowLeft
              onClick={onBackClick}
              size={32}
              style={{ cursor: "pointer" }}
            />
            <Typography tag="h3">License Agreement</Typography>
          </Grid>
        ),
        contentStyle: {
          background: getCssVar("--background-accent-color")
        },
        footerComponent: showBosonLogoInFooter ? <BosonLogo /> : null
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, showBosonLogoInFooter]);
  return (
    <>
      {offer ? (
        <License offerId={offer.id} offerData={offer} />
      ) : (
        <p>Offer could not be retrieved</p>
      )}
    </>
  );
}
