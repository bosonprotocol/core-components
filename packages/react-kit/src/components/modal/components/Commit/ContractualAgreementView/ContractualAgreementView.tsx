import React, { useEffect } from "react";
import ContractualAgreement from "../../../../contractualAgreement/ContractualAgreement";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { getCssVar } from "../../../../../theme";
import { Offer } from "../../../../../types/offer";
import { HeaderView } from "../../../nonModal/headers/HeaderView";

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
          <HeaderView
            text={"Contractual Agreement"}
            showBosonLogoInHeader={showBosonLogoInHeader}
          />
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
