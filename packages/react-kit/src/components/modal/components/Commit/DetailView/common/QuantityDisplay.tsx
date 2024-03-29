import React, { useMemo } from "react";
import { useBreakpoints } from "../../../../../../hooks/useBreakpoints";
import { isOfferHot } from "../../../../../../lib/offer/getOfferLabel";
import { theme } from "../../../../../../theme";
import { Grid } from "../../../../../ui/Grid";
import { Typography } from "../../../../../ui/Typography";
const colors = theme.colors.light;
interface IQuantityDisplay {
  quantityInitial: number;
  quantity: number;
}
export const QuantityDisplay: React.FC<IQuantityDisplay> = ({
  quantityInitial,
  quantity
}) => {
  const { isLteXS } = useBreakpoints();

  const isHotOffer = useMemo(
    () => isOfferHot(`${quantity}`, `${quantityInitial}`),
    [quantity, quantityInitial]
  );

  return (
    <Grid
      alignItems="center"
      justifyContent="flex-end"
      style={{ marginTop: isLteXS ? "-7rem" : "0" }}
    >
      <Typography tag="p" style={{ color: colors.orange, margin: 0 }}>
        {isHotOffer ? (
          <>
            {quantity === 0 && "No items available!"}
            {quantity > 0 &&
              `Only ${quantity} ${quantity === 1 ? "item" : "items"} left!`}
          </>
        ) : (
          <>
            {quantity}/{quantityInitial} remaining
          </>
        )}
      </Typography>
    </Grid>
  );
};
