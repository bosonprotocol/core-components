import {
  MessageType,
  version
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { subgraph } from "@bosonprotocol/core-sdk";
import { Provider } from "@bosonprotocol/ethers-sdk";
import * as Sentry from "@sentry/browser";
import { utils } from "ethers";
import { useField } from "formik";
import { Warning } from "phosphor-react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useSigner } from "wagmi";
import { useCoreSDKWithContext } from "../../../../../hooks/useCoreSdkWithContext";
import { poll } from "../../../../../lib/promises/promises";

import { theme } from "../../../../../theme";
import { useChatContext } from "../../../../chat/ChatProvider/ChatContext";
import InitializeChatWithSuccess from "../../../../chat/InitializeChatWithSuccess";
import { useChatStatus } from "../../../../chat/useChatStatus";
import { RedeemButton } from "../../../../cta/exchange/RedeemButton";
import { useEnvContext } from "../../../../environment/EnvironmentContext";
import SimpleError from "../../../../error/SimpleError";
import SuccessTransactionToast from "../../../../toasts/SuccessTransactionToast";
import Grid from "../../../../ui/Grid";
import { Spinner } from "../../../../ui/loading/Spinner";
import ThemedButton from "../../../../ui/ThemedButton";
import Typography from "../../../../ui/Typography";
import { useModal } from "../../../useModal";
import { FormModel } from "../RedeemModalFormModel";
const colors = theme.colors.light;

const StyledGrid = styled(Grid)`
  background-color: ${colors.lightGrey};
`;

const StyledRedeemButton = styled(ThemedButton)``;

interface Props {
  exchangeId: string;
  offerName: string;
  buyerId: string;
  sellerId: string;
  sellerAddress: string;
  onBackClick: () => void;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}

export default function Confirmation({
  onBackClick,
  exchangeId,
  offerName,
  buyerId,
  sellerId,
  sellerAddress,
  onSuccess,
  setIsLoading: setLoading
}: Props) {
  const { envName } = useEnvContext();
  const coreSDK = useCoreSDKWithContext();
  const redeemRef = useRef<HTMLDivElement | null>(null);
  // const addPendingTransaction = useAddPendingTransaction(); // TODO: check
  const { bosonXmtp } = useChatContext();
  const [chatError, setChatError] = useState<Error | null>(null);
  const [redeemError, setRedeemError] = useState<Error | null>(null);
  const { chatInitializationStatus } = useChatStatus();
  const showSuccessInitialization =
    chatInitializationStatus === "INITIALIZED" && bosonXmtp;
  const isInitializationValid =
    !!bosonXmtp &&
    ["INITIALIZED", "ALREADY_INITIALIZED"].includes(chatInitializationStatus);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: signer } = useSigner();
  const [nameField] = useField(FormModel.formFields.name.name);
  const [streetNameAndNumberField] = useField(
    FormModel.formFields.streetNameAndNumber.name
  );
  const [cityField] = useField(FormModel.formFields.city.name);
  const [stateField] = useField(FormModel.formFields.state.name);
  const [zipField] = useField(FormModel.formFields.zip.name);
  const [countryField] = useField(FormModel.formFields.country.name);
  const [emailField] = useField(FormModel.formFields.email.name);
  const [phoneField] = useField(FormModel.formFields.phone.name);
  const handleRedeem = async () => {
    try {
      await sendDeliveryDetailsToChat();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const child = redeemRef.current!.children[0] ?? null;
      if (child) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        child.click();
      }
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          action: "redeem",
          location: "redeem-modal",
          exchangeId
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
    setChatError(null);
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
      <InitializeChatWithSuccess />
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
          disabled={isLoading || !isInitializationValid}
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
            disabled={isLoading || !isInitializationValid}
            exchangeId={exchangeId}
            envName={envName}
            onError={(error) => {
              console.error("Error while redeeming", error);
              setRedeemError(error);
              setIsLoading(false);
              setLoading?.(false);
              // const hasUserRejectedTx =
              //   "code" in error &&
              //   (error as unknown as { code: string }).code ===
              //     "ACTION_REJECTED";
              // if (hasUserRejectedTx) {
              //   showModal("CONFIRMATION_FAILED");
              // }
            }}
            onPendingSignature={async () => {
              setRedeemError(null);
              setIsLoading(true);
              setLoading?.(true);
              // showModal("WAITING_FOR_CONFIRMATION");
            }}
            onPendingTransaction={(hash, isMetaTx) => {
              // showModal("TRANSACTION_SUBMITTED", {
              //   action: "Redeem",
              //   txHash: hash
              // });
              // TODO: check
              // addPendingTransaction({
              //   type: subgraph.EventType.VoucherRedeemed,
              //   hash,
              //   isMetaTx,
              //   accountType: "Buyer",
              //   exchange: {
              //     id: exchangeId,
              //     offer: {
              //       id: offerId
              //     }
              //   }
              // });
            }}
            onSuccess={async (_, { exchangeId }) => {
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
              onSuccess?.();
            }}
            web3Provider={signer?.provider as Provider}
            metaTx={coreSDK.metaTxConfig}
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
