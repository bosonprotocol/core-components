import { subgraph } from "@bosonprotocol/core-sdk";
import * as Sentry from "@sentry/browser";
import { BigNumberish, ethers, providers } from "ethers";
import { ArrowsLeftRight, Info, Spinner } from "phosphor-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
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
import SuccessTransactionToast from "../../../../toasts/SuccessTransactionToast";
import { Grid } from "../../../../ui/Grid";
import ThemedButton from "../../../../ui/ThemedButton";
import { Typography } from "../../../../ui/Typography";
import {
  getItemFromStorage,
  saveItemInStorage
} from "../../../../../hooks/storage/useBosonLocalStorage";
import { useModal } from "../../../useModal";
import { InnerDetailViewWithPortal } from "../../common/detail/InnerDetailViewWithPortal";
import { BuyOrSwapContainer } from "../../common/detail/BuyOrSwapContainer";
import { useDetailViewContext } from "../../common/detail/DetailViewProvider";
import { DetailViewProps } from "../../common/detail/types";
import { useBuyers } from "../../../../../hooks/useBuyers";
import { CommitRedeemSteps } from "./CommitRedeemSteps";
import { RedeemWhatsNext, RedeemWhatsNextProps } from "./RedeemWhatsNext";
import { useOpenAccountDrawer } from "../../../../wallet2/accountDrawer";
import { colors } from "../../../../../colors";
import { Provider } from "@bosonprotocol/ethers-sdk";
import { ThemedCommitButton } from "../../../../cta/offer/ThemedCommitButton";
import { getCssVar } from "../../../../../theme";
import dayjs from "dayjs";
import { getDateTimestamp } from "../../../../../lib/dates/getDateTimestamp";
import { LabelType, labelValueToText } from "../../../../exchangeCard/const";
import { ExchangeStatus } from "../../../../exchangeCard/ExchangeCard.styles";

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
    onAlreadyOwnOfferClick?: () => void;
  },
  "children" | "hasSellerEnoughFunds"
> &
  Pick<RedeemWhatsNextProps, "requestShipmentProps">;
export default function InnerCommitDetailView(
  props: InnerCommitDetailViewProps
) {
  const {
    onLicenseAgreementClick,
    onCommit,
    onCommitting,
    onAlreadyOwnOfferClick,
    selectedVariant,
    exchange,
    requestShipmentProps
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
  const externalExchangeId = exchange?.id;
  const [exchangeId, setExchangeId] = useState<string | undefined>(
    externalExchangeId
  );
  const handleSetExchangeId = useCallback(
    (newExchangeId: string) => {
      setStatus("success");
      setExchangeId(newExchangeId);
    },
    [externalExchangeId]
  );
  useEffect(() => {
    if (externalExchangeId) {
      handleSetExchangeId(externalExchangeId);
    }
  }, [externalExchangeId, handleSetExchangeId]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<
    | "initial-state"
    | "pending-signature"
    | "pending-transaction"
    | "error"
    | "success"
  >("initial-state");

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
  const [, openAccountDrawer] = useOpenAccountDrawer();
  const onCommitPendingSignature = () => {
    setIsLoading(true);
    showModal("WAITING_FOR_CONFIRMATION");
    setStatus("pending-signature");
  };
  const isVoidedOffer = !!offer.voidedAt;
  const isPreview = !offer.id;
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
    setStatus("pending-transaction");
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
      const handleOnCommit = () => {
        onCommit(exchangeId.toString(), receipt.transactionHash);
        handleSetExchangeId(exchangeId.toString());
      };
      handleOnCommit();
      toast((t) => (
        <SuccessTransactionToast
          t={t}
          action={`Commit to offer: ${offer.metadata?.name}`}
          onViewDetails={() => {
            handleOnCommit();
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
    setStatus("error");
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
  const { data: buyers } = useBuyers(
    {
      wallet: address
    },
    { enabled: !!address }
  );
  const buyer = buyers?.[0];
  const userCommittedOffers = useMemo(
    () =>
      buyer
        ? offer.exchanges
            ?.filter((elem) => elem?.buyer?.id === buyer.id)
            // exchanges with latest committedDate first
            .sort((a, b) => (a.committedDate > b.committedDate ? -1 : 1))
        : undefined,
    [offer, buyer]
  );
  return (
    <>
      <>
        {address && !!userCommittedOffers && !exchangeId ? (
          <Grid
            gap="0.5rem"
            padding="1rem"
            marginBottom="1rem"
            alignItems="center"
            justifyContent="flex-start"
            style={{
              ...(onAlreadyOwnOfferClick && { cursor: "pointer" }),
              border: `1px solid ${colors.border}`,
              borderRadius: "4px",
              backgroundColor: getCssVar("--background-color")
            }}
            onClick={() => onAlreadyOwnOfferClick?.()}
          >
            <Info
              color={getCssVar("--main-text-color")}
              style={{ minWidth: "24px", minHeight: "24px" }}
            />
            <Grid flexDirection="column" alignItems="flex-start" width="auto">
              <Typography fontSize="0.75rem" fontWeight={600}>
                Last time you bought this product was on{" "}
                {dayjs(
                  getDateTimestamp(userCommittedOffers[0]?.committedDate || "")
                ).format("MMMM D, YYYY")}
              </Typography>
              <Typography fontSize="0.75rem" fontWeight={400}>
                You purchased a total of {userCommittedOffers.length || 0} of
                this item.
              </Typography>
            </Grid>
          </Grid>
        ) : null}
        <InnerDetailViewWithPortal
          {...props}
          topChildren={null}
          priceSibling={
            status === "success" ? (
              // TODO: if exchange is in a different state what do we do?
              <ExchangeStatus $status={subgraph.ExchangeState.COMMITTED}>
                {labelValueToText[LabelType.purchased]}
              </ExchangeStatus>
            ) : (
              props.priceSibling
            )
          }
        >
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
                  {exchangeId ? (
                    <>
                      <CommitRedeemSteps status={"pending-signature"} />
                      <RedeemWhatsNext
                        exchangeId={exchangeId}
                        requestShipmentProps={requestShipmentProps}
                      />
                    </>
                  ) : (
                    <CommitButtonWrapper
                      disabled={!!isCommitDisabled}
                      role="button"
                      $pointerEvents={!address ? "none" : "all"}
                      onClick={() => {
                        if (!address) {
                          saveItemInStorage("isConnectWalletFromCommit", true);
                          setIsCommittingFromNotConnectedWallet(true);
                          openAccountDrawer();
                        }
                      }}
                    >
                      {balanceLoading && address ? (
                        <ThemedButton disabled>
                          <Spinner />
                        </ThemedButton>
                      ) : (
                        <ThemedCommitButton
                          coreSdkConfig={{
                            envName: protocolConfig.envName,
                            configId: protocolConfig.configId,
                            web3Provider: signer?.provider as Provider,
                            metaTx: protocolConfig.metaTx
                          }}
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
                          id="commit"
                        />
                      )}
                    </CommitButtonWrapper>
                  )}
                  <Typography
                    fontSize="0.8rem"
                    marginTop="0.25rem"
                    style={{ display: "block" }}
                    color={getCssVar("--sub-text-color")}
                  >
                    By proceeding to Buy, I agree to the{" "}
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
      </>
    </>
  );
}
