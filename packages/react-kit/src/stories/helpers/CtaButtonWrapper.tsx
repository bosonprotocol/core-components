import React, { ReactNode } from "react";

import { connectWallet, connectors, hooks, metaMask } from "./connect-wallet";
import { Web3ReactProvider } from "@web3-react/core";
import { ConfigId } from "@bosonprotocol/core-sdk";

type Props = {
  children: ReactNode;
  chainId: string;
};

function WithWeb3ReactProvider({ children }: { children: ReactNode }) {
  return (
    <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
  );
}

function WithMetamask(props: Props) {
  const account = hooks.useAccount();
  return (
    <>
      {account ? (
        <>
          <div>Connected: {account}</div>
          <button onClick={() => metaMask?.deactivate?.()}>
            Disconnect MetaMask
          </button>
        </>
      ) : (
        <button onClick={async () => await connectWallet(props.chainId)}>
          Connect MetaMask
        </button>
      )}
      {props.children}
    </>
  );
}

export const CtaButtonWrapper = ({
  children,
  configId
}: {
  children: ReactNode;
  configId: ConfigId;
}) => {
  const chainId = configId?.split("-")[1] || "80001";
  return (
    <WithWeb3ReactProvider>
      <WithMetamask chainId={chainId}>{children}</WithMetamask>
    </WithWeb3ReactProvider>
  );
};
