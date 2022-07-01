export function getURLParams() {
  const url = new URL(window.location.href);
  return Object.fromEntries(url.searchParams.entries());
}
