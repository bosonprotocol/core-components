import { ArrowLeft } from "phosphor-react";
import React, { useEffect } from "react";
import PurchaseOverview from "./PurchaseOverview";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { theme } from "../../../../../theme";
import { Grid } from "../../../../ui/Grid";

const colors = theme.colors.light;
type Props = {
  onBackClick?: () => void;
};
export function PurchaseOverviewView({ onBackClick }: Props) {
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Grid style={{ flex: "1" }}>
            {onBackClick && (
              <ArrowLeft
                onClick={onBackClick}
                size={32}
                style={{ cursor: "pointer" }}
              />
            )}
          </Grid>
        ),
        contentStyle: {
          background: colors.white
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  return <PurchaseOverview />;
}
