import { Token } from "../convertion-rate/ConvertionRateContext";

export function getDefaultTokens(tokensList: string): Token[] {
  let tokens: Token[] = [];
  try {
    tokens = JSON.parse(tokensList || "[]");
  } catch (e) {
    console.error(e);
  }
  return tokens;
}
