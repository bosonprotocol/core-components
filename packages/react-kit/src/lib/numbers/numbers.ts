import { BigNumber } from "ethers";

export const getNumberWithoutDecimals = (
  value: string,
  decimals: string
): string => {
  const valueAsNumber = Number(value);
  if (!Number.isInteger(valueAsNumber)) {
    return Math.floor(valueAsNumber * 10 ** Number(decimals)).toString();
  }
  return BigNumber.from(valueAsNumber + "")
    .mul(BigNumber.from(10).pow(BigNumber.from(decimals)))
    .toString();
};

export const getNumberWithDecimals = (
  value: string,
  decimals: string
): number => {
  return Number(value) * 10 ** -Number(decimals);
};
