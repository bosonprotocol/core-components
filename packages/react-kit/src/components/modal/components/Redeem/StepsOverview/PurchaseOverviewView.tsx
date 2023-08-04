import { ArrowLeft } from "phosphor-react";
import React from "react";
import Grid from "../../../../ui/Grid";
import ConnectButton from "../../../../wallet/ConnectButton";
import { BosonFooter } from "../BosonFooter";
import PurchaseOverview from "./PurchaseOverview";
import NonModal from "../../../NonModal";

type Props = {
  onBackClick: () => void;
};
export function PurchaseOverviewView({ onBackClick }: Props) {
  return (
    <NonModal
      props={{
        headerComponent: (
          <Grid gap="1rem">
            <ArrowLeft
              onClick={onBackClick}
              size={32}
              style={{ cursor: "pointer", flexShrink: 0 }}
            />
            <ConnectButton showChangeWallet />
          </Grid>
        ),
        footerComponent: <BosonFooter />
      }}
    >
      <PurchaseOverview />
    </NonModal>
  );
}
