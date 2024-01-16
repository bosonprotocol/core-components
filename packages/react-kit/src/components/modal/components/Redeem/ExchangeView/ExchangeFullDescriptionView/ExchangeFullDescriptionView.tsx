import React, { useEffect } from "react";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../../types/exchange";
import { ExchangeFullDescription } from "./ExchangeFullDescription";
import { useNonModalContext } from "../../../../nonModal/NonModal";
import { theme } from "../../../../../../theme";
import { OnClickBuyOrSwapHandler } from "../../../common/detail/types";

const colors = theme.colors.light;
interface Props extends OnClickBuyOrSwapHandler {
  onBackClick: () => void;
  exchange: Exchange | null;
  onExchangePolicyClick: () => void;
}

export function ExchangeFullDescriptionView({
  onBackClick,
  exchange,
  onExchangePolicyClick,
  onClickBuyOrSwap
}: Props) {
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Grid style={{ flex: "1" }} gap="1rem">
            <ArrowLeft
              onClick={onBackClick}
              size={32}
              style={{ cursor: "pointer" }}
            />
            <Typography tag="h3" style={{ flex: "1" }}>
              {exchange?.offer.metadata.name || ""}
            </Typography>
          </Grid>
        ),
        contentStyle: {
          background: colors.white,
          padding: 0
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, exchange?.offer.metadata.name]);
  return (
    <>
      {!exchange ? (
        <p>Exchange could not be retrieved</p>
      ) : (
        <ExchangeFullDescription
          exchange={exchange}
          onExchangePolicyClick={onExchangePolicyClick}
          onClickBuyOrSwap={onClickBuyOrSwap}
        />
      )}
    </>
  );
}
