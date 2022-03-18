import React from "react";
import ReactDOM from "react-dom";
import { StyledIframe } from "../../lib/StyledIframe";
import { Modal } from "../../lib/Modal";
import { WidgetConfig } from "../../types";

export function manageOffer(offerId: string, config: WidgetConfig) {
  const el = document.createElement("div");
  el.style.height = "0px";
  el.style.width = "0px";
  document.body.appendChild(el);
  ReactDOM.render(
    <ManageOfferWidget offerId={offerId} widgetsConfig={config} />,
    el
  );

  function onMessage(e: MessageEvent) {
    const { target, message } = e.data || {};

    if (target !== "boson") return;
    if (message !== "close-widget") return;

    ReactDOM.unmountComponentAtNode(el);
    el.remove();
    window.removeEventListener("message", onMessage);
  }

  window.addEventListener("message", onMessage);
}

interface Props {
  offerId: string;
  widgetsConfig: WidgetConfig;
}

function ManageOfferWidget({ offerId, widgetsConfig }: Props) {
  const { widgetsUrl, ...restConfig } = widgetsConfig;

  const urlParams = new URLSearchParams({
    offerId,
    ...restConfig
  } as unknown as Record<string, string>).toString();

  return (
    <Modal>
      <StyledIframe
        style={{ boxShadow: "none" }}
        src={`${widgetsUrl}/#/manage?${urlParams}`}
        width={600}
        height={587}
      />
    </Modal>
  );
}
