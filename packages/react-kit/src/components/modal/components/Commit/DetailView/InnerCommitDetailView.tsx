import { subgraph } from "@bosonprotocol/core-sdk";
import { Provider } from "@bosonprotocol/ethers-sdk";
import { useAccountModal } from "@rainbow-me/rainbowkit";
import * as Sentry from "@sentry/browser";
import { BigNumberish, ethers, providers } from "ethers";
import { ArrowsLeftRight, Spinner } from "phosphor-react";
import React, { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import styled, { css } from "styled-components";
import {
  useAccount,
  useSigner
} from "../../../../../hooks/connection/connection";
import { useCoreSDKWithContext } from "../../../../../hooks/core-sdk/useCoreSdkWithContext";
import {
  extractUserFriendlyError,
  getHasUserRejectedTx
} from "../../../../../lib/errors/transactions";
import { poll } from "../../../../../lib/promises/promises";
import { Button } from "../../../../buttons/Button";
import { useConfigContext } from "../../../../config/ConfigContext";
import { CommitButton } from "../../../../cta/offer/CommitButton";
import SuccessTransactionToast from "../../../../toasts/SuccessTransactionToast";
import Grid from "../../../../ui/Grid";
import ThemedButton from "../../../../ui/ThemedButton";
import Typography from "../../../../ui/Typography";
import {
  getItemFromStorage,
  saveItemInStorage
} from "../../../../widgets/finance/storage/useLocalStorage";
import { useModal } from "../../../useModal";
import { InnerDetailViewWithPortal } from "./InnerDetailViewWithPortal";
import { BuyOrSwapContainer } from "./common/BuyOrSwapContainer";
import { useDetailViewContext } from "./common/DetailViewProvider";
import { DetailViewProps } from "./common/types";
import { useNotCommittableOfferStatus } from "../useNotCommittableOfferStatus";
type ActionName = "approveExchangeToken" | "depositFunds" | "commit";

const CommitButtonWrapper = styled.div<{
  $pointerEvents: string;
  disabled: boolean;
}>`
  width: 100%;
  ${({ disabled }) =>
    disabled
      ? css`
          * {
            cursor: not-allowed;
          }
        `
      : css`
          cursor: pointer;
        `};

  > button {
    width: 100%;
    pointer-events: ${({ $pointerEvents }) => $pointerEvents};
  }
`;
const containerBreakpoint = "400px";
const CommitWrapper = styled(Grid)`
  flex-direction: column;
  row-gap: 0.5rem;
  column-gap: 1rem;
  align-items: flex-start;
  justify-content: flex-start;
  @container (width > ${containerBreakpoint}) {
    flex-direction: row;
    > * {
      flex: 1 1 50%;
    }
  }
`;
const SwapArrows = styled(ArrowsLeftRight)`
  && {
    stroke: none;
  }
`;
export type InnerCommitDetailViewProps = Omit<
  DetailViewProps & {
    onLicenseAgreementClick: () => void;
    onCommit: (exchangeId: string, txHash: string) => void;
    onCommitting: (txHash: string) => void;
  },
  "children" | "hasSellerEnoughFunds"
>;
export default function InnerCommitDetailView(
  props: InnerCommitDetailViewProps
) {
  const {
    onLicenseAgreementClick,
    onCommit,
    onCommitting,
    selectedVariant,
    isPreview
  } = props;
  const { offer } = selectedVariant;
  const {
    quantity,
    balanceLoading,
    isBuyerInsufficientFunds,
    isOfferNotValidYet,
    isExpiredOffer,
    isConditionMet,
    hasSellerEnoughFunds,
    swapParams
  } = useDetailViewContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [
    isCommittingFromNotConnectedWallet,
    setIsCommittingFromNotConnectedWallet
  ] = useState(false);
  const { showModal, hideModal } = useModal();
  const [commitType, setCommitType] = useState<ActionName | undefined | null>(
    null
  );
  const config = useConfigContext();
  const { config: protocolConfig } = config;
  const signer = useSigner();
  const coreSDK = useCoreSDKWithContext();
  const commitButtonRef = useRef<HTMLButtonElement>(null);
  const { address } = useAccount();
  const { openAccountModal } = useAccountModal();
  const onCommitPendingSignature = () => {
    setIsLoading(true);
    showModal("WAITING_FOR_CONFIRMATION");
  };
  const isVoidedOffer = !!offer.voidedAt;

  const isCommitDisabled =
    !address ||
    !hasSellerEnoughFunds ||
    isExpiredOffer ||
    isLoading ||
    !quantity ||
    isVoidedOffer ||
    isPreview ||
    isOfferNotValidYet ||
    isBuyerInsufficientFunds ||
    (offer.condition && !isConditionMet);
  const handleOnGetSignerAddress = useCallback(
    (signerAddress: string | undefined) => {
      const isConnectWalletFromCommit = getItemFromStorage(
        "isConnectWalletFromCommit",
        false
      );
      if (
        isCommittingFromNotConnectedWallet &&
        address &&
        signerAddress &&
        isConnectWalletFromCommit
      ) {
        const commitButton = commitButtonRef.current;
        if (commitButton) {
          commitButton.click();
          setIsCommittingFromNotConnectedWallet(false);
        }
      }
      return signerAddress;
    },
    [address, isCommittingFromNotConnectedWallet]
  );
  const onCommitPendingTransaction = (
    hash: string,
    isMetaTx?: boolean | undefined,
    actionName?: ActionName | undefined
  ) => {
    setCommitType(actionName);
    if (actionName && actionName === "approveExchangeToken") {
      showModal("TRANSACTION_SUBMITTED", {
        action: "Approve ERC20 Token",
        txHash: hash
      });
    } else {
      showModal("TRANSACTION_SUBMITTED", {
        action: "Commit",
        txHash: hash
      });
      onCommitting(hash);
    }
  };
  const onCommitSuccess = async (
    receipt: ethers.providers.TransactionReceipt,
    { exchangeId }: { exchangeId: BigNumberish }
  ) => {
    let createdExchange: subgraph.ExchangeFieldsFragment;
    await poll(
      async () => {
        createdExchange = await coreSDK.getExchangeById(exchangeId);
        return createdExchange;
      },
      (createdExchange) => {
        return !createdExchange;
      },
      500
    );
    setIsLoading(false);
    hideModal();
    if (commitType === "approveExchangeToken") {
      toast((t) => (
        <SuccessTransactionToast
          t={t}
          action={"Token approval transaction submitted"}
        />
      ));
    } else {
      const showDetailWidgetModal = () => {
        onCommit(exchangeId.toString(), receipt.transactionHash);
      };
      showDetailWidgetModal();
      toast((t) => (
        <SuccessTransactionToast
          t={t}
          action={`Commit to offer: ${offer.metadata.name}`}
          onViewDetails={() => {
            showDetailWidgetModal();
          }}
        />
      ));
    }
    setCommitType(null);
  };
  const onCommitError = async (
    error: Error,
    { txResponse }: { txResponse: providers.TransactionResponse | undefined }
  ) => {
    console.error("onError", error);
    setIsLoading(false);
    const hasUserRejectedTx = getHasUserRejectedTx(error);
    if (hasUserRejectedTx) {
      showModal("TRANSACTION_FAILED");
    } else {
      Sentry.captureException(error);
      showModal("TRANSACTION_FAILED", {
        title: "An error occurred",
        errorMessage: await extractUserFriendlyError(error, {
          txResponse,
          provider: signer?.provider
        })
      });
    }
    setCommitType(null);
  };
  const { onClickBuyOrSwap } = props;
  const tokenOrCoinSymbol = offer.exchangeToken.symbol;
  const isOfferEmpty = quantity < 1;

  const isNotCommittableOffer =
    isOfferEmpty ||
    isOfferNotValidYet ||
    isExpiredOffer ||
    offer.voided ||
    !hasSellerEnoughFunds ||
    isBuyerInsufficientFunds;

  return (
    <InnerDetailViewWithPortal {...props}>
      {isNotCommittableOffer && isBuyerInsufficientFunds && (
        <Grid marginBottom="1rem">
          <BuyOrSwapContainer
            swapParams={swapParams}
            onClickBuyOrSwap={onClickBuyOrSwap}
            style={{ padding: 0 }}
          >
            <Button
              size="regular"
              variant="accentInverted"
              withBosonStyle
              style={{
                width: "100%"
              }}
              {...(onClickBuyOrSwap && {
                onClick: () => onClickBuyOrSwap({ swapParams })
              })}
            >
              Buy or Swap {tokenOrCoinSymbol} <SwapArrows size={24} />
            </Button>
          </BuyOrSwapContainer>
        </Grid>
      )}
      {!isBuyerInsufficientFunds && (
        <Grid flexDirection="column" alignItems="center" margin="1.5rem 0">
          <CommitWrapper justifyContent="space-between">
            <Grid flexDirection="column" alignItems="center">
              <CommitButtonWrapper
                disabled={!!isCommitDisabled}
                role="button"
                $pointerEvents={!address ? "none" : "all"}
                onClick={() => {
                  if (!address) {
                    saveItemInStorage("isConnectWalletFromCommit", true);
                    setIsCommittingFromNotConnectedWallet(true);
                    openAccountModal?.();
                  }
                }}
              >
                {balanceLoading && address ? (
                  <ThemedButton disabled>
                    <Spinner />
                  </ThemedButton>
                ) : (
                  <>
                    {/* TODO: handle commit proxy button {showCommitProxyButton ? (
                <CommitProxyButton />
              ) : ( */}
                    <CommitButton
                      coreSdkConfig={{
                        envName: protocolConfig.envName,
                        configId: protocolConfig.configId,
                        web3Provider: signer?.provider as Provider,
                        metaTx: protocolConfig.metaTx
                      }}
                      variant="primaryFill"
                      isPauseCommitting={!address}
                      buttonRef={commitButtonRef}
                      onGetSignerAddress={handleOnGetSignerAddress}
                      disabled={!!isCommitDisabled}
                      offerId={offer.id}
                      exchangeToken={offer.exchangeToken.address}
                      price={offer.price}
                      onError={onCommitError}
                      onPendingSignature={onCommitPendingSignature}
                      onPendingTransaction={onCommitPendingTransaction}
                      onSuccess={onCommitSuccess}
                      withBosonStyle
                      extraInfo="Step 1/2"
                      id="commit"
                    />
                    {/* )} */}
                  </>
                )}
              </CommitButtonWrapper>
              <Typography
                $fontSize="0.8rem"
                marginTop="0.25rem"
                style={{ display: "block" }}
              >
                By proceeding to Commit, I agree to the{" "}
                <span
                  style={{
                    fontSize: "inherit",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                  onClick={() => {
                    onLicenseAgreementClick();
                  }}
                >
                  rNFT Terms
                </span>
                .
              </Typography>
            </Grid>
          </CommitWrapper>
        </Grid>
      )}
    </InnerDetailViewWithPortal>
  );
}
