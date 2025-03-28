import React from "react";
import { Grid } from "../../../../ui/Grid";
import { Button } from "../../../../buttons/Button";
import { colors, getCssVar } from "../../../../../theme";
import { CheckCircle } from "phosphor-react";
import { Typography } from "../../../../ui/Typography";

const Wrapper = Grid;

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
        <CheckCircle
          weight="fill"
          color={getCssVar("--main-accent-color")}
          style={{ minWidth: "42px", minHeight: "42px" }}
        />
        <Typography fontSize="1.25rem" fontWeight={600}>
          Your product is on the way!
        </Typography>
      </Grid>
      <Grid
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="0.25rem"
        padding="1.5rem 1rem"
      >
        <Typography fontSize="1rem" fontWeight={600}>
          What’s next?
        </Typography>
        <Typography
          fontSize="0.875rem"
          fontWeight={400}
          textAlign="center"
          color={colors.greyDark}
        >
          Your product will arrive in 3-5 working days. <br /> You don't have to
          do anything else.
        </Typography>
      </Grid>
      <div
        style={{
          border: `1px solid ${getCssVar("--background-accent-color")}`,
          width: "calc(100% + 2rem * 2)"
        }}
      />
      <Button
        fill
        onClick={onSureClick}
        type="button"
        style={{ margin: "0 2.5rem", borderRadius: "0.125rem" }}
      >
        Sure!
      </Button>
    </Wrapper>
  );
};
