import React, { useState } from "react";
import { providers } from "ethers";

import { Button, ButtonSize } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";
import { offers } from "@bosonprotocol/core-sdk";

type Props = {
  hasSellerAccount: boolean;
  sellerInfo?: {
    operator: string;
    admin: string;
    treasury: string;
    clerk: string;
    contractUri: string;
    royaltyPercentage: string;
    authTokenId: string;
    authTokenType: number;
  };
  isMultiVariant: boolean;
  offersToCreate: offers.CreateOfferArgs[];
} & CtaButtonProps<{
  offerIdData: string[] | string;
}>;

export const CreateOfferButton = ({
  disabled = false,
  showLoading = false,
  extraInfo = "",
  children,
  onPendingSignature,
  onPendingTransaction,
  onSuccess,
  onError,
  waitBlocks = 1,
  size = ButtonSize.Large,
  variant = "primaryFill",
  isMultiVariant,
  hasSellerAccount,
  sellerInfo,
  offersToCreate,
  ...coreSdkConfig
}: Props) => {
  const coreSdk = useCoreSdk(coreSdkConfig);
  const signerAddress = useSignerAddress(coreSdkConfig.web3Provider);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreateOffer = async () => {
    if (!isLoading) {
      try {
        setIsLoading(true);
        onPendingSignature?.();
        const isMetaTx = Boolean(coreSdk.isMetaTxConfigSet && signerAddress);
        const seller = signerAddress && sellerInfo ? sellerInfo : null;
        let txResponse;
        if (isMultiVariant) {
          if (!hasSellerAccount && seller) {
            if (isMetaTx) {
              // createSeller with meta-transaction
              const nonce = Date.now();
              const { r, s, v, functionName, functionSignature } =
                await coreSdk.signMetaTxCreateSeller({
                  createSellerArgs: seller,
                  nonce
                });
              txResponse = await coreSdk.relayMetaTransaction({
                functionName,
                functionSignature,
                sigR: r,
                sigS: s,
                sigV: v,
                nonce
              });
            } else {
              txResponse = await coreSdk.createSeller(seller);
            }
            onPendingTransaction?.(txResponse.hash, isMetaTx);

            await txResponse.wait(waitBlocks);
            onPendingSignature?.();
          }
          if (isMetaTx) {
            // createOfferBatch with meta-transaction
            const nonce = Date.now();
            const { r, s, v, functionName, functionSignature } =
              await coreSdk.signMetaTxCreateOfferBatch({
                createOffersArgs: offersToCreate,
                nonce
              });
            txResponse = await coreSdk.relayMetaTransaction({
              functionName,
              functionSignature,
              sigR: r,
              sigS: s,
              sigV: v,
              nonce
            });
          } else {
            txResponse = await coreSdk.createOfferBatch(offersToCreate);
          }
          onPendingTransaction?.(txResponse.hash, isMetaTx);

          const txReceipt = await txResponse.wait(waitBlocks);
          const offerIds = coreSdk.getCreatedOfferIdsFromLogs(txReceipt.logs);
          onSuccess?.(txReceipt as providers.TransactionReceipt, {
            offerIdData: offerIds
          });
        } else {
          const [offerData] = offersToCreate;
          if (isMetaTx) {
            // meta-transaction
            if (!hasSellerAccount && seller) {
              // createSeller with meta-transaction
              const nonce = Date.now();
              const { r, s, v, functionName, functionSignature } =
                await coreSdk.signMetaTxCreateSeller({
                  createSellerArgs: seller,
                  nonce
                });
              const createSellerResponse = await coreSdk.relayMetaTransaction({
                functionName,
                functionSignature,
                sigR: r,
                sigS: s,
                sigV: v,
                nonce
              });
              onPendingTransaction?.(createSellerResponse.hash, isMetaTx);
              await createSellerResponse.wait(waitBlocks);
              onPendingSignature?.();
            }
            // createOffer with meta-transaction
            const nonce = Date.now();
            const { r, s, v, functionName, functionSignature } =
              await coreSdk.signMetaTxCreateOffer({
                createOfferArgs: offerData,
                nonce
              });
            txResponse = await coreSdk.relayMetaTransaction({
              functionName,
              functionSignature,
              sigR: r,
              sigS: s,
              sigV: v,
              nonce
            });
          } else {
            txResponse =
              !hasSellerAccount && seller
                ? await coreSdk.createSellerAndOffer(seller, offerData)
                : await coreSdk.createOffer(offerData);
          }
          onPendingTransaction?.(txResponse.hash, isMetaTx);

          const txReceipt = await txResponse.wait(waitBlocks);
          const offerId = coreSdk.getCreatedOfferIdFromLogs(txReceipt.logs);
          onSuccess?.(txReceipt as providers.TransactionReceipt, {
            offerIdData: offerId || ""
          });
        }
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={handleCreateOffer}
    >
      <ButtonTextWrapper>
        {children || "Create offer"}
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
};
