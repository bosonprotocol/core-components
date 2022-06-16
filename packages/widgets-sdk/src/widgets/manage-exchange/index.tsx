import React from "react";
import ReactDOM from "react-dom";
import { StyledIframe } from "../../lib/StyledIframe";
import { createEventListener } from "../../lib/listener";
import {
  DEFAULT_IFRAME_HEIGHT,
  DEFAULT_IFRAME_WIDTH
} from "../../lib/constants";
import { WidgetConfig, OptionalParams } from "../../types";

export function manageExchange(
  exchangeId: string,
  config: WidgetConfig,
  element: HTMLElement,
  params?: OptionalParams
) {
  ReactDOM.render(
    <ManageOfferWidget
      exchangeId={exchangeId}
      widgetsConfig={config}
      forceBuyerView={params?.forceBuyerView ?? false}
    />,
    element
  );

  const onMessage = createEventListener(element);

  window.addEventListener("message", onMessage);
}

interface Props {
  exchangeId: string;
  widgetsConfig: WidgetConfig;
  forceBuyerView: boolean;
}

function ManageOfferWidget({
  exchangeId,
  widgetsConfig,
  forceBuyerView
}: Props) {
  const {
    widgetsUrl,
    chainId,
    ipfsMetadataUrl,
    height = DEFAULT_IFRAME_HEIGHT,
    width = DEFAULT_IFRAME_WIDTH
  } = widgetsConfig;

  const urlParams = new URLSearchParams({
    exchangeId,
    chainId,
    ipfsMetadataUrl,
    ...(forceBuyerView && { forceBuyerView })
  } as unknown as Record<string, string>).toString();

  return (
    <StyledIframe
      style={{ boxShadow: "none" }}
      src={`${widgetsUrl}?${urlParams}`}
      width={width}
      height={height}
    />
  );
}
