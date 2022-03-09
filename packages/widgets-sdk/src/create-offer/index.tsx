import React from "react";
import ReactDOM from "react-dom";
import { StyledIframe } from "../lib/StyledIframe";
import { Modal } from "./components/Modal";
import { config } from "../config";

interface CreateOfferRequest {
  ipfsCID: string;
  price: string;
  quantity: string;
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
    if (message !== "offer-created") return;

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
  const { ipfsCID, price, quantity } = request;
  const urlParams = new URLSearchParams({
    ipfsCID,
    price,
    quantity,
  }).toString();

  return (
    <Modal>
      <StyledIframe
        style={{ boxShadow: "none" }}
        src={`${config.IFRAME_SRC_BASE_URL}/#/seller?${urlParams}`}
        width={512}
        height={400}
      />
    </Modal>
  );
}
