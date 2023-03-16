import { EnvironmentType } from "@bosonprotocol/core-sdk";
import React, { ReactNode, useMemo } from "react";
import { WagmiConfig } from "wagmi";
import { getWagmiClient } from "./wallet-connection";

interface Props {
  children: ReactNode;
  envName: EnvironmentType;
}

export default function WalletConnectionProvider({ children, envName }: Props) {
  const wagmiClient = useMemo(() => {
    return getWagmiClient(envName);
  }, [envName]);
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>;
}
