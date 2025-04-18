import { utils } from "ethers";

export const getNumberWithoutDecimals = (
  value: string,
  decimals: string
): string => {
  return utils.parseUnits(value, decimals).toString();
};

export const getNumberWithDecimals = (
  value: string,
  decimals: string
): number => {
  return Number(utils.formatUnits(value, decimals));
};

/**
 * Given a small number, it returns its string representation without the scientific 'e' notation.
 * For example:
 *      1e-112 =\> 1e-112 (too small to change)
 *      1e-7   =\> 0.0000001
 *      0.0001 =\> 0.0001
 *      9e+99  =\> 9e+99
 * @param num -
 * @returns
 */
export const fixformattedString = (num: number): string => {
  const numStr = num + "";
  const indexEMinus = numStr.lastIndexOf("e-");
  if (numStr.includes(".") || indexEMinus === -1 || num < 1e-100) {
    return numStr;
  }
  // small number with scientific notation
  const decimals = Math.min(100, Number(numStr.substring(indexEMinus + 2)));
  return num.toFixed(decimals);
};

export const isNumeric = (strNumber: string) => {
  if (typeof strNumber != "string") return false; // we only process strings!
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !isNaN(strNumber as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(strNumber))
  ); // ...and ensure strings of whitespace fail
};

export function remToPx(rem: number, rootFontSize = 16) {
  return rem * rootFontSize;
}
