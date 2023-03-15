import { utils } from "ethers";

export const calcPrice = (value: string, decimals: string): string => {
  try {
    return utils.formatUnits(value, decimals);
  } catch (e) {
    console.error(e);
    return "";
  }
};
