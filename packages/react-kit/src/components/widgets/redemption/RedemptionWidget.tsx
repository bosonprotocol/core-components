import { EnvironmentType } from "@bosonprotocol/core-sdk";
import React, { ComponentType, useCallback } from "react";
import { Button } from "../../buttons/Button";
import { EnvironmentProvider } from "../../environment/EnvironmentProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import ModalProvider from "../../modal/ModalProvider";
import { useModal } from "../../modal/useModal";
import GlobalStyle from "../../styles/GlobalStyle";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import ConnectButton from "../../wallet/ConnectButton";
import WalletConnectionProvider from "../../wallet/WalletConnectionProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ConfigProvider } from "../../config/ConfigProvider";
import { ConfigProviderProps } from "../../config/ConfigContext";
import { getIpfsHeaders } from "../../../hooks/ipfs/getIpfsHeaders";
import ChatProvider from "../../chat/ChatProvider/ChatProvider";
import { BosonFooter } from "../../modal/components/Redeem/BosonFooter";

function Redemption({ trigger: Trigger, ...rest }: Props) {
  const { showModal } = useModal();
  const onClick = useCallback(() => {
    showModal("REDEEM", {
      headerComponent: (
        <Grid>
          <Typography tag="h3">Redeem your item</Typography>
          <ConnectButton showChangeWallet />
        </Grid>
      ),
      footerComponent: <BosonFooter />
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
  Omit<
    IpfsProviderProps,
    "ipfsGateway" | "ipfsImageGateway" | "ipfsMetadataStorageHeaders"
  > &
  Partial<
    Pick<
      IpfsProviderProps,
      "ipfsGateway" | "ipfsImageGateway" | "ipfsMetadataStorageUrl"
    >
  > &
  Omit<ConfigProviderProps, "defaultCurrency"> & {
    envName: EnvironmentType;
    ipfsProjectId: string;
    ipfsProjectSecret: string;
    defaultCurrencyTicker: string;
    defaultCurrencySymbol: string;
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
  const ipfsMetadataStorageHeaders = getIpfsHeaders(
    props.ipfsProjectId,
    props.ipfsProjectSecret
  );
  return (
    <EnvironmentProvider envName={props.envName}>
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, prettier/prettier
        /* @ts-ignore */}
      <GlobalStyle />
      <ConfigProvider
        dateFormat={props.dateFormat || "YYYY/MM/DD"}
        shortDateFormat={props.shortDateFormat || "MMM DD, YYYY"}
        defaultCurrency={{
          ticker: props.defaultCurrencyTicker,
          symbol: props.defaultCurrencySymbol
        }}
        minimumDisputePeriodInDays={props.minimumDisputePeriodInDays || 30}
        minimumDisputeResolutionPeriodDays={
          props.minimumDisputeResolutionPeriodDays || 15
        }
        buyerSellerAgreementTemplate={
          props.buyerSellerAgreementTemplate ||
          "ipfs://QmS6SUVL1mhRq9wyNho914vcHwj3gC491vq7wtdoe34SUz"
        }
        licenseTemplate={
          props.licenseTemplate ||
          "ipfs://QmUxAXqM6smDYj7TvS9oDe5kRoAVmkqcyWCKEeNsD6JA97"
        }
        contactSellerForExchangeUrl={props.contactSellerForExchangeUrl}
        commitProxyAddress={props.commitProxyAddress}
        enableCurationLists={props.enableCurationLists}
        offerCurationList={props.offerCurationList}
        openseaLinkToOriginalMainnetCollection={
          props.openseaLinkToOriginalMainnetCollection
        }
        sellerCurationList={props.sellerCurationList}
        withOwnProducts={props.withOwnProducts}
      >
        <QueryClientProvider client={queryClient}>
          <WalletConnectionProvider envName={props.envName}>
            <ChatProvider>
              <IpfsProvider
                ipfsMetadataStorageUrl={props.ipfsMetadataStorageUrl}
                ipfsMetadataStorageHeaders={ipfsMetadataStorageHeaders}
                ipfsGateway={ipfsGateWay}
                ipfsImageGateway={props.ipfsImageGateway || ipfsGateWay}
              >
                <ModalProvider>
                  <Redemption {...props} />
                </ModalProvider>
              </IpfsProvider>
            </ChatProvider>
          </WalletConnectionProvider>
        </QueryClientProvider>
      </ConfigProvider>
    </EnvironmentProvider>
  );
}
