import { ArrowLeft } from "phosphor-react";
import React, { useEffect } from "react";
import PurchaseOverview from "./PurchaseOverview";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { theme } from "theme";

const colors = theme.colors.light;
type Props = {
  onBackClick: () => void;
};
export function PurchaseOverviewView({ onBackClick }: Props) {
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <ArrowLeft
            onClick={onBackClick}
            size={32}
            style={{ cursor: "pointer", flexShrink: 0 }}
          />
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
