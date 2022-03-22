export function getURLParams() {
  return Object.fromEntries(
    new URLSearchParams(window.location.hash.split("?")[1]).entries()
  );
}
