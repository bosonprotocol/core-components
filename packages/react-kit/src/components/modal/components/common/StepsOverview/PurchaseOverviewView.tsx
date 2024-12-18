import { ArrowLeft } from "phosphor-react";
import React, { useEffect } from "react";
import { PurchaseOverviewInner } from "./PurchaseOverview";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { colors } from "../../../../../theme";
import { Grid } from "../../../../ui/Grid";
import { BosonLogo } from "../BosonLogo";

type Props = {
  onBackClick?: () => void;
};
export function PurchaseOverviewView({ onBackClick }: Props) {
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Grid style={{ flex: "1" }} justifyContent="flex-start" gap="1rem">
            {onBackClick && (
              <ArrowLeft
                onClick={() => {
                  onBackClick();
                }}
                size={32}
                style={{ cursor: "pointer", minWidth: "32px" }}
              />
            )}
            <BosonLogo
              gridProps={{ justifyContent: "flex-start" }}
              svgImageProps={{
                width: undefined,
                style: { width: "min-content" }
              }}
            />
          </Grid>
        ),
        contentStyle: {
          background: colors.white
        },
        footerComponent: null
      }
    });
  }, [dispatch, onBackClick]);
  return <PurchaseOverviewInner />;
}
