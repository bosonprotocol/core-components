export function createdExchange(exchangeId: string) {
  window.parent.postMessage(
    { target: "boson", message: "created-exchange", exchangeId },
    "*"
  );
}
