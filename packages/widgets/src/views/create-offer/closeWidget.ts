export function closeWidget() {
  window.parent.postMessage(
    { target: "boson", message: "close-offer-create-widget" },
    "*"
  );
}
