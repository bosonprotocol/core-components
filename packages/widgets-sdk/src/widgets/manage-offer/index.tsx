import React from "react";
import ReactDOM from "react-dom";
import { StyledIframe } from "../../lib/StyledIframe";
import { WidgetConfig } from "../../types";

export function manageOffer(
  offerId: string,
  config: WidgetConfig,
  element: HTMLElement
) {
  ReactDOM.render(
    <ManageOfferWidget offerId={offerId} widgetsConfig={config} />,
    element
  );

  function onMessage(e: MessageEvent) {
    const { target, message } = e.data || {};

    if (target !== "boson") return;
    if (message !== "close-widget") return;

    ReactDOM.unmountComponentAtNode(element);
    window.removeEventListener("message", onMessage);
  }

  window.addEventListener("message", onMessage);
}

interface Props {
  offerId: string;
  widgetsConfig: WidgetConfig;
}

function ManageOfferWidget({ offerId, widgetsConfig }: Props) {
  const { widgetsUrl, chainId, ipfsMetadataUrl } = widgetsConfig;

  const urlParams = new URLSearchParams({
    offerId,
    chainId,
    ipfsMetadataUrl
  } as unknown as Record<string, string>).toString();

  return (
    <StyledIframe
      style={{ boxShadow: "none" }}
      src={`${widgetsUrl}/#/manage?${urlParams}`}
      width={626}
      height={546}
    />
  );
}
