import { BosonXmtpBrowserClient } from "@bosonprotocol/chat-sdk";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { AuthorityIdEnvName } from "./const";

export const Context = createContext<{
  bosonXmtp: BosonXmtpBrowserClient | undefined;
  initialize: Dispatch<SetStateAction<void>>;
  chatEnvName: AuthorityIdEnvName;
  isInitializing: boolean;
}>({
  bosonXmtp: undefined,
  initialize: () => console.log("initialize has not been defined"),
  chatEnvName: "" as AuthorityIdEnvName,
  isInitializing: false
});

export const useChatContext = () => useContext(Context);
