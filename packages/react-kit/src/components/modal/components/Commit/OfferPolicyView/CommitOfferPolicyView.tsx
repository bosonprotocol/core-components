import React, { useEffect } from "react";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import OfferPolicyDetails, {
  OfferPolicyDetailsProps
} from "../../../../offerPolicy/OfferPolicyDetails";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { theme } from "../../../../../theme";
import { BosonFooter } from "../../common/BosonFooter";

const colors = theme.colors.light;
interface Props {
  onBackClick: () => void;
  offer: Exchange["offer"] | null | undefined;
  onContractualAgreementClick: OfferPolicyDetailsProps["onContractualAgreementClick"];
  onLicenseAgreementClick: OfferPolicyDetailsProps["onLicenseAgreementClick"];
}

export function CommitOfferPolicyView({
  onBackClick,
  offer,
  onContractualAgreementClick,
  onLicenseAgreementClick
}: Props) {
  const offerName = offer?.metadata?.name || "";
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Grid gap="1rem" style={{ flex: "1" }}>
            <ArrowLeft
              onClick={onBackClick}
              size={32}
              style={{ cursor: "pointer", flexShrink: 0 }}
            />
            <Typography tag="h3" style={{ flex: "1 1" }}>
              {offerName}
            </Typography>
          </Grid>
        ),
        contentStyle: {
          background: colors.white
        },
        footerComponent: <BosonFooter />
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, offerName]);
  return (
    <>
      {offer ? (
        <OfferPolicyDetails
          offer={offer}
          onContractualAgreementClick={onContractualAgreementClick}
          onLicenseAgreementClick={onLicenseAgreementClick}
        />
      ) : (
        <p>Offer could not be retrieved</p>
      )}
    </>
  );
}
