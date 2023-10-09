import { ArrowLeft } from "phosphor-react";
import React from "react";
import PurchaseOverview from "./PurchaseOverview";
import { useNonModalContext } from "../../../NonModal";

type Props = {
  onBackClick: () => void;
};
export function PurchaseOverviewView({ onBackClick }: Props) {
  const dispatch = useNonModalContext();
  dispatch({
    payload: {
      headerComponent: (
        <ArrowLeft
          onClick={onBackClick}
          size={32}
          style={{ cursor: "pointer", flexShrink: 0 }}
        />
      )
    }
  });
  return <PurchaseOverview />;
}
