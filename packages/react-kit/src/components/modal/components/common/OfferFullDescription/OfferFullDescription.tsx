import React, { useMemo } from "react";
import styled from "styled-components";
import { useIsPhygital } from "../../../../../hooks/offer/useIsPhygital";
import { getOfferDetails } from "../../../../../lib/offer/getOfferDetails";
import { theme } from "../../../../../theme";
import { Exchange } from "../../../../../types/exchange";
import { isTruthy } from "../../../../../types/helpers";
import { Offer } from "../../../../../types/offer";
import { DetailChart } from "../../../../detail/DetailChart";
import Grid from "../../../../ui/Grid";
import { Tabs, TabsProps } from "../../../../ui/Tabs";
import Typography from "../../../../ui/Typography";
import { Content } from "../../../nonModal/styles";
import DetailSlider from "../detail/DetailSlider";
import DetailTable from "../detail/DetailTable";
import DetailTransactions from "../detail/DetailTransactions";
import { OnClickBuyOrSwapHandler } from "../detail/types";
import { GeneralProductData } from "./GeneralProductData";
import { UseGetOfferDetailDataProps } from "../detail/useGetOfferDetailData";

const colors = theme.colors.light;
const SLIDER_OPTIONS = {
  type: "slider",
  startAt: 0,
  gap: 20,
  perView: 3
} as const;

const InventoryGraph = styled(DetailChart)`
  width: 100%;
  :last-child {
    min-height: 250px;
  }
`;
export type OfferFullDescriptionProps = OnClickBuyOrSwapHandler & {
  offer: Offer;
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
  offer,
  exchange,
  className,
  withFullViewportWidth,
  defaultSelectedTabId,
  onExchangePolicyClick,
  onClickBuyOrSwap
}) => {
  const {
    description,
    artistDescription,
    shippingInfo,
    animationUrl,
    images,
    offerImg
  } = getOfferDetails(offer);
  const allImages = useMemo(() => {
    return Array.from(new Set([offerImg || "", ...(images || [])])).filter(
      isTruthy
    );
  }, [offerImg, images]);
  const buyerAddress = exchange?.buyer.wallet;
  const isPhygital = useIsPhygital({ offer });
  return (
    <Tabs
      withFullViewportWidth={withFullViewportWidth}
      className={className}
      defaultSelectedTabId={defaultSelectedTabId}
      data={
        [
          {
            id: ids[0],
            title: "General Product data",
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
          } as const,
          {
            id: ids[1],
            title: "Physical Product data",
            content: (
              <Content>
                <Typography tag="h3">Physical Product data</Typography>
                <Typography
                  tag="p"
                  data-testid="description"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {description}
                </Typography>
                <Typography tag="h3">Physical Product images</Typography>
                <>
                  {(allImages.length > 0 || animationUrl) && (
                    <DetailSlider
                      animationUrl={animationUrl}
                      images={allImages}
                      arrowsAbove
                      sliderOptions={SLIDER_OPTIONS}
                    />
                  )}
                </>
              </Content>
            )
          } as const,
          ...(isPhygital
            ? ([
                {
                  id: ids[2],
                  title: "Digital Product data",
                  content: (
                    <Content>
                      <Typography tag="h3">Digital Product data</Typography>
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
            title: "Shipping & Inventory",
            content: (
              <Content>
                <Grid flexDirection="column" alignItems="flex-start">
                  {(shippingInfo.returnPeriodInDays !== undefined ||
                    !!shippingInfo.shippingTable.length) && (
                    <div>
                      <Typography tag="h3">Shipping information</Typography>
                      <Typography tag="p" style={{ color: colors.darkGrey }}>
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
                      title="Transaction History (this item)"
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
