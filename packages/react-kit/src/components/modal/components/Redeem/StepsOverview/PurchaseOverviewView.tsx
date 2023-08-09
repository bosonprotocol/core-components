import { ArrowLeft } from "phosphor-react";
import React from "react";
import Grid from "../../../../ui/Grid";
import ConnectButton from "../../../../wallet/ConnectButton";
import { BosonFooter } from "../BosonFooter";
import PurchaseOverview from "./PurchaseOverview";
import NonModal, { NonModalProps } from "../../../NonModal";

type Props = {
  onBackClick: () => void;
  nonModalProps: Partial<NonModalProps>;
};
export function PurchaseOverviewView({ onBackClick, nonModalProps }: Props) {
  return (
    <NonModal
      props={{
        ...nonModalProps,
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
