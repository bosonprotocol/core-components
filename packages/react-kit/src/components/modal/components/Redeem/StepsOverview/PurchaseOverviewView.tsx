import { ArrowLeft } from "phosphor-react";
import React, { useEffect } from "react";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { useModal } from "../../../useModal";
import { BosonFooter } from "../BosonFooter";
import PurchaseOverview from "./PurchaseOverview";

type Props = {
  onBackClick: () => void;
};
export function PurchaseOverviewView({ onBackClick }: Props) {
  const { showModal } = useModal();
  useEffect(() => {
    showModal("REDEEM", {
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
    });
  }, []);
  return <PurchaseOverview />;
}
