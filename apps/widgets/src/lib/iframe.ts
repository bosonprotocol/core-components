export function postCloseWidget() {
  postMessage("close-widget");
}

export function postCreatedExchange(exchangeId: string) {
  postMessage("created-exchange", { exchangeId });
}

export function postCancelledVoucher(exchangeId: string) {
  postMessage("cancelled-voucher", { exchangeId });
}

export function postRedeemedVoucher(exchangeId: string) {
  postMessage("redeemed-voucher", { exchangeId });
}

export function postRevokedVoucher(exchangeId: string) {
  postMessage("revoked-voucher", { exchangeId });
}

export function postMessage(
  message: string,
  payload: Record<string, unknown> = {}
) {
  window.parent.postMessage({ target: "boson", message, ...payload }, "*");
}
