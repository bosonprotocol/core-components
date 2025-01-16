import React, { useEffect } from "react";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import { ArrowLeft } from "phosphor-react";
import ContractualAgreement from "../../../../contractualAgreement/ContractualAgreement";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { getCssVar } from "../../../../../theme";
import { Offer } from "../../../../../types/offer";
import {
  defaultThemedBosonLogoProps,
  ThemedBosonLogo
} from "../../common/ThemedBosonLogo";

interface Props {
  onBackClick: () => void;
  offer: Offer | null;
  showBosonLogoInHeader: boolean;
}

export function ContractualAgreementView({
  onBackClick,
  offer,
  showBosonLogoInHeader
}: Props) {
  const offerId = offer?.id;
  const { dispatch } = useNonModalContext();
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
            <Typography tag="h3">Contractual Agreement</Typography>
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
  }, [dispatch, onBackClick, showBosonLogoInHeader]);
  return (
    <>
      {offer ? (
        <ContractualAgreement offerId={offerId} offerData={offer} />
      ) : (
        <p>Offer could not be retrieved</p>
      )}
    </>
  );
}
