import React, { useMemo } from "react";
import styled from "styled-components";
import { useIsPhygital } from "../../../../../hooks/offer/useIsPhygital";
import { getOfferDetails } from "../../../../../lib/offer/getOfferDetails";
import { Exchange } from "../../../../../types/exchange";
import { isTruthy } from "../../../../../types/helpers";
import { Offer } from "../../../../../types/offer";
import { DetailChart } from "../../../../detail/DetailChart";
import { Grid } from "../../../../ui/Grid";
import { Tabs, TabsProps } from "../../../../ui/Tabs";
import { Typography } from "../../../../ui/Typography";
import { Content } from "../../../nonModal/styles";
import DetailTable from "../detail/DetailTable";
import DetailTransactions from "../detail/DetailTransactions";
import { SlickSlider, initialSettings } from "../detail/SlickSlider";
import { OnClickBuyOrSwapHandler } from "../detail/types";
import { UseGetOfferDetailDataProps } from "../detail/useGetOfferDetailData";
import { GeneralProductData } from "./GeneralProductData";
import { DigitalProductData } from "./DigitalProductData";
import { PhysicalProductData } from "./PhysicalProductData";

const InventoryGraph = styled(DetailChart)`
  width: 100%;
  &:last-child {
    min-height: 250px;
  }
`;
export type OfferFullDescriptionProps = OnClickBuyOrSwapHandler & {
  imagesToShow?: number;
  offer: Offer;
  includeGeneralProductDataTab: boolean;
  exchange: Exchange | null;
  className?: string;
  defaultSelectedTabId?: typeof ids[number];
} & Pick<UseGetOfferDetailDataProps, "onExchangePolicyClick"> &
  Pick<TabsProps, "withFullViewportWidth">;

const ids = [
  "general-product-data",
  "physical-product-data",
  "phygital-product-data",
  "about-creator",
  "shipping-inventory"
] as const;

export const OfferFullDescription: React.FC<OfferFullDescriptionProps> = ({
  imagesToShow = 4,
  offer,
  exchange,
  className,
  withFullViewportWidth,
  includeGeneralProductDataTab,
  defaultSelectedTabId,
  onExchangePolicyClick,
  onClickBuyOrSwap
}) => {
  const { artistDescription, shippingInfo } = getOfferDetails(offer);
  const buyerAddress = exchange?.buyer.wallet;
  const isPhygital = useIsPhygital({ offer });
  return (
    <Tabs
      withFullViewportWidth={withFullViewportWidth}
      className={className}
      defaultSelectedTabId={defaultSelectedTabId}
      data={
        [
          ...(includeGeneralProductDataTab
            ? [
                {
                  id: ids[0],
                  title: "General product data",
                  content: (
                    <Content>
                      <GeneralProductData
                        offer={offer}
                        exchange={exchange}
                        onExchangePolicyClick={onExchangePolicyClick}
                        onClickBuyOrSwap={onClickBuyOrSwap}
                      />
                    </Content>
                  )
                } as const
              ]
            : []),
          {
            id: ids[1],
            title: "Physical product data",
            content: (
              <Content>
                <PhysicalProductData
                  offer={offer}
                  imagesToShow={imagesToShow}
                />
              </Content>
            )
          } as const,
          ...(isPhygital
            ? ([
                {
                  id: ids[2],
                  title: "Digital product data",
                  content: (
                    <Content>
                      <DigitalProductData
                        offer={offer}
                        imagesToShow={imagesToShow}
                      />
                    </Content>
                  )
                } as const
              ] as const)
            : []),
          {
            id: ids[3],
            title: "About the creator",
            content: (
              <Content>
                <Typography tag="h3">About the creator</Typography>
                <Typography tag="p" style={{ whiteSpace: "pre-wrap" }}>
                  {artistDescription}
                </Typography>
              </Content>
            )
          } as const,
          {
            id: ids[4],
            title: "Shipping & inventory",
            content: (
              <Content>
                <Grid flexDirection="column" alignItems="flex-start">
                  {(shippingInfo.returnPeriodInDays !== undefined ||
                    !!shippingInfo.shippingTable.length) && (
                    <div>
                      <Typography tag="h3">Shipping information</Typography>
                      <Typography tag="p">
                        Return period: {shippingInfo.returnPeriodInDays}{" "}
                        {shippingInfo.returnPeriodInDays === 1 ? "day" : "days"}
                      </Typography>
                      <DetailTable
                        data={shippingInfo.shippingTable}
                        inheritColor
                      />
                    </div>
                  )}
                  <InventoryGraph offer={offer} title="Inventory graph" />
                  {exchange && buyerAddress && (
                    <DetailTransactions
                      title="Transaction history (this item)"
                      exchange={exchange}
                      offer={offer}
                      buyerAddress={buyerAddress}
                    />
                  )}
                </Grid>
              </Content>
            )
          } as const
        ] as const
      }
    />
  );
};
