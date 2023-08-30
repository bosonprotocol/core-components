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
import { useConfigContext } from "../../../../config/ConfigContext";
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
import { useEthersSigner } from "../../../../../hooks/ethers/useEthersSigner";
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
  setIsLoading: setLoading
}: ConfirmationProps) {
  const { envName, configId } = useEnvContext();
  const { redeemCallbackUrl, redeemCallbackHeaders } = useConfigContext();
  const coreSDK = useCoreSDKWithContext();
  const redeemRef = useRef<HTMLDivElement | null>(null);
  const { bosonXmtp } = useChatContext();
  const [chatError, setChatError] = useState<Error | null>(null);
  const [redeemError, setRedeemError] = useState<Error | null>(null);
  const { chatInitializationStatus } = useChatStatus();
  const showSuccessInitialization =
    chatInitializationStatus === "INITIALIZED" &&
    bosonXmtp &&
    !redeemCallbackUrl;
  const isInitializationValid =
    !!bosonXmtp &&
    ["INITIALIZED", "ALREADY_INITIALIZED"].includes(chatInitializationStatus);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const signer = useEthersSigner();
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
  const callRedeemCallback = async () => {
    if (!redeemCallbackUrl) {
      throw new Error(
        "[callredeemCallbackUrl] redeemCallbackUrl is not defined"
      );
    }
    // add wallet signature in the message (must be verifiable by the backend)
    const message = {
      deliveryDetails: values,
      exchangeId,
      offerId,
      buyerId,
      sellerId,
      sellerAddress,
      buyerAddress: await signer?.getAddress()
    };
    const signature = signer
      ? await signer.signMessage(JSON.stringify(message))
      : undefined;
    await fetch(redeemCallbackUrl, {
      method: "POST",
      body: JSON.stringify({
        message,
        signature
      }),
      headers: {
        "content-type": "application/json;charset=UTF-8",
        ...redeemCallbackHeaders
      }
    });
  };
  const handleRedeem = async () => {
    try {
      if (redeemCallbackUrl) {
        await callRedeemCallback();
      } else {
        await sendDeliveryDetailsToChat();
      }
      setChatError(null);
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
          buyerAddress: await signer?.getAddress()
        }
      });
      console.error(
        "Error while sending a message with the delivery details",
        error
      );
      setChatError(error as Error);
      throw error;
    }
  };

  const sendDeliveryDetailsToChat = async () => {
    const value = `DELIVERY ADDRESS:

${FormModel.formFields.name.placeholder}: ${nameField.value}
${FormModel.formFields.streetNameAndNumber.placeholder}: ${streetNameAndNumberField.value}
${FormModel.formFields.city.placeholder}: ${cityField.value}
${FormModel.formFields.state.placeholder}: ${stateField.value}
${FormModel.formFields.zip.placeholder}: ${zipField.value}
${FormModel.formFields.country.placeholder}: ${countryField.value}
${FormModel.formFields.email.placeholder}: ${emailField.value}
${FormModel.formFields.phone.placeholder}: ${phoneField.value}`;

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
          <ThemedButton theme="blankSecondary" onClick={() => onBackClick()}>
            Edit
          </ThemedButton>
        </Grid>
      </Grid>
      {!redeemCallbackUrl && <InitializeChatWithSuccess />}
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
      {(chatError || redeemError) && <SimpleError />}
      <Grid padding="2rem 0 0 0" justifyContent="space-between">
        <StyledRedeemButton
          type="button"
          onClick={() => handleRedeem()}
          disabled={isLoading || (!isInitializationValid && !redeemCallbackUrl)}
        >
          <Grid gap="0.5rem">
            Confirm address and redeem
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
            disabled={
              isLoading || (!isInitializationValid && !redeemCallbackUrl)
            }
            exchangeId={exchangeId}
            onError={(...args) => {
              const [error] = args;
              console.error("Error while redeeming", error);
              setRedeemError(error);
              setIsLoading(false);
              setLoading?.(false);
              onError?.(...args);
            }}
            onPendingSignature={(...args) => {
              setRedeemError(null);
              setIsLoading(true);
              setLoading?.(true);
              onPendingSignature?.(...args);
            }}
            onPendingTransaction={(...args) => {
              const [hash, isMetaTx] = args;
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
            }}
            onSuccess={async (...args) => {
              const [, { exchangeId }] = args;
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
              onSuccess?.(...args);
            }}
          >
            <Grid gap="0.5rem">
              Confirm address and redeem
              {isLoading && <Spinner size="20" />}
            </Grid>
          </RedeemButton>
        </div>
        <ThemedButton theme="outline" onClick={() => onBackClick()}>
          Back
        </ThemedButton>
      </Grid>
    </>
  );
}
