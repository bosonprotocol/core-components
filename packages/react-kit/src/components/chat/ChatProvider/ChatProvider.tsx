import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import React, { ReactNode, useEffect, useState } from "react";
import { useSigner } from "wagmi";
import { useCoreSDKWithContext } from "../../../hooks/useCoreSdkWithContext";
import { useEnvContext } from "../../environment/EnvironmentContext";

import { Context } from "./ChatContext";
import { getChatEnvName } from "./const";

interface Props {
  children: ReactNode;
}

export default function ChatProvider({ children }: Props) {
  const { data: signer } = useSigner();
  const [initialize, setInitialized] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [bosonXmtp, setBosonXmtp] = useState<BosonXmtpClient>();
  const coreSDK = useCoreSDKWithContext();
  const { envName } = useEnvContext();
  const chatEnvName = getChatEnvName(envName, coreSDK.contracts);
  useEffect(() => {
    if (signer && initialize && !bosonXmtp) {
      setLoading(true);
      BosonXmtpClient.initialise(
        signer,
        envName === "production" ? "production" : "dev",
        chatEnvName
      )
        .then((bosonClient) => {
          setBosonXmtp(bosonClient);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, initialize]);
  return (
    <Context.Provider
      value={{
        bosonXmtp,
        initialize: () => {
          setInitialized((prev) => prev + 1);
        },
        chatEnvName,
        isInitializing: isLoading
      }}
    >
      {children}
    </Context.Provider>
  );
}
