import { EnvironmentType } from "@bosonprotocol/core-sdk";
import React, { ComponentType, useCallback } from "react";
import { Button } from "../../buttons/Button";
import { EnvironmentProvider } from "../../environment/EnvironmentProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import ModalProvider from "../../modal/ModalProvider";
import { useModal } from "../../modal/useModal";
import GlobalStyle from "../../styles/GlobalStyle";
import Grid from "../../ui/Grid";
import { ReactComponent } from "../../../assets/logo.svg";
import Typography from "../../ui/Typography";
import ConnectButton from "../../wallet/ConnectButton";
import WalletConnectionProvider from "../../wallet/WalletConnectionProvider";
import { QueryClient, QueryClientProvider } from "react-query";

function Redemption({ trigger: Trigger, ...rest }: Props) {
  const { showModal } = useModal();
  const onClick = useCallback(() => {
    showModal("REDEEM", {
      headerComponent: (
        <Grid>
          <Typography tag="h3">Redeem your item</Typography>
          <ConnectButton />
        </Grid>
      ),
      footerComponent: (
        <Grid justifyContent="center" padding="1.5rem 0">
          <ReactComponent height="24px" />
        </Grid>
      )
    });
  }, []);
  if (Trigger) {
    return <Trigger onClick={onClick} />;
  }
  return (
    <Button {...rest} onClick={onClick}>
      Redeem
    </Button>
  );
}

type Props = {
  trigger?: ComponentType<{ onClick: () => unknown }> | undefined;
  [x: string]: unknown;
};

type WidgetProps = Props &
  Omit<IpfsProviderProps, "ipfsGateway" | "ipfsImageGateway"> &
  Partial<Pick<IpfsProviderProps, "ipfsGateway" | "ipfsImageGateway">> & {
    envName: EnvironmentType;
  };
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});
export function RedemptionWidget(props: WidgetProps) {
  const ipfsGateWay = props.ipfsGateway || "https://ipfs.io/ipfs";
  return (
    <EnvironmentProvider envName={props.envName}>
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, prettier/prettier
        /* @ts-ignore */}
      <GlobalStyle />
      <WalletConnectionProvider envName={props.envName}>
        <QueryClientProvider client={queryClient}>
          <IpfsProvider
            ipfsMetadataStorageUrl={props.ipfsMetadataStorageUrl}
            ipfsMetadataStorageHeaders={props.ipfsMetadataStorageHeaders}
            ipfsGateway={ipfsGateWay}
            ipfsImageGateway={props.ipfsImageGateway || ipfsGateWay}
          >
            <ModalProvider>
              <Redemption {...props} />
            </ModalProvider>
          </IpfsProvider>
        </QueryClientProvider>
      </WalletConnectionProvider>
    </EnvironmentProvider>
  );
}
