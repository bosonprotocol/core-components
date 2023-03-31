import React, { useEffect } from "react";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import ConnectButton from "../../../../../wallet/ConnectButton";
import { useModal } from "../../../../useModal";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../../types/exchange";
import { BosonFooter } from "../../BosonFooter";
import ExpireVoucher from "./ExpireVoucher";

interface ExpireVoucherViewProps {
  onBackClick: () => void;
  exchange: Exchange | null;
}

export const ExpireVoucherView: React.FC<ExpireVoucherViewProps> = ({
  exchange,
  onBackClick
}) => {
  const { showModal } = useModal();
  useEffect(() => {
    showModal("REDEEM", {
      headerComponent: (
        <Grid>
          <ArrowLeft
            onClick={onBackClick}
            size={32}
            style={{ cursor: "pointer" }}
          />
          <Typography tag="h3">Expire voucher</Typography>
          <ConnectButton showChangeWallet />
        </Grid>
      ),
      footerComponent: <BosonFooter />
    });
  }, []);
  if (!exchange) {
    return <p>Exchange could not be retrieved</p>;
  }
  return (
    <ExpireVoucher
      exchange={exchange}
      onBackClick={onBackClick}
      onSuccess={onBackClick}
    />
  );
};
