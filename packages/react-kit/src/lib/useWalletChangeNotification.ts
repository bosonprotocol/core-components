import { useEffect } from "react";

export function useWalletChangeNotification(address: undefined | string) {
  useEffect(() => {
    window.parent.postMessage(
      { target: "boson", message: "wallet-changed", wallet: address },
      "*"
    );
  }, [address]);
}
