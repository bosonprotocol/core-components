import { useWeb3React } from "@web3-react/core";
import { useConfigContext } from "../../components/config/ConfigContext";

export const useWeb3ReactWrapper = () => {
  const { withWeb3React: enabled } = useConfigContext();
  try {
    return useWeb3React();
  } catch (error) {
    if (!enabled) {
      throw error;
    }
  }
  return null;
};
