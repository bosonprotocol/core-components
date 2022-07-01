import React from "react";
import ReactDOM from "react-dom";
import { StyledIframe } from "../../lib/StyledIframe";
import { createEventListener } from "../../lib/listener";
import {
  DEFAULT_IFRAME_HEIGHT,
  DEFAULT_IFRAME_WIDTH
} from "../../lib/constants";
import { WidgetConfig, OptionalParams } from "../../types";

export function manageOffer(
  offerId: string,
  config: WidgetConfig,
  element: HTMLElement,
  params?: OptionalParams
) {
  ReactDOM.render(
    <ManageOfferWidget
      offerId={offerId}
      widgetsConfig={config}
      forceBuyerView={params?.forceBuyerView ?? false}
    />,
    element
  );

  const onMessage = createEventListener(element);

  window.addEventListener("message", onMessage);
}

interface Props {
  offerId: string;
  widgetsConfig: WidgetConfig;
  forceBuyerView: boolean;
}

function ManageOfferWidget({ offerId, widgetsConfig, forceBuyerView }: Props) {
  const {
    widgetsUrl,
    height = DEFAULT_IFRAME_HEIGHT,
    width = DEFAULT_IFRAME_WIDTH,
    ...restConfig
  } = widgetsConfig;

  const urlParams = new URLSearchParams({
    offerId,
    ...(forceBuyerView && { forceBuyerView }),
    ...restConfig
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
