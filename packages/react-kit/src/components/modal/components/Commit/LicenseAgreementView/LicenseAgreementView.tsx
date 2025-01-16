import React, { useEffect } from "react";
import { Exchange } from "../../../../../types/exchange";
import License from "../../../../license/License";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { getCssVar } from "../../../../../theme";
import { HeaderView } from "../../../nonModal/headers/HeaderView";

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
  const { dispatch } = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        onArrowLeftClick: onBackClick,
        headerComponent: (
          <HeaderView
            text={"License Agreement"}
            showBosonLogoInHeader={showBosonLogoInHeader}
          />
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
