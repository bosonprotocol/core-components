import React from "react";
import ReactDOM from "react-dom";
import { StyledIframe } from "../lib/StyledIframe";
import { config } from "../config";

export function renderCommitWidget(element: HTMLElement, offerId: string) {
  ReactDOM.render(<CommitWidget offerId={offerId} />, element);
}

interface Props {
  offerId: string;
}

function CommitWidget({ offerId }: Props) {
  const urlParams = new URLSearchParams({ offerId }).toString();

  return (
    <StyledIframe
      src={`${config.IFRAME_SRC_BASE_URL}/#/buyer?${urlParams}`}
      style={{ boxShadow: "none" }}
      width={512}
      height={512}
    />
  );
}
