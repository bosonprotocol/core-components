import styled from "styled-components";
import { SpinnerCircular } from "spinners-react";

import { closeWidget } from "../closeWidget";
import { colors } from "../colors";
import { hooks } from "../connectors/metamask";
import { connectWallet } from "../connectWallet";
import { getConfig } from "../config";
import { useWalletChangeNotification } from "../useWalletChangeNotification";

import { ErrorModal } from "./modals/ErrorModal";
import { WalletConnection } from "./WalletConnection";
import { WidgetLayout, Props as WidgetLayoutProps } from "./WidgetLayout";

type Props = WidgetLayoutProps & {
  loadingStatus?: "loading" | "success" | "error";
  error?: Error;
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;

export function WidgetWrapper(props: Props) {
  const isActive = hooks.useIsActive();
  const account = hooks.useAccount();
  const connectedChainId = hooks.useChainId();
  const { chainId } = getConfig();

  useWalletChangeNotification(account);

  const isWalletConnectToCorrectChain =
    account && isActive && chainId !== connectedChainId;

  if (isWalletConnectToCorrectChain) {
    return (
      <WidgetLayout>
        <ErrorModal
          message={`Your wallet is connected to a wrong network. Please switch to a network with chain id: ${chainId}`}
          onClose={() => connectWallet(chainId)}
          buttonLabel="Switch network"
        />
      </WidgetLayout>
    );
  }

  if (props.loadingStatus === "error") {
    return (
      <WidgetLayout>
        <ErrorModal error={props.error} onClose={closeWidget} />
      </WidgetLayout>
    );
  }

  if (props.loadingStatus === "loading") {
    return (
      <WidgetLayout>
        <Center>
          <SpinnerCircular className="" size={80} color={colors.satinWhite} />
        </Center>
      </WidgetLayout>
    );
  }

  return (
    <WidgetLayout
      WalletConnection={
        <WalletConnection
          walletAddress={account}
          isActive={isActive}
          chainId={chainId}
        />
      }
      {...props}
    >
      {props.children}
    </WidgetLayout>
  );
}
