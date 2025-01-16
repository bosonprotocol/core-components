import React, { useEffect } from "react";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../../types/exchange";
import ExpireVoucher, { ExpireVoucherProps } from "./ExpireVoucher";
import { useNonModalContext } from "../../../../nonModal/NonModal";
import { getCssVar } from "../../../../../../theme";
import { Grid } from "../../../../../ui/Grid";
import { BosonLogo } from "../../../common/BosonLogo";

export interface ExpireVoucherViewProps {
  onBackClick: ExpireVoucherProps["onBackClick"];
  onSuccess: ExpireVoucherProps["onSuccess"];
  exchange: Exchange | null;
  showBosonLogoInFooter: boolean;
}

export const ExpireVoucherView: React.FC<ExpireVoucherViewProps> = ({
  exchange,
  onBackClick,
  onSuccess,
  showBosonLogoInFooter
}) => {
  const { dispatch } = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        onArrowLeftClick: null,
        headerComponent: (
          <Grid style={{ flex: "1" }} gap="1rem">
            <ArrowLeft
              onClick={() => onBackClick()}
              size={32}
              style={{ cursor: "pointer" }}
            />
            <h3 style={{ width: "100%", flex: 1 }}>Expire voucher</h3>
          </Grid>
        ),
        contentStyle: {
          background: getCssVar("--background-accent-color")
        },
        footerComponent: showBosonLogoInFooter ? <BosonLogo /> : null
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, showBosonLogoInFooter]);
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
