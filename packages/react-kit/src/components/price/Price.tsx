import React, { useState } from "react";
import styled from "styled-components";
import { useDisplayFloatWithConfig } from "../../lib/price/prices";
import { breakpoint } from "../../lib/ui/breakpoint";
import {
  Currencies,
  CurrencyDisplay
} from "../currencyDisplay/CurrencyDisplay";
import { Tooltip } from "../tooltip/Tooltip";

import { Grid } from "../ui/Grid";
import { Typography } from "../ui/Typography";
import ConvertedPrice from "./ConvertedPrice";

import { useConvertedPrice } from "./useConvertedPrice";

const Root = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  width: inherit;
  h3,
  h4 {
    padding-left: 2.5rem;
    ${breakpoint.m} {
      padding-left: 2rem;
    }
    position: relative;
  }

  *[data-currency] {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%) scale(0.75) rotate(-90deg);
    ${breakpoint.m} {
      transform: translate(-0.375rem, -50%) scale(0.75) rotate(-90deg);
    }
  }
  svg {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%) scale(1.25);
    ${breakpoint.m} {
      transform: translate(0, -50%) scale(1.5);
    }
  }
`;

interface IProps {
  value: string;
  decimals: string;
  currencySymbol: string;
  convert?: boolean;
  isExchange?: boolean;
  tag?: keyof JSX.IntrinsicElements;
  withAsterisk?: boolean;
}

export default function Price({
  value,
  decimals,
  currencySymbol,
  convert = false,
  isExchange = false,
  tag = "h4",
  withAsterisk,
  ...rest
}: IProps) {
  const [isSymbolShown] = useState<boolean>(false); // TODO: remove once CSS :has is supported
  const price = useConvertedPrice({
    value,
    decimals,
    symbol: currencySymbol
  });
  const displayFloat = useDisplayFloatWithConfig();

  return (
    <Root {...rest} data-testid="price">
      {price ? (
        <Grid
          alignItems="baseline"
          justifyContent="flex-start"
          flexDirection={isExchange ? "column" : "row"}
          flexWrap="wrap"
          data-testid="price-grid"
        >
          <Typography
            tag={tag}
            style={{
              fontWeight: "600",
              letterSpacing: "-1px",
              margin: "0",
              wordBreak: "break-word"
            }}
            data-icon-price
            {...(isSymbolShown && { "data-with-symbol": true })}
          >
            <Tooltip content={currencySymbol} wrap={false}>
              <CurrencyDisplay
                currency={currencySymbol as Currencies}
                height={18}
              />
            </Tooltip>
            {displayFloat(price.price)}
            {withAsterisk && <div>*</div>}
          </Typography>
          {convert && price?.currency && (
            <ConvertedPrice price={price} isExchange={isExchange} />
          )}
        </Grid>
      ) : (
        "-"
      )}
    </Root>
  );
}
