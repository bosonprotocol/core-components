import React, { useEffect } from "react";
import { Grid } from "../../../../ui/Grid";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import ContractualAgreement from "../../../../contractualAgreement/ContractualAgreement";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { getCssVar } from "../../../../../theme";
import { BosonLogo } from "../../common/BosonLogo";

interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
  showBosonLogoInFooter: boolean;
}

export function ContractualAgreementView({
  onBackClick,
  exchange,
  showBosonLogoInFooter
}: Props) {
  const offer = exchange?.offer;
  const offerId = offer?.id;
  const { dispatch } = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        onArrowLeftClick: null,
        headerComponent: (
          <Grid style={{ flex: "1" }} gap="1rem" justifyContent="flex-start">
            <ArrowLeft
              onClick={onBackClick}
              size={32}
              style={{ cursor: "pointer" }}
            />
            <h3 style={{ width: "100%", flex: 1 }}>Contractual Agreement</h3>
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
      {exchange ? (
        <ContractualAgreement offerId={offerId} offerData={offer} />
      ) : (
        <p>Exchange could not be retrieved</p>
      )}
    </>
  );
}
