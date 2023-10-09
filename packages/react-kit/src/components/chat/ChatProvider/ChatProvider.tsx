import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import React, { ReactNode, useEffect, useState } from "react";
import { useCoreSDKWithContext } from "../../../hooks/useCoreSdkWithContext";
import { useEnvContext } from "../../environment/EnvironmentContext";

import { Context } from "./ChatContext";
import { getChatEnvName } from "./const";
import { useSigner } from "hooks/connection/connection";

interface Props {
  children: ReactNode;
}

export default function ChatProvider({ children }: Props) {
  const signer = useSigner();
  const [initialize, setInitialized] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [bosonXmtp, setBosonXmtp] = useState<BosonXmtpClient>();
  const [chatEnvName, setChatEnvName] = useState<string>("undefined");
  const coreSDK = useCoreSDKWithContext();
  const { envName } = useEnvContext();
  useEffect(() => {
    if (signer && initialize && !bosonXmtp && envName && coreSDK) {
      const newChatEnvName = getChatEnvName(envName, coreSDK.contracts);
      setChatEnvName(newChatEnvName);
      setLoading(true);
      BosonXmtpClient.initialise(
        signer,
        envName === "production" ? "production" : "dev",
        newChatEnvName
      )
        .then((bosonClient) => {
          setBosonXmtp(bosonClient);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [signer, initialize, coreSDK, bosonXmtp, envName]);
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
