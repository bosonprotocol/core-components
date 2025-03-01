import React from "react";
import { Typography } from "../../../../ui/Typography";
import ReactComponent from "../../../../../assets/redeemeum.svg";
import { SvgImage } from "../../../../ui/SvgImage";
import { getCssVar } from "../../../../../theme";

export const DetailDisputeResolver = {
  name: "Dispute resolver",
  info: (
    <>
      <Typography tag="h6">
        <b>Dispute resolver</b>
      </Typography>
      <Typography tag="p">
        The Dispute resolver is trusted to resolve disputes between buyer and
        seller that can't be mutually resolved.
      </Typography>
    </>
  ),
  value: () => {
    return (
      <SvgImage
        src={ReactComponent}
        width={100}
        height={18}
        color={getCssVar("--sub-text-color")}
      />
    );
  }
};
