import React from "react";
import ReactDOM from "react-dom";
import { StyledIframe } from "../../lib/StyledIframe";
import { Modal } from "../../lib/Modal";
import { WidgetConfig } from "../../types";
import {
  DEFAULT_IFRAME_HEIGHT,
  DEFAULT_IFRAME_WIDTH
} from "../../lib/constants";

interface CreateOfferRequest {
  price: string;
  sellerDeposit: string;
  buyerCancelPenalty: string;
  quantityAvailable: string;
  validFromDateInMS: string;
  validUntilDateInMS: string;
  voucherRedeemableFromDateInMS: string;
  voucherRedeemableUntilDateInMS: string;
  voucherValidDurationInMS?: string;
  fulfillmentPeriodDurationInMS: string;
  resolutionPeriodDurationInMS: string;
  disputeResolverId: string;
  metadataUri: string;
  metadataHash: string;
}

export function createOffer(request: CreateOfferRequest, config: WidgetConfig) {
  const el = document.createElement("div");
  el.style.height = "0px";
  el.style.width = "0px";
  document.body.appendChild(el);
  ReactDOM.render(
    <CreateOfferWidget request={request} widgetsConfig={config} />,
    el
  );

  function onMessage(e: MessageEvent) {
    const { target, message } = e.data || {};

    if (target !== "boson") return;

    if (message === "close-widget") {
      ReactDOM.unmountComponentAtNode(el);
      el.remove();
      window.removeEventListener("message", onMessage);
    }
  }

  window.addEventListener("message", onMessage);
}

interface Props {
  request: CreateOfferRequest;
  widgetsConfig: WidgetConfig;
}

function CreateOfferWidget({ request, widgetsConfig }: Props) {
  const { widgetsUrl, ...restConfig } = widgetsConfig;

  const urlParams = new URLSearchParams({
    ...request,
    ...restConfig
  } as unknown as Record<string, string>).toString();

  return (
    <Modal>
      <StyledIframe
        style={{ boxShadow: "none" }}
        src={`${widgetsUrl}?${urlParams}`}
        width={restConfig.width || DEFAULT_IFRAME_WIDTH}
        height={restConfig.height || DEFAULT_IFRAME_HEIGHT}
      />
    </Modal>
  );
}
