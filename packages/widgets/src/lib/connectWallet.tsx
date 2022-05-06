import { metaMask } from "./connectors/metamask";

export function connectWallet() {
  metaMask.provider
    ?.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {}
        }
      ]
    })
    .then(() => metaMask.activate());
}
