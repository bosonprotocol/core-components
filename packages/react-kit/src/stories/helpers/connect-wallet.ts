import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { utils } from "ethers";

import { Web3ReactHooks } from "@web3-react/core";

export const [metaMask, hooks] = initializeConnector<MetaMask>((actions) => {
  return new MetaMask({ actions });
});

export const connectWallet = async (chainId?: string) => {
  try {
    const currentChainId = window.ethereum
      ? Number(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (window.ethereum as any)?.request({ method: "eth_chainId" })
        )
      : undefined;
    if (
      chainId &&
      window.ethereum &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      currentChainId !== Number(chainId)
    ) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            { chainId: utils.hexStripZeros(utils.hexlify(Number(chainId))) }
          ]
        });
      } catch (err) {
        console.error("Network changed rejected", err);
      }
    } else {
      try {
        await metaMask.activate(Number(chainId));
      } catch (err) {
        console.error("User rejected the request", err);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const connectors: [MetaMask, Web3ReactHooks][] = [[metaMask, hooks]];
