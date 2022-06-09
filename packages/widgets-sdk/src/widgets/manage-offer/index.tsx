import React from "react";
import ReactDOM from "react-dom";
import { StyledIframe } from "../../lib/StyledIframe";
import { WidgetConfig } from "../../types";

interface OptionalParams {
  forceBuyerView?: boolean;
  exchangeId?: string;
}

export function manageOffer(
  offerId: string,
  config: WidgetConfig,
  element: HTMLElement,
  params?: OptionalParams
) {
  ReactDOM.render(
    <ManageOfferWidget
      offerId={offerId}
      exchangeId={params?.exchangeId}
      widgetsConfig={config}
      forceBuyerView={params?.forceBuyerView ?? false}
    />,
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
  exchangeId?: string;
  widgetsConfig: WidgetConfig;
  forceBuyerView: boolean;
}

function ManageOfferWidget({
  offerId,
  exchangeId,
  widgetsConfig,
  forceBuyerView
}: Props) {
  const { widgetsUrl, chainId, ipfsMetadataUrl } = widgetsConfig;

  const urlParams = new URLSearchParams({
    offerId,
    exchangeId,
    chainId,
    ipfsMetadataUrl,
    ...(forceBuyerView && { forceBuyerView })
  } as unknown as Record<string, string>).toString();

  return (
    <StyledIframe
      style={{ boxShadow: "none" }}
      src={`${widgetsUrl}?${urlParams}`}
      width={626}
      height={546}
    />
  );
}
