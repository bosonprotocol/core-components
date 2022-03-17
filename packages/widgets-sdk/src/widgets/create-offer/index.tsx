import React from "react";
import ReactDOM from "react-dom";
import { StyledIframe } from "../../lib/StyledIframe";
import { Modal } from "../../lib/Modal";
import { DEFAULT_WIDGETS_URl } from "../../constants";

interface CreateOfferRequest {
  price: string;
  deposit: string;
  penalty: string;
  quantity: string;
  validFromDateInMS: string;
  validUntilDateInMS: string;
  redeemableDateInMS: string;
  fulfillmentPeriodDurationInMS: string;
  voucherValidDurationInMS: string;
  metadataUri: string;
  metadataHash: string;
}

export function createOffer(
  request: CreateOfferRequest,
  widgetsUrl: string = DEFAULT_WIDGETS_URl
) {
  const el = document.createElement("div");
  el.style.height = "0px";
  el.style.width = "0px";
  document.body.appendChild(el);
  ReactDOM.render(
    <CreateOfferWidget request={request} widgetsUrl={widgetsUrl} />,
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
  request: CreateOfferRequest;
  widgetsUrl: string;
}

function CreateOfferWidget({ request, widgetsUrl }: Props) {
  const urlParams = new URLSearchParams(
    request as unknown as Record<string, string>
  ).toString();

  return (
    <Modal>
      <StyledIframe
        style={{ boxShadow: "none" }}
        src={`${widgetsUrl}/#/create?${urlParams}`}
        width={600}
        height={582}
      />
    </Modal>
  );
}
