import React, { useEffect } from "react";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import { Exchange } from "../../../../../types/exchange";
import License from "../../../../license/License";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { getCssVar } from "../../../../../theme";
import {
  defaultThemedBosonLogoProps,
  ThemedBosonLogo
} from "../../common/ThemedBosonLogo";

interface Props {
  onBackClick: () => void;
  offer: Exchange["offer"] | null;
  showBosonLogoInHeader: boolean;
}

export function LicenseAgreementView({
  onBackClick,
  offer,
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
            justifyContent="space-between"
            style={{ flex: "1 1" }}
          >
            <Typography tag="h3">License Agreement</Typography>
            {showBosonLogoInHeader && (
              <ThemedBosonLogo
                gridProps={{
                  ...defaultThemedBosonLogoProps.gridProps,
                  flex: 1
                }}
              />
            )}
          </Grid>
        ),
        contentStyle: {
          background: getCssVar("--background-accent-color")
        }
      }
    });
  }, [dispatch, showBosonLogoInHeader, onBackClick]);
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
