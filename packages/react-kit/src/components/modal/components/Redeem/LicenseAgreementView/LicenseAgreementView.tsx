import React, { useEffect } from "react";
import { Grid } from "../../../../ui/Grid";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import License from "../../../../license/License";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { theme } from "../../../../../theme";
import { BosonLogo } from "../../common/BosonLogo";

const colors = theme.colors.light;
interface Props {
  onBackClick: () => void;
  offer: Exchange["offer"] | null | undefined;
}

export function LicenseAgreementView({ onBackClick, offer }: Props) {
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
            <h3 style={{ width: "100%", flex: 1 }}>License Agreement</h3>
          </Grid>
        ),
        contentStyle: {
          background: colors.white
        },
        footerComponent: <BosonLogo />
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  return (
    <>
      {offer ? (
        <License offerId={offer.id} offerData={offer} />
      ) : (
        <p>Exchange could not be retrieved</p>
      )}
    </>
  );
}
