import React, { useEffect } from "react";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import { ArrowLeft } from "phosphor-react";
import ContractualAgreement from "../../../../contractualAgreement/ContractualAgreement";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { colors } from "../../../../../theme";
import { Offer } from "../../../../../types/offer";
import { BosonLogo } from "../../common/BosonLogo";

interface Props {
  onBackClick: () => void;
  offer: Offer | null;
}

export function ContractualAgreementView({ onBackClick, offer }: Props) {
  const offerId = offer?.id;
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
            <Typography tag="h3">Contractual Agreement</Typography>
          </Grid>
        ),
        contentStyle: {
          background: colors.white
        },
        footerComponent: <BosonLogo />
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
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
