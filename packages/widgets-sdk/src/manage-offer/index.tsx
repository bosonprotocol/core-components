import React from "react";
import ReactDOM from "react-dom";
import { StyledIframe } from "../lib/StyledIframe";
import { config } from "../config";

export function renderManageOfferWidget(element: HTMLElement, offerId: string) {
  ReactDOM.render(<ManageOfferWidget offerId={offerId} />, element);
}

interface Props {
  offerId: string;
}

function ManageOfferWidget({ offerId }: Props) {
  const urlParams = new URLSearchParams({ offerId }).toString();

  return (
    <StyledIframe
      src={`${config.IFRAME_SRC_BASE_URL}/#/seller?${urlParams}`}
      style={{ boxShadow: "none" }}
      width={512}
      height={512}
    />
  );
}
