import { TextAlignLeft } from "phosphor-react";
import React from "react";
import styled from "styled-components";
import { theme } from "../../../../../../theme";
import { Exchange } from "../../../../../../types/exchange";
import SellerID from "../../../../../avatar/SellerID";
import Grid from "../../../../../ui/Grid";
import ThemedButton from "../../../../../ui/ThemedButton";
import Typography from "../../../../../ui/Typography";

const colors = theme.colors.light;

const Container = styled(Grid)`
  background: ${colors.white};
  padding: 1rem;
  [data-seller-id] {
    flex: 0 1;
  }
  [data-description] {
    flex: 1 1;
    padding: 0 !important;
    [data-child-wrapper-button] {
      justify-content: flex-end;
    }
  }
`;

type Props = {
  exchange: Exchange;
  onViewFullDescription: () => void;
};

export function SellerAndDescription({
  exchange,
  onViewFullDescription
}: Props) {
  const { offer } = exchange;
  return (
    <Container>
      <SellerID
        offer={offer}
        buyerOrSeller={offer?.seller}
        justifyContent="flex-start"
        withProfileImage
        data-seller-id
      />
      <ThemedButton
        data-description
        theme="blankSecondary"
        margin="1rem"
        onClick={onViewFullDescription}
      >
        <Typography
          color={colors.accent}
          fontWeight="600"
          $fontSize="0.875rem"
          alignItems="center"
          gap="0.7344rem"
        >
          <span style={{ textAlign: "right" }}>View full description</span>
          <TextAlignLeft size={30} color={colors.accent} />
        </Typography>
      </ThemedButton>
    </Container>
  );
}
