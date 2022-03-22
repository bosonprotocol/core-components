import { CoreSDK, offers } from "@bosonprotocol/core-sdk";
import { ethers } from "ethers";
import { useState } from "react";
import { hooks } from "../../lib/connectors/metamask";
import { getURLParams } from "../../lib/parseUrlParams";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { useReloadToken } from "../../lib/useReloadToken";
import { useAsyncEffect } from "use-async-effect";

type TokenInfo = Awaited<ReturnType<typeof getTokenInfo>>;

async function getTokenAllowance(
  coreSDK: CoreSDK,
  exchangeTokenAddress: string
) {
  // TODO: need better check to see if account is avaialbe in provider (which is being used)
  const providerUrl = (coreSDK as any)._web3Lib._provider.connection.url;
  if (providerUrl !== "metamask") return ethers.BigNumber.from(0);

  const allowance = await coreSDK.getExchangeTokenAllowance(
    exchangeTokenAddress
  );
  return ethers.BigNumber.from(allowance);
}

async function getTokenInfo(coreSDK: CoreSDK, exchangeTokenAddress: string) {
  if (exchangeTokenAddress === ethers.constants.AddressZero) {
    return {
      name: "Ether",
      symbol: "ETH",
      address: ethers.constants.AddressZero,
      allowance: ethers.constants.MaxUint256,
      decimals: 18
    };
  }

  const [allowance, exchangeTokenInfo] = await Promise.all([
    getTokenAllowance(coreSDK, exchangeTokenAddress),
    coreSDK.getExchangeTokenInfo(exchangeTokenAddress)
  ]);

  return {
    address: exchangeTokenAddress,
    allowance,
    ...exchangeTokenInfo
  };
}

function getCreateOfferArgs() {
  const urlParams = getURLParams();

  const createOfferArgs: offers.CreateOfferArgs = {
    price: urlParams["price"],
    deposit: urlParams["deposit"],
    penalty: urlParams["penalty"],
    quantity: urlParams["quantity"],
    validFromDateInMS: urlParams["validFromDateInMS"],
    validUntilDateInMS: urlParams["validUntilDateInMS"],
    redeemableDateInMS: urlParams["redeemableDateInMS"],
    fulfillmentPeriodDurationInMS: urlParams["fulfillmentPeriodDurationInMS"],
    voucherValidDurationInMS: urlParams["voucherValidDurationInMS"],
    seller: "",
    exchangeToken: urlParams["exchangeToken"],
    metadataUri: urlParams["metadataUri"],
    metadataHash: urlParams["metadataHash"]
  };

  return createOfferArgs;
}

/**
 * Load and validate data needed for CreateOffer widget
 */
export function useCreateOfferData() {
  const [data, setData] = useState<
    | {
        status: "loaded";
        metadata: Record<string, string>;
        tokenInfo: TokenInfo;
        createOfferArgs: offers.CreateOfferArgs;
      }
    | { status: "loading" }
    | { status: "error"; error: Error }
  >({ status: "loading" });

  const coreSDK = useCoreSDK();
  const account = hooks.useAccount();
  const { reloadToken, reload } = useReloadToken();

  useAsyncEffect(
    (isActive) => {
      async function load() {
        const createOfferArgs = getCreateOfferArgs();

        const [metadata, tokenInfo] = await Promise.all([
          coreSDK.getMetadata(createOfferArgs.metadataHash),
          getTokenInfo(coreSDK, createOfferArgs.exchangeToken)
        ]);

        if (!isActive()) return;
        setData({
          status: "loaded",
          metadata,
          createOfferArgs,
          tokenInfo
        });
      }
      load().catch((e) => setData({ status: "error", error: e as Error }));
    },
    [account, coreSDK, reloadToken]
  );

  return { data, reload };
}
