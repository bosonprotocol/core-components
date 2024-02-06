import React from "react";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../../../config/ConfigProvider";
import { IpfsProvider, IpfsProviderProps } from "../../../../ipfs/IpfsProvider";
import { WalletConnectionProviderProps } from "../../../../wallet/WalletConnectionProvider";
import { CommonWidgetTypes } from "../../../../widgets/types";
import { DetailViewWithProvider } from "../detail/DetailViewWithProvider";
import {
  OfferFullDescription,
  OfferFullDescriptionProps
} from "./OfferFullDescription";

export type ExternalOfferFullDescriptionProps = Omit<
  OfferFullDescriptionProps,
  "defaultSelectedTabId"
> & {
  providerProps: Omit<ConfigProviderProps, "children"> &
    Omit<WalletConnectionProviderProps, "children" | "envName"> &
    Omit<IpfsProviderProps, "children">;
  defaultSelectedOfferTabsIdTab?: OfferFullDescriptionProps["defaultSelectedTabId"];
} & CommonWidgetTypes;

export const ExternalOfferFullDescription: React.FC<
  ExternalOfferFullDescriptionProps
> = (props) => {
  return (
    <ConfigProvider {...props.providerProps}>
      <IpfsProvider {...props.providerProps}>
        <DetailViewWithProvider offer={props.offer}>
          <OfferFullDescription
            {...props}
            defaultSelectedTabId={props.defaultSelectedOfferTabsIdTab}
          />
        </DetailViewWithProvider>
      </IpfsProvider>
    </ConfigProvider>
  );
};
