import {
  MessageType,
  version
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { subgraph } from "@bosonprotocol/core-sdk";
import { Provider } from "@bosonprotocol/ethers-sdk";
import * as Sentry from "@sentry/browser";
import { utils } from "ethers";
import { useField, useFormikContext } from "formik";
import { Warning } from "phosphor-react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useAddPendingTransactionWithContext } from "../../../../../hooks/transactions/usePendingTransactionsWithContext";
import { useCoreSDKWithContext } from "../../../../../hooks/useCoreSdkWithContext";
import { poll } from "../../../../../lib/promises/promises";

import { theme } from "../../../../../theme";
import { useChatContext } from "../../../../chat/ChatProvider/ChatContext";
import InitializeChatWithSuccess from "../../../../chat/InitializeChatWithSuccess";
import { useChatStatus } from "../../../../chat/useChatStatus";
import {
  RedeemButton,
  IRedeemButton
} from "../../../../cta/exchange/RedeemButton";
import { useEnvContext } from "../../../../environment/EnvironmentContext";
import SimpleError from "../../../../error/SimpleError";
import SuccessTransactionToast from "../../../../toasts/SuccessTransactionToast";
import Grid from "../../../../ui/Grid";
import { Spinner } from "../../../../ui/loading/Spinner";
import ThemedButton from "../../../../ui/ThemedButton";
import Typography from "../../../../ui/Typography";
import { FormModel, FormType } from "../RedeemFormModel";
import {
  useAccount,
  useIsConnectedToWrongChain,
  useSigner
} from "../../../../../hooks/connection/connection";
import {
  DeliveryInfoCallbackResponse,
  DeliveryInfoMessage,
  useRedemptionCallbacks
} from "../../../../../hooks/callbacks/useRedemptionCallbacks";
import { NonModalProps } from "../../../nonModal/NonModal";
import {
  RedemptionWidgetAction,
  useRedemptionContext
} from "../../../../widgets/redemption/provider/RedemptionContext";
import { extractUserFriendlyError } from "../../../../../lib/errors/transactions";
const colors = theme.colors.light;

const StyledGrid = styled(Grid)`
  background-color: ${colors.lightGrey};
`;

const StyledRedeemButton = styled(ThemedButton)``;

export interface ConfirmationProps
  extends Pick<
    IRedeemButton,
    "onSuccess" | "onError" | "onPendingSignature" | "onPendingTransaction"
  > {
  exchangeId: string;
  offerId: string;
  offerName: string;
  buyerId: string;
  sellerId: string;
  sellerAddress: string;
  onBackClick: () => void;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  hideModal?: NonModalProps["hideModal"];
}

export default function Confirmation({
  onBackClick,
  exchangeId,
  offerId,
  offerName,
  buyerId,
  sellerId,
  sellerAddress,
  onSuccess,
  onError,
  onPendingSignature,
  onPendingTransaction,
  setIsLoading: setLoading,
  hideModal
}: ConfirmationProps) {
  const { envName, configId } = useEnvContext();
  const {
    widgetAction,
    setWidgetAction,
    deliveryInfoHandler,
    redemptionSubmittedHandler,
    redemptionConfirmedHandler,
    sendDeliveryInfoThroughXMTP
  } = useRedemptionContext();
  const { postDeliveryInfo, postRedemptionConfirmed, postRedemptionSubmitted } =
    useRedemptionCallbacks();
  const isInWrongChain = useIsConnectedToWrongChain();
  const coreSDK = useCoreSDKWithContext();
  const redeemRef = useRef<HTMLDivElement | null>(null);
  const { bosonXmtp } = useChatContext();
  const [redemptionInfoError, setRedemptionInfoError] = useState<Error | null>(
    null
  );
  const [redeemError, setRedeemError] = useState<Error | null>(null);
  const [redemptionInfoAccepted, setRedemptionInfoAccepted] = useState<boolean>(
    widgetAction === RedemptionWidgetAction.CONFIRM_REDEEM
  );
  const [resumeRedemption, setResumeRedemption] = useState<boolean>(
    widgetAction === RedemptionWidgetAction.CONFIRM_REDEEM
  );
  const { chatInitializationStatus } = useChatStatus();
  const showSuccessInitialization =
    chatInitializationStatus === "INITIALIZED" &&
    bosonXmtp &&
    sendDeliveryInfoThroughXMTP;
  const isInitializationValid =
    !!bosonXmtp &&
    ["INITIALIZED", "ALREADY_INITIALIZED"].includes(chatInitializationStatus);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTxPending, setIsTxPending] = useState<boolean>(false);
  const signer = useSigner();
  const { address } = useAccount();
  const { values } = useFormikContext<FormType>();
  const [nameField] = useField(FormModel.formFields.name.name);
  const [streetNameAndNumberField] = useField(
    FormModel.formFields.streetNameAndNumber.name
  );
  const addPendingTransaction = useAddPendingTransactionWithContext();
  const [cityField] = useField(FormModel.formFields.city.name);
  const [stateField] = useField(FormModel.formFields.state.name);
  const [zipField] = useField(FormModel.formFields.zip.name);
  const [countryField] = useField(FormModel.formFields.country.name);
  const [emailField] = useField(FormModel.formFields.email.name);
  const [phoneField] = useField(FormModel.formFields.phone.name);
  const redemptionInfo = {
    exchangeId,
    offerId,
    buyerId,
    sellerId,
    sellerAddress,
    buyerAddress: address || ""
  };
  const handleConfirmRedeem = () => {
    try {
      const child =
        (redeemRef.current?.firstChild as HTMLButtonElement) ?? null;
      if (child) {
        child.click();
      }
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          action: "redeem",
          location: "redeem-modal",
          exchangeId,
          buyerId,
          sellerId,
          sellerAddress,
          buyerAddress: address
        }
      });
      console.error("Error while confirming Redeem", error);
    }
  };
  const handleSendRedemptionInfo: (
    handler: (
      message: DeliveryInfoMessage,
      signature?: string
    ) => Promise<DeliveryInfoCallbackResponse>,
    message: DeliveryInfoMessage,
    signature?: string
  ) => Promise<{
    resume: boolean;
  }> = async (handler, message, signature) => {
    let resume = true;
    try {
      setIsLoading(true);
      if (handler) {
        const response = await handler(message, signature);
        if (response) {
          if (!response.accepted) {
            setRedemptionInfoError(
              new Error(
                `Redemption information has not been accepted: ${response.reason}`
              )
            );
            setRedemptionInfoAccepted(false);
            setResumeRedemption(false);
            resume = false;
            setIsLoading(false); // to allow trying with another delivery info
          } else if (!response.resume) {
            setRedemptionInfoError(
              new Error(`Redemption Widget may be closed`)
            );
            setRedemptionInfoAccepted(true);
            setResumeRedemption(false);
            resume = false;
            hideModal?.();
          } else {
            setRedemptionInfoError(null);
            setRedemptionInfoAccepted(true);
            setResumeRedemption(true);
          }
        } else {
          throw new Error("Error while calling deliveryInfo handler"); // will be catch just below
        }
      }
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          action: "redeem",
          location: "redeem-modal",
          exchangeId,
          buyerId,
          sellerId,
          sellerAddress,
          buyerAddress: address
        }
      });
      console.error("Error while calling deliveryInfo handler", error);
      setRedemptionInfoError(error as Error);
      resume = false;
      setIsLoading(false);
    }
    return { resume };
  };
  const handleOnBackClick = () => {
    if (widgetAction === RedemptionWidgetAction.CONFIRM_REDEEM) {
      // As the redemption will be edited again, switch the widgetAction to REDEEM_FORM
      setWidgetAction(RedemptionWidgetAction.REDEEM_FORM);
    }
    onBackClick();
  };

  const sendDeliveryDetailsToChat = async (message: DeliveryInfoMessage) => {
    let resume = true;
    const accepted = true;
    let reason = "";
    try {
      const value = `DELIVERY ADDRESS:

${FormModel.formFields.name.placeholder}: ${message.deliveryDetails.name}
${FormModel.formFields.streetNameAndNumber.placeholder}: ${message.deliveryDetails.streetNameAndNumber}
${FormModel.formFields.city.placeholder}: ${message.deliveryDetails.city}
${FormModel.formFields.state.placeholder}: ${message.deliveryDetails.state}
${FormModel.formFields.zip.placeholder}: ${message.deliveryDetails.zip}
${FormModel.formFields.country.placeholder}: ${message.deliveryDetails.country}
${FormModel.formFields.email.placeholder}: ${message.deliveryDetails.email}
${FormModel.formFields.phone.placeholder}: ${message.deliveryDetails.phone}`;

      const newMessage = {
        threadId: {
          exchangeId,
          buyerId,
          sellerId
        },
        content: {
          value
        },
        contentType: MessageType.String,
        version
      } as const;
      const destinationAddress = utils.getAddress(sellerAddress);
      await bosonXmtp?.encodeAndSendMessage(newMessage, destinationAddress);
    } catch (e) {
      resume = false;
      reason = e instanceof Error ? e.message : String(e);
    }

    return {
      accepted,
      resume,
      reason
    };
  };

  return (
    <>
      <Typography
        fontWeight="600"
        $fontSize="1rem"
        lineHeight="1.5rem"
        margin="1rem 0"
      >
        Confirm your address
      </Typography>
      <Grid
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Grid flexDirection="column" alignItems="flex-start">
          <div>{nameField.value}</div>
          <div>{streetNameAndNumberField.value}</div>
          <div>{cityField.value}</div>
          <div>{stateField.value}</div>
          <div>{zipField.value}</div>
          <div>{countryField.value}</div>
          <div>{emailField.value}</div>
          <div>{phoneField.value}</div>
        </Grid>
        <Grid flexDirection="row" flexBasis="0">
          <ThemedButton
            theme="blankSecondary"
            onClick={handleOnBackClick}
            disabled={
              isLoading || (redemptionInfoAccepted && !resumeRedemption)
            }
          >
            Edit
          </ThemedButton>
        </Grid>
      </Grid>
      {sendDeliveryInfoThroughXMTP && <InitializeChatWithSuccess />}
      {showSuccessInitialization && (
        <div>
          <StyledGrid
            justifyContent="flex-start"
            gap="0.5rem"
            margin="1.5rem 0"
            padding="1.5rem"
          >
            <Warning color={colors.darkOrange} size={16} />
            <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
              rNFTs are burned upon redemption to prevent double spend
            </Typography>
          </StyledGrid>
        </div>
      )}
      {redemptionInfoError && (
        <SimpleError errorMessage={redemptionInfoError.message} />
      )}
      {redeemError && <SimpleError errorMessage={redeemError.message} />}
      <Grid padding="2rem 0 0 0" justifyContent="space-between">
        <StyledRedeemButton
          type="button"
          onClick={async () => {
            let resume = true;
            let signature;
            const message = {
              deliveryDetails: values,
              ...redemptionInfo
            };
            if (!redemptionInfoAccepted) {
              setIsLoading(true);
              setRedemptionInfoError(null);
              if (sendDeliveryInfoThroughXMTP) {
                ({ resume } = await handleSendRedemptionInfo(
                  sendDeliveryDetailsToChat,
                  message
                ));
              }
              if (resume && deliveryInfoHandler) {
                if (!signature) {
                  // add wallet signature in the message (must be verifiable by the receiver)
                  signature = signer
                    ? await signer.signMessage(JSON.stringify(message))
                    : undefined;
                }
                ({ resume } = await handleSendRedemptionInfo(
                  deliveryInfoHandler,
                  message,
                  signature
                ));
              }
              if (resume && postDeliveryInfo) {
                if (!signature) {
                  // add wallet signature in the message (must be verifiable by the receiver)
                  signature = signer
                    ? await signer.signMessage(JSON.stringify(message))
                    : undefined;
                }
                ({ resume } = await handleSendRedemptionInfo(
                  postDeliveryInfo,
                  message,
                  signature
                ));
              }
              setIsLoading(false);
            }
            if (resume) {
              handleConfirmRedeem();
            }
          }}
          disabled={
            isLoading ||
            (!isInitializationValid && sendDeliveryInfoThroughXMTP) ||
            isInWrongChain ||
            (redemptionInfoAccepted && !resumeRedemption)
          }
        >
          <Grid gap="0.5rem">
            {postDeliveryInfo
              ? redemptionInfoAccepted
                ? "Confirm redemption"
                : "Confirm delivery information"
              : "Confirm address and redeem"}
            {isLoading && <Spinner size="20" />}
          </Grid>
        </StyledRedeemButton>
        <div
          style={{ display: "none" }}
          ref={(ref) => {
            redeemRef.current = ref;
          }}
        >
          <RedeemButton
            coreSdkConfig={{
              envName: envName,
              configId: configId,
              web3Provider: signer?.provider as Provider,
              metaTx: coreSDK.metaTxConfig
            }}
            exchangeId={exchangeId}
            onError={async (...args) => {
              const [error, context] = args;
              const errorMessage = await extractUserFriendlyError(error, {
                txResponse: context.txResponse,
                provider: signer?.provider
              });
              console.error("Error while redeeming", error, errorMessage);
              error.message = errorMessage;
              const message = {
                redemptionInfo,
                isError: true,
                error: { ...error }
              };
              setRedeemError(error);
              setIsLoading(false);
              setLoading?.(false);
              // call postRedemptionSubmitted if error before the transaction is submitted OR postRedemptionConfirmed if error after
              if (isTxPending) {
                try {
                  await redemptionConfirmedHandler?.(message);
                } catch (e) {
                  console.error(e);
                }
                try {
                  await postRedemptionConfirmed?.(message);
                } catch (e) {
                  console.error(e);
                }
              } else {
                try {
                  await redemptionSubmittedHandler?.(message);
                } catch (e) {
                  console.error(e);
                }
                try {
                  await postRedemptionSubmitted?.(message);
                } catch (e) {
                  console.error(e);
                }
              }
              onError?.(...args);
            }}
            onPendingSignature={(...args) => {
              setRedeemError(null);
              setIsLoading(true);
              setLoading?.(true);
              onPendingSignature?.(...args);
            }}
            onPendingTransaction={async (...args) => {
              // call postRedemptionSubmitted with transaction details
              const [hash, isMetaTx] = args;
              const message = {
                redemptionInfo,
                isError: false,
                redeemTx: { hash }
              };
              onPendingTransaction?.(...args);
              addPendingTransaction({
                type: subgraph.EventType.VoucherRedeemed,
                hash,
                isMetaTx,
                accountType: "Buyer",
                exchange: {
                  id: exchangeId,
                  offer: {
                    id: offerId
                  }
                }
              });
              setIsTxPending(true);
              try {
                await redemptionSubmittedHandler?.(message);
              } catch (e) {
                console.error(e);
              }
              try {
                await postRedemptionSubmitted?.(message);
              } catch (e) {
                console.error(e);
              }
            }}
            onSuccess={async (...args) => {
              const [receipt, { exchangeId }] = args;
              const message = {
                redemptionInfo,
                isError: false,
                redeemTx: {
                  hash: receipt.transactionHash,
                  blockNumber: receipt.blockNumber
                }
              };
              let createdExchange: subgraph.ExchangeFieldsFragment;
              await poll(
                async () => {
                  createdExchange = await coreSDK.getExchangeById(exchangeId);
                  return createdExchange.redeemedDate;
                },
                (redeemedDate) => {
                  return !redeemedDate;
                },
                500
              );
              setIsLoading(false);
              setLoading?.(false);
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Redeemed exchange: ${offerName}`}
                />
              ));
              try {
                await redemptionConfirmedHandler?.(message);
              } catch (e) {
                console.error(e);
              }
              try {
                await postRedemptionConfirmed?.(message);
              } catch (e) {
                console.error(e);
              }
              onSuccess?.(...args);
            }}
          >
            <Grid gap="0.5rem">
              Confirm Redemption
              {isLoading && <Spinner size="20" />}
            </Grid>
          </RedeemButton>
        </div>
        <ThemedButton
          theme="outline"
          onClick={handleOnBackClick}
          disabled={isLoading || (redemptionInfoAccepted && !resumeRedemption)}
        >
          Back
        </ThemedButton>
      </Grid>
    </>
  );
}
