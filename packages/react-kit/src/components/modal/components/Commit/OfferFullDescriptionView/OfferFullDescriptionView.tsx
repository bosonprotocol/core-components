import React, { useEffect } from "react";
import { theme } from "../../../../../theme";
import { Offer } from "../../../../../types/offer";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { OfferFullDescription } from "../../common/OfferFullDescription";
import Grid from "../../../../ui/Grid";
import { ArrowLeft } from "phosphor-react";
import Typography from "../../../../ui/Typography";

const colors = theme.colors.light;
interface Props {
  onBackClick: () => void;
  offer: Offer;
}

export function OfferFullDescriptionView({ onBackClick, offer }: Props) {
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Grid gap="1rem" style={{ flex: "1 1" }} justifyContent="flex-start">
            <ArrowLeft
              onClick={onBackClick}
              size={32}
              style={{ cursor: "pointer" }}
            />
            <Typography tag="h3">{offer.metadata.name || ""}</Typography>
          </Grid>
        ),
        contentStyle: {
          background: colors.white,
          padding: 0
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, offer.metadata.name]);
  return <OfferFullDescription offer={offer} />;
}
