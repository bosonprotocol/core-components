import React, { useState } from "react";
import { BigNumberish } from "ethers";
import { ChainId } from "@bosonprotocol/common";
import { Chain as OSChain, OpenSeaSDK } from "opensea-js";
import { Signer as SignerV6 } from "ethers-v6";
import { API_BASE_MAINNET, API_BASE_TESTNET } from "opensea-js/lib/constants";

import { Button } from "../../buttons/Button";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../ui/loading/Loading";
import { ButtonSize } from "../../ui/buttonSize";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";
import { useSignerV6 } from "../../../hooks";
import {
  Listing,
  MarketplaceType
} from "@bosonprotocol/core-sdk/dist/cjs/marketplaces/types";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";

type Props = {
  tokenId: BigNumberish;
  price: BigNumberish;
} & CtaButtonProps<{
  tokenId: BigNumberish;
  price: BigNumberish;
}> & {
    providerProps: Omit<ConfigProviderProps, "children">;
  };

function getOpenSeaChain(chainId: ChainId): OSChain {
  switch (chainId) {
    case 1: {
      return OSChain.Mainnet;
    }
    case 137: {
      return OSChain.Polygon;
    }
    case 80002: {
      return OSChain.Amoy;
    }
    case 11155111: {
      return OSChain.Sepolia;
    }
    case 31337: {
      return "hardhat" as OSChain;
    }
    default: {
      throw new Error(`Chain ${chainId} not supported`);
    }
  }
}

function createOpenSeaSDK(
  signerV6: SignerV6,
  chainId: ChainId,
  OPENSEA_API_KEY: string
): OpenSeaSDK {
  let openseaUrl;
  switch (chainId) {
    case 1:
    case 137: {
      openseaUrl = API_BASE_MAINNET;
      break;
    }
    default: {
      openseaUrl = API_BASE_TESTNET;
    }
  }
  const openseaSdk = new OpenSeaSDK(
    signerV6 as any,
    {
      chain: getOpenSeaChain(chainId),
      apiKey: OPENSEA_API_KEY,
      apiBaseUrl: openseaUrl
    },
    (line) => console.info(`SEPOLIA OS: ${line}`)
  );
  (openseaSdk.api as any).apiBaseUrl = openseaUrl; // << force the API URL
  return openseaSdk;
}

const withConfigProvider = <
  P extends { providerProps: Omit<ConfigProviderProps, "children"> }
>(
  WrappedComponent: React.ComponentType<P>
) => {
  // Define the props type for the wrapped component
  type Props = P;

  // Return a new component
  const WithConfigProvider: React.FC<Props> = (props) => {
    return (
      <ConfigProvider {...props.providerProps}>
        <WrappedComponent {...props} />
      </ConfigProvider>
    );
  };

  // Set display name for debugging purposes
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  WithConfigProvider.displayName = `withQueryClientProviderCustom(${displayName})`;

  return WithConfigProvider;
};

export const CreateListingButton = withConfigProvider(
  withQueryClientProvider(
    ({
      tokenId,
      price,
      disabled = false,
      showLoading = false,
      extraInfo,
      onSuccess,
      onError,
      onPendingSignature,
      onPendingTransaction,
      waitBlocks = 1,
      size = ButtonSize.Large,
      variant = "secondaryFill",
      children,
      coreSdkConfig,
      providerProps,
      ...rest
    }: Props) => {
      const coreSdk = useCoreSdkOverrides({ coreSdkConfig });
      const [isLoading, setIsLoading] = useState<boolean>(false);
      const signerV6 = useSignerV6();
      const OPENSEA_API_KEY = "56a6c19ed53b48f3aab9eff2c2e91468";
      const OPENSEA_FEE_RECIPIENT =
        "0x0000a26b00c1F0DF003000390027140000fAa719"; // On Real OpenSea

      return (
        <Button
          variant={variant}
          disabled={disabled || !signerV6 || !tokenId}
          size={size}
          onClick={async () => {
            if (!isLoading && tokenId) {
              try {
                setIsLoading(true);
                onPendingSignature?.();

                const { offerId, exchangeId } = coreSdk.parseTokenId(tokenId);
                console.log({
                  offerId: offerId.toString(),
                  exchangeId: exchangeId.toString()
                });
                const openseaSdk = coreSdk.marketplace(
                  MarketplaceType.OPENSEA,
                  createOpenSeaSDK(
                    signerV6 as SignerV6,
                    (await coreSdk.web3Lib.getChainId()) as ChainId,
                    OPENSEA_API_KEY
                  ),
                  OPENSEA_FEE_RECIPIENT
                );
                const offer = await coreSdk.getOfferById(offerId);
                const nftContract = offer.collection.collectionContract.address;
                const { wrapped, wrapper } = await openseaSdk.isVoucherWrapped(
                  nftContract,
                  tokenId.toString()
                );
                const listing: Listing = {
                  asset: {
                    contract: wrapped ? (wrapper as string) : nftContract,
                    tokenId: tokenId.toString()
                  },
                  offerer: await (signerV6 as SignerV6).getAddress(),
                  price: price.toString(),
                  expirationTime: Math.floor(Date.now() / 1000) + 3600, // should be greater than now + 10 mins
                  exchangeToken: {
                    address: offer.exchangeToken.address, // can't be anything else than WETH on testnet
                    decimals: Number(offer.exchangeToken.decimals)
                  },
                  auction: true
                };
                const listingOrder = await openseaSdk.createListing(listing);
                console.log("Listing Order:", listingOrder);
                onSuccess?.(undefined as any, { tokenId, price });
              } catch (error) {
                onError?.(error as Error, { txResponse: undefined });
              } finally {
                setIsLoading(false);
              }
            }
          }}
          {...rest}
        >
          <ButtonTextWrapper>
            {children || "Create Listing"}
            {extraInfo && ((!isLoading && showLoading) || !showLoading) ? (
              <ExtraInfo>{extraInfo}</ExtraInfo>
            ) : (
              <>
                {isLoading && showLoading && (
                  <LoadingWrapper>
                    <Loading />
                  </LoadingWrapper>
                )}
              </>
            )}
          </ButtonTextWrapper>
        </Button>
      );
    }
  )
);
