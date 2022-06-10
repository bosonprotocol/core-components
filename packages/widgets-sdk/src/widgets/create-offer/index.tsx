import React from "react";
import ReactDOM from "react-dom";
import { StyledIframe } from "../../lib/StyledIframe";
import { Modal } from "../../lib/Modal";
import { WidgetConfig } from "../../types";

interface CreateOfferRequest {
  price: string;
  sellerDeposit: string;
  protocolFee: string;
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
  offerChecksum: string;
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
        width={600}
        height={541}
      />
    </Modal>
  );
}
