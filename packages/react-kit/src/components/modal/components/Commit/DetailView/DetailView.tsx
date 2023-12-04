import * as Sentry from "@sentry/browser";
import { offers, subgraph } from "@bosonprotocol/core-sdk";
import dayjs from "dayjs";
import { BigNumberish, ethers, providers } from "ethers";
import {
  ArrowSquareOut,
  CircleWavyQuestion,
  Info,
  Spinner,
  WarningCircle
} from "phosphor-react";
import toast from "react-hot-toast";
import React, { useCallback, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import {
  useSigner,
  useAccount
} from "../../../../../hooks/connection/connection";
import useCheckTokenGatedOffer from "../../../../../hooks/tokenGated/useCheckTokenGatedOffer";
import { useBreakpoints } from "../../../../../hooks/useBreakpoints";
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
import DetailTopRightLabel from "./DetailTopRightLabel";
import { QuantityDisplay } from "./QuantityDisplay";
import TokenGated from "../../common/detail/TokenGated";
import Price from "../../../../price/Price";
import { Offer } from "../../../../../types/offer";
import { useBalance } from "wagmi";
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
import VariationSelects from "../../common/VariationSelects";
import { VariantV1 } from "../../../../../types/variants";

const colors = theme.colors.light;

const ResponsiveVariationSelects = styled(VariationSelects)`
  container-type: inline-size;
  [data-grid] {
    flex-direction: column;
    @container (width > 300px) {
      flex-direction: row;
    }
  }
`;
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
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
        `};

  > button {
    width: 100%;
    pointer-events: ${({ $pointerEvents }) => $pointerEvents};
  }
`;

const CommitWrapper = styled(Grid)`
  flex-direction: column;
  row-gap: 0.5rem;
  column-gap: 1rem;
  align-items: flex-start;
  justify-content: flex-start;
  width: auto;
  @container (width > 400px) {
    flex-direction: row;
    ${CommitButtonWrapper} {
      max-width: 16.875rem;
    }
  }
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

  const { deposit, formatted } = calcPercentage(offer, "buyerCancelPenalty");
  const { deposit: sellerDeposit, formatted: sellerFormatted } = calcPercentage(
    offer,
    "sellerDeposit"
  );

  const exchangePolicyLabel = (
    (offer.metadata as subgraph.ProductV1MetadataEntity)?.exchangePolicy
      ?.label || "Unspecified"
  ).replace("fairExchangePolicy", "Fair Exchange Policy");

  // if offer is in creation, offer.id does not exist
  const handleShowExchangePolicy = () => {
    // const offerData = offer.id ? undefined : offer;
    // showModal(modalTypes.EXCHANGE_POLICY_DETAILS, {
    //   title: "Exchange Policy Details",
    //   offerId: offer.id,
    //   offerData
    // });
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
          {sellerFormatted} {offer.exchangeToken.symbol}
          {sellerDeposit !== "0" ? <small>({sellerDeposit}%)</small> : ""}
        </Typography>
      )
    },
    {
      name: "Buyer cancel. pen.",
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
          {formatted} {offer.exchangeToken.symbol}
          {deposit !== "0" ? <small>({deposit}%)</small> : ""}
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
          <p>
            {exchangePolicyLabel + " "}
            <ArrowSquareOut
              size={20}
              onClick={() => handleShowExchangePolicy()}
              style={{ cursor: "pointer" }}
            />
          </p>
        ) : (
          <p style={{ color: colors.orange }}>
            <WarningCircle size={20}></WarningCircle> Non-standard{" "}
            <ArrowSquareOut
              size={20}
              onClick={() => handleShowExchangePolicy()}
              style={{ cursor: "pointer" }}
            />
          </p>
        )
      ) : (
        <p style={{ color: "purple" }}>
          <CircleWavyQuestion size={20}></CircleWavyQuestion> Unknown{" "}
          <ArrowSquareOut
            size={20}
            onClick={() => handleShowExchangePolicy()}
            style={{ cursor: "pointer" }}
          />
        </p>
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

interface IDetailWidget {
  selectedVariant: VariantV1;
  allVariants: VariantV1[];
  disableVariationsSelects?: boolean;
  name?: string;
  image?: string;
  hasSellerEnoughFunds: boolean;
  isPreview?: boolean;
  hasMultipleVariants?: boolean;
  onLicenseAgreementClick: () => void;
  onExchangePolicyClick: () => void;
  onCommit?: (exchangeId: string, txHash: string) => void;
  onPurchaseOverview: () => void;
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
}

const DetailView: React.FC<IDetailWidget> = ({
  selectedVariant,
  allVariants,
  disableVariationsSelects,
  name = "",
  image = "",
  hasSellerEnoughFunds,
  isPreview = false,
  hasMultipleVariants,
  onLicenseAgreementClick,
  onExchangePolicyClick,
  onPurchaseOverview,
  onCommit,
  exchangePolicyCheckResult
}) => {
  const { offer } = selectedVariant;
  const coreSDK = useCoreSDKWithContext();
  const [commitType, setCommitType] = useState<ActionName | undefined | null>(
    null
  );
  const { isLteXS } = useBreakpoints();
  const signer = useSigner();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showModal, hideModal, modalTypes } = useModal();
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
  const OFFER_DETAIL_DATA_MODAL = useMemo(
    () =>
      getOfferDetailData({
        config,
        offer,
        exchangePolicyCheckResult,
        displayFloat,
        onExchangePolicyClick
      }),
    [
      config,
      offer,
      exchangePolicyCheckResult,
      displayFloat,
      onExchangePolicyClick
    ]
  );
  const BASE_MODAL_DATA = useMemo(
    () => ({
      data: OFFER_DETAIL_DATA_MODAL,
      animationUrl: offer.metadata.animationUrl || "",
      image,
      name
    }),
    [OFFER_DETAIL_DATA_MODAL, image, name, offer.metadata.animationUrl]
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
        // showModal(modalTypes.DETAIL_WIDGET, {
        //   title: "You have successfully committed!",
        //   message: "You now own the rNFT",
        //   type: "SUCCESS",
        //   id: exchangeId.toString(),
        //   state: "Committed",
        //   ...BASE_MODAL_DATA
        // });
        onCommit?.(exchangeId.toString(), receipt.transactionHash);
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
      // showModal(modalTypes.DETAIL_WIDGET, {
      //   title: "An error occurred",
      //   message: await extractUserFriendlyError(error, {
      //     txResponse,
      //     provider: signer?.provider
      //   }),
      //   type: "ERROR",
      //   state: "Committed",
      //   id: undefined,
      //   ...BASE_MODAL_DATA
      // });
    }
    setCommitType(null);
    // removePendingTransaction("offerId", offer.id);
  };
  const { data: dataBalance, isLoading: balanceLoading } = useBalance(
    offer.exchangeToken.address !== ethers.constants.AddressZero
      ? {
          address: address as `0x${string}`,
          token: offer.exchangeToken.address as `0x${string}`
        }
      : { address: address as `0x${string}` }
  );

  const isBuyerInsufficientFunds: boolean = useMemo(
    () => !!dataBalance?.value && dataBalance?.value < BigInt(offer.price),
    [dataBalance, offer.price]
  );

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
  const hasVariations = !!selectedVariant.variations?.length;
  return (
    <Widget>
      <div>
        <Typography tag="h3" style={{ flex: "1 1", marginTop: 0 }}>
          {offer.metadata.name}
        </Typography>
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

          {isNotCommittableOffer ? (
            <DetailTopRightLabel>
              {!isPreview && notCommittableOfferStatus}
            </DetailTopRightLabel>
          ) : (
            <QuantityDisplay
              quantityInitial={quantityInitial}
              quantity={quantity}
            />
          )}
        </WidgetUpperGrid>
        {hasVariations && (
          <div style={{ marginBottom: "1rem" }}>
            <ResponsiveVariationSelects
              selectedVariant={selectedVariant}
              variants={allVariants}
              disabled={allVariants.length < 2 || disableVariationsSelects}
            />
          </div>
        )}
      </div>
      <Break />
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
          <CommitAndRedeemButton>
            What is commit and redeem?
          </CommitAndRedeemButton>
          <Info color={colors.secondary} size={15} />
        </div>
      </Grid>
      {offer.condition && (
        <TokenGated
          coreSDK={coreSDK}
          offer={offer}
          commitProxyAddress={commitProxyAddress}
          openseaLinkToOriginalMainnetCollection={
            openseaLinkToOriginalMainnetCollection
          }
          isConditionMet={isConditionMet}
        />
      )}
      <div style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <DetailTable
          align
          noBorder
          data={OFFER_DETAIL_DATA}
          inheritColor={false}
        />
      </div>
      <Break />
      <CommitWrapper justifyContent="space-between" margin="1rem 0">
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
            <Button disabled>
              <Spinner />
            </Button>
          ) : (
            <>
              {/* {showCommitProxyButton ? (
                    <CommitProxyButton />
                  ) : ( */}
              <CommitButton
                coreSdkConfig={{
                  envName: protocolConfig.envName,
                  configId: protocolConfig.configId,
                  web3Provider: signer?.provider,
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
              />
              {/* )} */}
            </>
          )}
        </CommitButtonWrapper>
        <Typography
          $fontSize="0.8rem"
          style={{ display: "block", width: "100%" }}
        >
          By proceeding to Commit, I agree to the{" "}
          <span
            style={{
              color: colors.blue,
              fontSize: "inherit",
              cursor: "pointer"
            }}
            onClick={() => {
              onLicenseAgreementClick();
            }}
          >
            rNFT Terms
          </span>
          .
        </Typography>
      </CommitWrapper>
    </Widget>
  );
};

export default DetailView;
