import { ContractAddresses } from "@bosonprotocol/common";
import { EnvironmentType } from "@bosonprotocol/core-sdk";
import { BosonXmtpBrowserClient } from "@bosonprotocol/chat-sdk";

export type AuthorityIdEnvName = ConstructorParameters<
  typeof BosonXmtpBrowserClient
>[2];

export const getChatEnvName = (
  envName: EnvironmentType,
  contracts: ContractAddresses
) => `${envName}-${contracts.protocolDiamond}` as AuthorityIdEnvName;
