import ReactDOM from "react-dom";

export function createEventListener(element: HTMLElement) {
  function onMessage(event: MessageEvent) {
    const { target, message } = event.data || {};

    if (target !== "boson") return;
    if (message !== "close-widget") return;

    ReactDOM.unmountComponentAtNode(element);
    window.removeEventListener("message", onMessage);
  }

  return onMessage;
}
