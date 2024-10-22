import React from "react";
import { styled } from "styled-components";
import { Grid } from "../../../../ui/Grid";
import { FairExchangePolicy } from "./FairExchangePolicy";
import { Button } from "../../../../buttons/Button";
import { InfoBox } from "./InfoBox";
import { theme } from "../../../../../theme";
import { CheckCircle } from "phosphor-react";
import { Typography } from "../../../../ui/Typography";
const colors = theme.colors.light;

const Wrapper = styled(Grid)``;

export type RequestShipmentSuccessProps = {
  onSureClick: () => void;
};

export const RequestShipmentSuccess = ({
  onSureClick
}: RequestShipmentSuccessProps) => {
  return (
    <Wrapper
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="2rem"
    >
      <Grid
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="0.5rem"
        marginBottom="0.5rem"
      >
        <CheckCircle weight="fill" color={colors.green} />
        <Typography fontSize="1.25rem" fontWeight={600}>
          Your product is on the way!
        </Typography>
      </Grid>
      <Grid
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="0.25rem"
      >
        <Typography fontSize="1.25rem" fontWeight={600}>
          What’s next?
        </Typography>
        <Typography fontSize="0.875rem" fontWeight={400}>
          Your product will arrive in 3-5 working days. <br /> You don't have to
          do anything else.
        </Typography>
      </Grid>
      <Button
        fill
        onClick={onSureClick}
        type="button"
        style={{ margin: "2rem 2.5rem" }}
      >
        Sure!
      </Button>
    </Wrapper>
  );
};
