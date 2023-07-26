import { ContractAddresses } from "@bosonprotocol/common";
import { EnvironmentType } from "@bosonprotocol/core-sdk";

export const getChatEnvName = (
  envName: EnvironmentType,
  contracts: ContractAddresses
) => `${envName}-${contracts.protocolDiamond}`;
