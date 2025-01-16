import React, { useEffect } from "react";
import { Exchange } from "../../../../../types/exchange";
import OfferPolicyDetails, {
  OfferPolicyDetailsProps
} from "../../../../offerPolicy/OfferPolicyDetails";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { getCssVar } from "../../../../../theme";
import { HeaderView } from "../../../nonModal/headers/HeaderView";

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
          <HeaderView
            text={offer?.metadata?.name || ""}
            showBosonLogoInHeader={showBosonLogoInHeader}
          />
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
