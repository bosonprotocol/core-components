import React, { useEffect } from "react";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import OfferPolicyDetails, {
  OfferPolicyDetailsProps
} from "../../../../offerPolicy/OfferPolicyDetails";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { getCssVar } from "../../../../../theme";
import { BosonLogo } from "../../common/BosonLogo";
import { ThemedBosonLogo } from "../../common/ThemedBosonLogo";

interface Props {
  onBackClick: () => void;
  offer: Exchange["offer"] | null | undefined;
  onContractualAgreementClick: OfferPolicyDetailsProps["onContractualAgreementClick"];
  onLicenseAgreementClick: OfferPolicyDetailsProps["onLicenseAgreementClick"];
  showBosonLogoInHeader: boolean;
}

export function CommitOfferPolicyView({
  onBackClick,
  offer,
  onContractualAgreementClick,
  onLicenseAgreementClick,
  showBosonLogoInHeader
}: Props) {
  const offerName = offer?.metadata?.name || "";
  const { dispatch, showConnectButton } = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        onArrowLeftClick: onBackClick,
        headerComponent: (
          <>
            <Typography tag="h3">{offer?.metadata?.name || ""}</Typography>
            <Grid
              gap="1rem"
              style={{ flex: "1 1" }}
              justifyContent={showConnectButton ? "center" : "flex-end"}
            >
              {showBosonLogoInHeader && <ThemedBosonLogo />}
            </Grid>
          </>
        ),
        contentStyle: {
          background: getCssVar("--background-accent-color")
        }
      }
    });
  }, [
    dispatch,
    offer?.metadata?.name,
    offerName,
    onBackClick,
    showBosonLogoInHeader,
    showConnectButton
  ]);
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
