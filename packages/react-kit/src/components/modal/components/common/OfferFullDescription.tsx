import React, { ReactNode, useMemo } from "react";
import { Offer } from "../../../../types/offer";
import { getOfferDetails } from "../../../../lib/offer/getOfferDetails";
import { theme } from "../../../../theme";
import Typography from "../../../ui/Typography";
import Grid from "../../../ui/Grid";
import DetailTable from "./detail/DetailTable";
import { Tabs } from "../../../ui/Tabs";
import { isTruthy } from "../../../../types/helpers";
import DetailSlider from "./detail/DetailSlider";
import { Content } from "../../nonModal/styles";

const colors = theme.colors.light;

interface OfferFullDescriptionProps {
  offer: Offer;
  children?: ReactNode;
}

export const OfferFullDescription: React.FC<OfferFullDescriptionProps> = ({
  offer,
  children
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
  return (
    <Tabs
      data={[
        {
          id: "physical-product-data",
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
                  />
                )}
              </>
            </Content>
          )
        },
        {
          id: "about-creator",
          title: "About the creator",
          content: (
            <Content>
              <Typography tag="h3">About the creator</Typography>
              <Typography tag="p" style={{ whiteSpace: "pre-wrap" }}>
                {artistDescription}
              </Typography>
            </Content>
          )
        },
        {
          id: "shipping-inventory",
          title: "Shipping & Inventory",
          content: (
            <Content>
              <Grid flexDirection="column" alignItems="flex-start">
                {children}
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
              </Grid>
            </Content>
          )
        }
      ]}
    />
  );
};
