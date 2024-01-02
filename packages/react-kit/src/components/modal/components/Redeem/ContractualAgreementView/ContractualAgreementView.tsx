import React, { useEffect } from "react";
import Grid from "../../../../ui/Grid";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import ContractualAgreement from "../../../../contractualAgreement/ContractualAgreement";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { theme } from "../../../../../theme";

const colors = theme.colors.light;
interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
}

export function ContractualAgreementView({ onBackClick, exchange }: Props) {
  const offer = exchange?.offer;
  const offerId = offer?.id;
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
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
          background: colors.white
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
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
