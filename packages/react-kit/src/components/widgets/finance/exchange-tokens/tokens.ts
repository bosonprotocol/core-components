import { Token } from "../convertion-rate/ConvertionRateContext";

export function getDefaultTokens(defaultTokensList: string): Token[] {
  let tokens: Token[] = [];
  try {
    tokens = JSON.parse(defaultTokensList || "[]");
  } catch (e) {
    console.error(e);
  }
  return tokens;
}
