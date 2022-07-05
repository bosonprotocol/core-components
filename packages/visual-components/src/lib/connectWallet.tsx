import { metaMask } from "./connectors/metamask";

export function connectWallet(chainId?: number) {
  metaMask.provider
    ?.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {}
        }
      ]
    })
    .then(() => metaMask.activate(chainId));
}
