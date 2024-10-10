import { styled } from "styled-components";
import { ConnectRoblox } from "./components/ConnectRoblox";
import React from "react";
import { Grid } from "../../ui/Grid";
import { ProductsRoblox } from "./components/ProductsRoblox";

const Wrapper = styled(Grid)``;

export type RobloxWidgetProps = {
  connectRoblox: Parameters<typeof ConnectRoblox>[0];
};
export const RobloxWidget = ({ connectRoblox }: RobloxWidgetProps) => {
  return (
    <Wrapper
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="3rem"
    >
      <ConnectRoblox {...connectRoblox} />
      <ProductsRoblox />
    </Wrapper>
  );
};
