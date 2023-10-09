import React from "react";
import Typography from "../../../../../ui/Typography";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../../types/exchange";
import ExpireVoucher, { ExpireVoucherProps } from "./ExpireVoucher";
import { useNonModalContext } from "../../../../NonModal";

export interface ExpireVoucherViewProps {
  onBackClick: ExpireVoucherProps["onBackClick"];
  onSuccess: ExpireVoucherProps["onSuccess"];
  exchange: Exchange | null;
}

export const ExpireVoucherView: React.FC<ExpireVoucherViewProps> = ({
  exchange,
  onBackClick,
  onSuccess
}) => {
  const dispatch = useNonModalContext();
  dispatch({
    payload: {
      headerComponent: (
        <>
          <ArrowLeft
            onClick={() => onBackClick()}
            size={32}
            style={{ cursor: "pointer" }}
          />
          <Typography tag="h3">Expire voucher</Typography>
        </>
      )
    }
  });
  return (
    <>
      {!exchange ? (
        <p>Exchange could not be retrieved</p>
      ) : (
        <ExpireVoucher
          exchange={exchange}
          onBackClick={onBackClick}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};
