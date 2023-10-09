import React, { useEffect } from "react";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../../types/exchange";
import { ExchangeFullDescription } from "./ExchangeFullDescription";
import { useNonModalContext } from "../../../../nonModal/NonModal";
import { theme } from "theme";

const colors = theme.colors.light;
interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
}

export function ExchangeFullDescriptionView({ onBackClick, exchange }: Props) {
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Grid>
            <ArrowLeft
              onClick={onBackClick}
              size={32}
              style={{ cursor: "pointer" }}
            />
            <Typography tag="h3">
              {exchange?.offer.metadata.name || ""}
            </Typography>
          </Grid>
        ),
        contentStyle: {
          background: colors.white
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
        <ExchangeFullDescription exchange={exchange} />
      )}
    </>
  );
}
