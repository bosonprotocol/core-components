import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { useEffect, useState } from "react";
import { useEnvContext } from "../environment/EnvironmentContext";
import { useChatContext } from "./ChatProvider/ChatContext";
import { useAccount } from "../../hooks/connection/connection";

export type ChatInitializationStatus =
  | "PENDING"
  | "ALREADY_INITIALIZED"
  | "INITIALIZED"
  | "NOT_INITIALIZED"
  | "ERROR";

export const useChatStatus = (): {
  chatInitializationStatus: ChatInitializationStatus;
  error: Error | null;
  isError: boolean;
} => {
  const [error, setError] = useState<Error | null>(null);
  const [chatInitializationStatus, setChatInitializationStatus] =
    useState<ChatInitializationStatus>("PENDING");
  const { envName } = useEnvContext();
  const { bosonXmtp, chatEnvName } = useChatContext();
  const { address } = useAccount();

  useEffect(() => {
    if (chatInitializationStatus === "PENDING" && !!bosonXmtp) {
      setChatInitializationStatus("ALREADY_INITIALIZED");
    } else if (address && chatInitializationStatus !== "ALREADY_INITIALIZED") {
      setError(null);

      BosonXmtpClient.isXmtpEnabled(
        address,
        envName === "production" ? "production" : "dev",
        chatEnvName
      )
        .then((isEnabled) => {
          if (isEnabled) {
            setChatInitializationStatus("INITIALIZED");
          } else {
            setChatInitializationStatus("NOT_INITIALIZED");
          }
        })
        .catch((err) => {
          setError(err);
          setChatInitializationStatus("ERROR");
        });
    }
  }, [address, bosonXmtp, chatEnvName, chatInitializationStatus, envName]);
  return {
    chatInitializationStatus,
    error,
    isError: !!error
  };
};
