import { EnvironmentType, ConfigId } from "@bosonprotocol/common";
import { CoreSDK, getEnvConfigById } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { providers, Wallet } from "ethers";

export function buildReadOnlyCoreSDK(
  envName: string,
  configId: string
): CoreSDK {
  const defaultConfig = getEnvConfigById(
    envName as EnvironmentType,
    configId as ConfigId
  );
  return CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl)
    ),
    envName: envName as EnvironmentType,
    configId: configId as ConfigId
  });
}

export function buildSignerCoreSDK(
  privateKey: string,
  envName: string,
  configId: string
): CoreSDK {
  const defaultConfig = getEnvConfigById(
    envName as EnvironmentType,
    configId as ConfigId
  );
  const wallet = new Wallet(privateKey);
  return CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      wallet
    ),
    envName: envName as EnvironmentType,
    configId: configId as ConfigId
  });
}

export function getEnvName(opts: { env?: string }): string {
  return opts.env || process.env.ENV_NAME || "testing";
}

export function getConfigId(opts: { configId?: string }): string {
  return opts.configId || process.env.ENV_CONFIG_ID || "testing-80002-0";
}
