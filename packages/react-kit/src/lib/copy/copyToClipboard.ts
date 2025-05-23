import * as Sentry from "@sentry/browser";

function fallback(text: string) {
  const input = document.createElement("input");
  input.value = text;

  document.body.appendChild(input);
  input.focus();
  input.select();

  try {
    document.execCommand("copy");
  } catch (error) {
    console.error("Unable to copy", error);
    Sentry.captureException(error);
  }
  document.body.removeChild(input);
}

export const copyToClipboard = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!navigator.clipboard) {
      fallback(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => resolve(),
      (error) => {
        console.error("Error while copying:", error);
        Sentry.captureException(error);
        reject(error);
      }
    );

    resolve();
  });
};
