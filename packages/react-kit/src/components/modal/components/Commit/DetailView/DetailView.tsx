import * as Sentry from "@sentry/browser";
import { offers, subgraph } from "@bosonprotocol/core-sdk";
import { Provider } from "@bosonprotocol/ethers-sdk";
import dayjs from "dayjs";
import { BigNumberish, ethers, providers, utils } from "ethers";
import {
  ArrowSquareOut,
  ArrowsLeftRight,
  CircleWavyQuestion,
  Cube,
  Info,
  Lock,
  Spinner,
  WarningCircle
} from "phosphor-react";
import toast from "react-hot-toast";
import React, {
  ElementRef,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";
import styled, { css } from "styled-components";
import {
  useSigner,
  useAccount
} from "../../../../../hooks/connection/connection";
import { ReactComponent as Logo } from "../../../../../assets/logo.svg";
import useCheckTokenGatedOffer from "../../../../../hooks/tokenGated/useCheckTokenGatedOffer";
import { useCoreSDKWithContext } from "../../../../../hooks/core-sdk/useCoreSdkWithContext";
import { getDateTimestamp } from "../../../../../lib/dates/getDateTimestamp";
import {
  useDisplayFloat,
  getCalcPercentage
} from "../../../../../lib/price/prices";
import { theme } from "../../../../../theme";
import { Button } from "../../../../buttons/Button";
import { useConfigContext } from "../../../../config/ConfigContext";
import { CommitButton } from "../../../../cta/offer/CommitButton";
import { useConvertedPrice } from "../../../../price/useConvertedPrice";
import Typography from "../../../../ui/Typography";
import {
  getItemFromStorage,
  saveItemInStorage
} from "../../../../widgets/finance/storage/useLocalStorage";
import {
  Widget,
  WidgetUpperGrid,
  Break,
  CommitAndRedeemButton
} from "../../common/detail/Detail.style";
import DetailTable from "../../common/detail/DetailTable";
import { QuantityDisplay } from "./QuantityDisplay";
import Price from "../../../../price/Price";
import { Offer } from "../../../../../types/offer";
import { useModal } from "../../../useModal";
import { useAccountModal } from "@rainbow-me/rainbowkit";
import {
  extractUserFriendlyError,
  getHasUserRejectedTx
} from "../../../../../lib/errors/transactions";
import { poll } from "../../../../../lib/promises/promises";
import SuccessTransactionToast from "../../../../toasts/SuccessTransactionToast";
import { DetailDisputeResolver } from "../../common/detail/DetailDisputeResolver";
import Grid from "../../../../ui/Grid";
import { VariantV1 } from "../../../../../types/variants";
import ThemedButton from "../../../../ui/ThemedButton";
import { Field, swapQueryParameters } from "../../../../../lib/parameters/swap";
import { useExchangeTokenBalance } from "../../../../../hooks/offer/useExchangeTokenBalance";
import { DetailsSummary } from "../../../../ui/DetailsSummary";
import { TokenGatedList } from "../../common/detail/TokenGatedList";
import { createPortal } from "react-dom";
import { RedeemButton } from "../../../../cta/exchange/RedeemButton";

const colors = theme.colors.light;

const StyledPrice = styled(Price)`
  h3 {
    font-size: 2rem;
  }
  small {
    font-size: 1rem;
  }
`;

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
const CTAsGrid = styled(Grid)`
  .show-in-larger-view {
    display: none;
  }
  .show-in-smaller-view {
    display: block;
  }
  @container (width > ${containerBreakpoint}) {
    .show-in-larger-view {
      display: block;
    }
    .show-in-smaller-view {
      display: none;
    }
  }
`;

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

const StyledRedeemButton = styled(RedeemButton)`
  width: 100%;
`;

type ActionName = "approveExchangeToken" | "depositFunds" | "commit";

const getOfferDetailData = ({
  config,
  displayFloat,
  offer,
  onExchangePolicyClick,
  exchangePolicyCheckResult
}: {
  config: ReturnType<typeof useConfigContext>;
  displayFloat: ReturnType<typeof useDisplayFloat>;
  offer: Offer;
  onExchangePolicyClick: IDetailWidget["onExchangePolicyClick"];
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
}) => {
  const redeemableUntil = dayjs(
    Number(`${offer.voucherRedeemableUntilDate}000`)
  ).format(config.dateFormat);
  const calcPercentage = getCalcPercentage(displayFloat);

  const { formatted } = calcPercentage(offer, "buyerCancelPenalty");
  const { formatted: sellerFormatted } = calcPercentage(offer, "sellerDeposit");

  const exchangePolicyLabel = (
    (offer.metadata as subgraph.ProductV1MetadataEntity)?.exchangePolicy
      ?.label || "Unspecified"
  ).replace("fairExchangePolicy", "Fair Exchange Policy");

  const handleShowExchangePolicy = () => {
    onExchangePolicyClick();
  };
  return [
    {
      name: "Redeemable until",
      info: (
        <>
          <Typography tag="h6">
            <b>Redeemable</b>
          </Typography>
          <Typography tag="p">
            If you don't redeem your NFT during the redemption period, it will
            expire and you will receive back the price minus the Buyer cancel
            penalty
          </Typography>
        </>
      ),
      value: <Typography tag="p">{redeemableUntil}</Typography>
    },
    {
      name: "Seller deposit",
      info: (
        <>
          <Typography tag="h6">
            <b>Seller deposit</b>
          </Typography>
          <Typography tag="p">
            The Seller deposit is used to hold the seller accountable to follow
            through with their commitment to deliver the physical item. If the
            seller breaks their commitment, the deposit will be transferred to
            the buyer.
          </Typography>
        </>
      ),
      value: (
        <Typography tag="p">
          {sellerFormatted}{" "}
          <span style={{ opacity: 0.5 }}>{offer.exchangeToken.symbol}</span>
        </Typography>
      )
    },
    {
      name: "Buyer cancellation penalty",
      info: (
        <>
          <Typography tag="h6">
            <b>Buyer Cancelation penalty</b>
          </Typography>
          <Typography tag="p">
            If you fail to redeem your rNFT in time, you will receive back the
            price minus the buyer cancellation penalty.
          </Typography>
        </>
      ),
      value: (
        <Typography tag="p">
          {formatted}{" "}
          <span style={{ opacity: 0.5 }}>{offer.exchangeToken.symbol}</span>
        </Typography>
      )
    },
    {
      name: "Exchange policy",
      info: (
        <>
          <Typography tag="h6">
            <b>Exchange policy</b>
          </Typography>
          <p>
            The Exchange policy ensures that the terms of sale are set in a fair
            way to protect both buyers and sellers.
          </p>
        </>
      ),
      value: exchangePolicyCheckResult ? (
        exchangePolicyCheckResult.isValid ? (
          <>{exchangePolicyLabel}</>
        ) : (
          <>
            <WarningCircle size={20} color={"purple"}></WarningCircle>{" "}
            <span style={{ color: "purple" }}>Non-standard </span>
            <ArrowSquareOut
              size={20}
              color={"purple"}
              onClick={() => handleShowExchangePolicy()}
              style={{ cursor: "pointer" }}
            />
          </>
        )
      ) : (
        <>
          <CircleWavyQuestion size={20} color="purple"></CircleWavyQuestion>{" "}
          <span style={{ color: "purple" }}>Unknown </span>
          <ArrowSquareOut
            size={20}
            color="purple"
            onClick={() => handleShowExchangePolicy()}
            style={{ cursor: "pointer" }}
          />
        </>
      )
    },
    {
      name: DetailDisputeResolver.name,
      info: DetailDisputeResolver.info,
      // eslint-disable-next-line react/jsx-pascal-case
      value: <DetailDisputeResolver.value />
    }
  ];
};

const SwapArrows = styled(ArrowsLeftRight)`
  && {
    stroke: none;
  }
`;

const BosonExclusiveContainer = styled.div`
  && {
    position: absolute;
    bottom: 0;
    padding: 0.25rem 1rem;
    background-color: ${colors.black};
    color: ${colors.white};
    width: auto;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
    border-radius: 1.0625rem 1.0625rem 0rem 0rem;
  }
`;

const BlackLogo = styled(Logo)`
  width: 6.25rem;
  height: fit-content;
  padding: 1.2rem 0;
`;

interface IDetailWidget {
  selectedVariant: VariantV1;
  allVariants: VariantV1[];
  disableVariationsSelects?: boolean;
  hasSellerEnoughFunds: boolean;
  isPreview?: boolean;
  hasMultipleVariants?: boolean;
  showBosonLogo?: boolean;
  onLicenseAgreementClick: () => void;
  onExchangePolicyClick: () => void;
  onCommit: (exchangeId: string, txHash: string) => void;
  onCommitting: (txHash: string) => void;
  onPurchaseOverview: () => void;
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
}

const DetailView: React.FC<IDetailWidget> = forwardRef(
  (
    {
      selectedVariant,
      allVariants,
      disableVariationsSelects,
      showBosonLogo,
      hasSellerEnoughFunds,
      isPreview = false,
      hasMultipleVariants,
      onLicenseAgreementClick,
      onExchangePolicyClick,
      onPurchaseOverview,
      onCommit,
      onCommitting,
      exchangePolicyCheckResult
    },
    ref
  ) => {
    const forwardedRef = ref as React.MutableRefObject<ElementRef<"div">>;
    const { offer } = selectedVariant;
    const coreSDK = useCoreSDKWithContext();
    const [commitType, setCommitType] = useState<ActionName | undefined | null>(
      null
    );
    const signer = useSigner();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { showModal, hideModal } = useModal();
    const config = useConfigContext();
    const {
      commitProxyAddress,
      openseaLinkToOriginalMainnetCollection,
      config: protocolConfig
    } = config;
    const [
      isCommittingFromNotConnectedWallet,
      setIsCommittingFromNotConnectedWallet
    ] = useState(false);
    const displayFloat = useDisplayFloat();
    const { address } = useAccount();
    const { openAccountModal } = useAccountModal();
    const onCommitPendingSignature = () => {
      setIsLoading(true);
      showModal("WAITING_FOR_CONFIRMATION");
    };

    const convertedPrice = useConvertedPrice({
      value: offer.price,
      decimals: offer.exchangeToken.decimals,
      symbol: offer.exchangeToken.symbol
    });
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
        // TODO: handle pending transactions
        // addPendingTransaction({
        //   type: subgraph.EventType.BuyerCommitted,
        //   hash,
        //   isMetaTx,
        //   accountType: "Buyer",
        //   offerId: offer.id,
        //   offer: {
        //     id: offer.id
        //   }
        // });
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
      // TODO: handle pending transactions
      // removePendingTransaction("offerId", offer.id);
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
      // TODO: handle pending transactions
      // removePendingTransaction("offerId", offer.id);
    };
    const isFreeOffer = offer.price === "0";
    const { balance: exchangeTokenBalance, loading: balanceLoading } =
      useExchangeTokenBalance(offer.exchangeToken, {
        enabled: !isFreeOffer
      });

    const isBuyerInsufficientFunds: boolean = useMemo(
      () =>
        isFreeOffer
          ? false
          : !!exchangeTokenBalance && exchangeTokenBalance.lte(offer.price),
      [exchangeTokenBalance, offer.price, isFreeOffer]
    );
    const minNeededBalance = exchangeTokenBalance?.sub(offer.price).mul(-1);

    const OFFER_DETAIL_DATA = useMemo(
      () =>
        getOfferDetailData({
          config,
          displayFloat,
          offer,
          onExchangePolicyClick,
          exchangePolicyCheckResult
        }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [offer, convertedPrice, config, displayFloat]
    );

    const quantity = useMemo<number>(
      () => Number(offer?.quantityAvailable || 0),
      [offer?.quantityAvailable]
    );

    const quantityInitial = useMemo<number>(
      () => Number(offer?.quantityInitial || 0),
      [offer?.quantityInitial]
    );

    const isExpiredOffer = useMemo<boolean>(
      () => dayjs(getDateTimestamp(offer?.validUntilDate)).isBefore(dayjs()),
      [offer?.validUntilDate]
    );
    const isVoidedOffer = !!offer.voidedAt;

    const nowDate = dayjs();

    const isOfferEmpty = quantity < 1;
    const isOfferNotValidYet = dayjs(
      getDateTimestamp(offer?.validFromDate)
    ).isAfter(nowDate);

    const isNotCommittableOffer =
      isOfferEmpty ||
      isOfferNotValidYet ||
      isExpiredOffer ||
      offer.voided ||
      !hasSellerEnoughFunds ||
      isBuyerInsufficientFunds;
    const commitButtonRef = useRef<HTMLButtonElement>(null);
    const tokenOrCoinSymbol = offer.exchangeToken.symbol;
    const notCommittableOfferStatus = useMemo(() => {
      if (isBuyerInsufficientFunds) {
        return "Insufficient Funds";
      }
      if (offer.voided) {
        return "Offer voided";
      }
      if (isExpiredOffer) {
        return "Expired";
      }
      if (isOfferNotValidYet) {
        return "Sale starting soon™️";
      }
      if (isOfferEmpty) {
        return "Sold out";
      }
      if (!hasSellerEnoughFunds) {
        return "Invalid";
      }
      return "";
    }, [
      hasSellerEnoughFunds,
      isBuyerInsufficientFunds,
      isExpiredOffer,
      isOfferEmpty,
      isOfferNotValidYet,
      offer.voided
    ]);
    const { isConditionMet } = useCheckTokenGatedOffer({
      commitProxyAddress,
      offer
    });
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
    const isBosonExclusive = true;
    const [isDetailsOpen, setDetailsOpen] = useState<boolean>(true);
    const closeDetailsRef = useRef(true);
    return (
      <Widget>
        {isBosonExclusive &&
          forwardedRef?.current &&
          createPortal(
            <BosonExclusiveContainer>BOSON EXCLUSIVE</BosonExclusiveContainer>,
            forwardedRef?.current
          )}
        <div>
          <WidgetUpperGrid style={{ paddingBottom: "0.5rem" }}>
            <StyledPrice
              isExchange={false}
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
              tag="h3"
              convert
              withBosonStyles
              withAsterisk={isPreview && hasMultipleVariants}
            />
            {notCommittableOfferStatus ? (
              <span style={{ color: colors.orange, textAlign: "right" }}>
                {notCommittableOfferStatus}
              </span>
            ) : (
              <QuantityDisplay
                quantityInitial={quantityInitial}
                quantity={quantity}
              />
            )}
          </WidgetUpperGrid>
        </div>
        {isNotCommittableOffer && isBuyerInsufficientFunds && (
          <Grid marginBottom="1rem">
            <Button
              size="regular"
              variant="accentInverted"
              withBosonStyle
              style={{
                width: "100%"
              }}
            >
              <a
                style={{ all: "inherit", fontWeight: "600" }}
                target="__blank"
                href={`https://bosonapp.io/#/swap?${new URLSearchParams({
                  [swapQueryParameters.outputCurrency]:
                    offer.exchangeToken.address,
                  [swapQueryParameters.exactAmount]: minNeededBalance
                    ? utils.formatUnits(
                        minNeededBalance || "",
                        offer.exchangeToken.decimals
                      )
                    : "",
                  [swapQueryParameters.exactField]: Field.OUTPUT.toLowerCase()
                }).toString()}`}
              >
                Buy or Swap {tokenOrCoinSymbol} <SwapArrows size={24} />
              </a>
            </Button>
          </Grid>
        )}
        {!isBuyerInsufficientFunds && (
          <CTAsGrid
            flexDirection="column"
            alignItems="center"
            margin="1.5rem 0"
          >
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
                  className="show-in-smaller-view"
                  $fontSize="0.8rem"
                  marginTop="0.25rem"
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
              <StyledRedeemButton
                coreSdkConfig={{
                  envName: protocolConfig.envName,
                  configId: protocolConfig.configId,
                  web3Provider: signer?.provider as Provider,
                  metaTx: protocolConfig.metaTx
                }}
                disabled
                withBosonStyle
                exchangeId="0"
                extraInfo="Step 2/2"
                variant="primaryFill"
              />
            </CommitWrapper>
            <Typography
              className="show-in-larger-view"
              $fontSize="0.8rem"
              marginTop="0.25rem"
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
          </CTAsGrid>
        )}
        {offer.condition && (
          <DetailsSummary
            summaryText="Token Gated Offer"
            icon={<Lock size={16} />}
            onSetOpen={(open) => {
              if (open && closeDetailsRef.current) {
                setDetailsOpen(false);
                closeDetailsRef.current = false;
              }
            }}
          >
            <TokenGatedList
              coreSDK={coreSDK}
              offer={offer}
              commitProxyAddress={commitProxyAddress}
              openseaLinkToOriginalMainnetCollection={
                openseaLinkToOriginalMainnetCollection
              }
              isConditionMet={isConditionMet}
            />
          </DetailsSummary>
        )}
        <DetailsSummary
          summaryText="Phygital Product"
          icon={<Cube size={16} />}
          onSetOpen={(open) => {
            if (open && closeDetailsRef.current) {
              setDetailsOpen(false);
              closeDetailsRef.current = false;
            }
          }}
        >
          <Grid flexDirection="column" alignItems="flex-start" gap="1rem">
            <Typography>
              This is what you'll get when you purchase this product.
            </Typography>
            <Grid flexDirection="column" alignItems="flex-start">
              <Typography>
                <b>This product includes:</b>
              </Typography>
            </Grid>
          </Grid>
        </DetailsSummary>
        <DetailsSummary
          summaryText="Details"
          initiallyOpen
          isOpen={isDetailsOpen}
          onSetOpen={(open) => {
            setDetailsOpen(open);
          }}
        >
          <DetailTable
            align={false}
            noBorder
            data={OFFER_DETAIL_DATA}
            inheritColor={false}
          />
        </DetailsSummary>
        <Grid
          justifyContent="center"
          alignItems="center"
          marginTop="12px"
          marginBottom="12px"
        >
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              gap: "0.1rem",
              alignItems: "center"
            }}
            onClick={onPurchaseOverview}
          >
            <CommitAndRedeemButton>How it works?</CommitAndRedeemButton>
            <Info color={colors.secondary} size={24} />
          </div>
        </Grid>
        {showBosonLogo && (
          <>
            <Break />
            <Grid justifyContent="center" alignItems="center">
              <BlackLogo />
            </Grid>
          </>
        )}
      </Widget>
    );
  }
);

export default function DetailViewWithPortal(props: IDetailWidget) {
  const portalRef = useRef<ElementRef<"div">>(null);

  return (
    <Grid flexDirection="column">
      <div
        ref={portalRef}
        style={{ width: "100%", height: "3rem", position: "relative" }}
      />
      <DetailView {...props} />
    </Grid>
  );
}
