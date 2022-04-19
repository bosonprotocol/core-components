import { CoreSDK, offers, AnyMetadata } from "@bosonprotocol/core-sdk";
import { constants, BigNumber } from "ethers";
import { useState } from "react";
import { hooks } from "../../lib/connectors/metamask";
import { getURLParams } from "../../lib/parseUrlParams";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { useReloadToken } from "../../lib/useReloadToken";
import { useAsyncEffect } from "use-async-effect";
import * as yup from "yup";
import { assert } from "../../lib/assert";
import { isAddress } from "@ethersproject/address";

type TokenInfo = Awaited<ReturnType<typeof getTokenInfo>>;
export type ValidationError = Error & {
  errors: string[];
  value: Record<string, unknown>;
};

function validateUrlParams() {
  const urlParams = getURLParams();

  // offer values
  offers.validation.createOfferArgsSchema.validateSync(
    { ...urlParams, seller: constants.AddressZero },
    {
      abortEarly: false
    }
  );

  // config values
  yup
    .object({
      chainId: yup
        .string()
        .required()
        .test("valid-chain-id", (val) => {
          assert(val);
          const number = parseInt(val);
          if (Number.isNaN(number)) return false;
          if (number < 1) return false;
          return true;
        }),
      protocolDiamond: yup
        .string()
        .test("valid-protocol-diamond", (val) =>
          isAddress(val ?? constants.AddressZero)
        ),
      subgraphUrl: yup.string().url(),
      jsonRpcUrl: yup.string().url(),
      theGraphIpfsUrl: yup.string().url(),
      ipfsMetadataUrl: yup.string().url()
    })
    .validateSync(urlParams, { abortEarly: false });
}

async function getTokenAllowance(
  coreSDK: CoreSDK,
  exchangeTokenAddress: string,
  account?: string
) {
  if (!account) return BigNumber.from(0);

  const allowance = await coreSDK.getExchangeTokenAllowance(
    exchangeTokenAddress,
    { owner: account }
  );
  return BigNumber.from(allowance);
}

async function getTokenInfo(
  coreSDK: CoreSDK,
  exchangeTokenAddress: string,
  account?: string
) {
  if (exchangeTokenAddress === constants.AddressZero) {
    return {
      name: "Ether",
      symbol: "ETH",
      address: constants.AddressZero,
      allowance: constants.MaxUint256,
      decimals: 18
    };
  }

  const [allowance, exchangeTokenInfo] = await Promise.all([
    getTokenAllowance(coreSDK, exchangeTokenAddress, account),
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
        metadata: AnyMetadata;
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
        validateUrlParams();
        const createOfferArgs = getCreateOfferArgs();

        const [metadata, tokenInfo] = await Promise.all([
          coreSDK.getMetadata(createOfferArgs.metadataHash),
          getTokenInfo(coreSDK, createOfferArgs.exchangeToken, account)
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
