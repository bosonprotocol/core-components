import React from "react";
import ReactDOM from "react-dom";
import { StyledIframe } from "../lib/StyledIframe";
import { Modal } from "./components/Modal";
import { config } from "../config";

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

export function createOffer(request: CreateOfferRequest) {
  const el = document.createElement("div");
  el.style.height = "0px";
  el.style.width = "0px";
  document.body.appendChild(el);
  ReactDOM.render(<CreateOfferWidget request={request} />, el);

  function onMessage(e: MessageEvent) {
    const { target, message } = e.data || {};

    if (target !== "boson") return;
    if (message !== "close-offer-create-widget") return;

    ReactDOM.unmountComponentAtNode(el);
    el.remove();
    window.removeEventListener("message", onMessage);
  }

  window.addEventListener("message", onMessage);
}

interface Props {
  request: CreateOfferRequest;
}

function CreateOfferWidget({ request }: Props) {
  const urlParams = new URLSearchParams(
    request as unknown as Record<string, string>
  ).toString();

  return (
    <Modal>
      <StyledIframe
        style={{ boxShadow: "none" }}
        src={`${config.WIDGETS_URl}/create?${urlParams}`}
        width={600}
        height={582}
      />
    </Modal>
  );
}
