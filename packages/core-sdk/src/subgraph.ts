import fetch from "cross-fetch";

/**
 * TODO
 */
export async function fetchFromSubgraph() {
  const res = await fetch("https://api.github.com/users/dohaki");

  if (res.status >= 400) {
    throw new Error("Bad response from server");
  }

  const user = await res.json();
  return user;
}
